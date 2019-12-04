DROP PROCEDURE IF EXISTS policy_capped_storage_footprint_partitions;
DELIMITER $$
CREATE DEFINER=`eds_rw`@`%` PROCEDURE `policy_capped_storage_footprint_partitions`(IN trim_size_in_mb numeric)
    MODIFIES SQL DATA
    SQL SECURITY INVOKER
    COMMENT 'this procedure makes sure the total storage footprint is not more then (total_size) at the time of this calling'
main:
BEGIN
  DECLARE total_size_mb numeric default 0;
  DECLARE current_hour int4 default 0;
  DECLARE get_size CURSOR FOR select ROUND(SUM(size_bytes)/1024/1024) as size_mb from (
SELECT 
    a.TOTAL_EXTENTS * a.EXTENT_SIZE AS size_bytes
FROM
    INFORMATION_SCHEMA.FILES a,
    (SELECT 'msg_body' AS short_name UNION ALL SELECT 'msg_header_items' UNION ALL SELECT 'msg_header' UNION ALL SELECT 'keep_alive') b
WHERE
    a.FILE_NAME LIKE CONCAT(CONCAT('./eds_storage/', b.short_name), '#P%') ) v;
  OPEN get_size;
  FETCH get_size INTO total_size_mb;
  CLOSE get_size;
  IF total_size_mb < trim_size_in_mb THEN
    LEAVE main;
  END IF;
  -- get current hour 0-23 in UTC
  SET current_hour := HOUR(CURRENT_TIME());
  -- start truncating partitions untill we have less then "trim_size_in_mb",alter
  -- OR we reach full_circle
  BEGIN
     DECLARE partition_to_clean numeric default 0;
     DECLARE sqlText varchar(200) default '';
     SET partition_to_clean := MOD(current_hour + 2, 24);
	exit_trim:
    LOOP
         -- keep-alive table partition truncation
         SET @sqlText = concat('ALTER TABLE eds_storage.keep_alive TRUNCATE PARTITION congruent_remainder', CONVERT(partition_to_clean,CHAR(2)));
         PREPARE stmt FROM @sqlText;
         EXECUTE stmt;
         DEALLOCATE PREPARE stmt;
         -- msg_header table partition truncation
         SET @sqlText = concat('ALTER TABLE eds_storage.msg_header TRUNCATE PARTITION congruent_remainder', CONVERT(partition_to_clean,CHAR(2)));
         PREPARE stmt FROM @sqlText;
         EXECUTE stmt;
         DEALLOCATE PREPARE stmt;
         -- msg_header_items table partition truncation
         SET @sqlText = concat('ALTER TABLE eds_storage.msg_header_items TRUNCATE PARTITION congruent_remainder', CONVERT(partition_to_clean,CHAR(2)));
         PREPARE stmt FROM @sqlText;
         EXECUTE stmt;
         DEALLOCATE PREPARE stmt;
         -- msg_body table partition truncation
         SET @sqlText = concat('ALTER TABLE eds_storage.msg_body TRUNCATE PARTITION congruent_remainder', CONVERT(partition_to_clean,CHAR(2)));
         PREPARE stmt FROM @sqlText;
         EXECUTE stmt;
         DEALLOCATE PREPARE stmt;
         -- 
		 -- check again 
         --
         OPEN get_size;
	     FETCH get_size INTO total_size_mb;
         CLOSE get_size;
         IF total_size_mb < trim_size_in_mb THEN
			LEAVE exit_trim; -- done, quote achieved
		 END IF;
         -- continue to next partition
         SET partition_to_clean := MOD(partition_to_clean + 1, 24);
         IF partition_to_clean = current_hour THEN
           LEAVE exit_trim; -- trimmed all partitions
         END IF;
     END LOOP;-- exit_trim:
SELECT sqlText;
  END;
END$$
DELIMITER ;
