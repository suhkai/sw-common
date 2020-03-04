-- MySQL dump 10.13  Distrib 5.7.28-31, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: eds_storage
-- ------------------------------------------------------
-- Server version	5.7.28-31

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
/*!50717 SELECT COUNT(*) INTO @rocksdb_has_p_s_session_variables FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'performance_schema' AND TABLE_NAME = 'session_variables' */;
/*!50717 SET @rocksdb_get_is_supported = IF (@rocksdb_has_p_s_session_variables, 'SELECT COUNT(*) INTO @rocksdb_is_supported FROM performance_schema.session_variables WHERE VARIABLE_NAME=\'rocksdb_bulk_load\'', 'SELECT 0') */;
/*!50717 PREPARE s FROM @rocksdb_get_is_supported */;
/*!50717 EXECUTE s */;
/*!50717 DEALLOCATE PREPARE s */;
/*!50717 SET @rocksdb_enable_bulk_load = IF (@rocksdb_is_supported, 'SET SESSION rocksdb_bulk_load = 1', 'SET @rocksdb_dummy_bulk_load = 0') */;
/*!50717 PREPARE s FROM @rocksdb_enable_bulk_load */;
/*!50717 EXECUTE s */;
/*!50717 DEALLOCATE PREPARE s */;

--
-- Table structure for table `keep_alive`
--

DROP TABLE IF EXISTS `keep_alive`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `keep_alive` (
  `ts` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `partition_key` smallint(6) GENERATED ALWAYS AS (hour(`ts`)) VIRTUAL,
  `route_names` varchar(8192) NOT NULL,
  `pid` bigint(20) NOT NULL,
  `app` varchar(255) NOT NULL,
  `process_cpu` float DEFAULT NULL,
  `process_memory` float DEFAULT NULL,
  `process_uptime` float DEFAULT NULL,
  `node_version` varchar(255) DEFAULT NULL,
  `pck_version` varchar(255) DEFAULT NULL,
  `os_total_memory` bigint(20) DEFAULT NULL,
  `os_free_memory` bigint(20) DEFAULT NULL,
  `os_cpus` smallint(6) DEFAULT NULL,
  `os_load0` float DEFAULT NULL,
  `os_load1` float DEFAULT NULL,
  `os_load2` float DEFAULT NULL,
  `os_uptime` bigint(20) DEFAULT NULL,
  KEY `keep_alive_ts_idx` (`ts`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8
/*!50100 PARTITION BY LIST (partition_key)
(PARTITION congruent_remainder0 VALUES IN (0) ENGINE = InnoDB,
 PARTITION congruent_remainder1 VALUES IN (1) ENGINE = InnoDB,
 PARTITION congruent_remainder2 VALUES IN (2) ENGINE = InnoDB,
 PARTITION congruent_remainder3 VALUES IN (3) ENGINE = InnoDB,
 PARTITION congruent_remainder4 VALUES IN (4) ENGINE = InnoDB,
 PARTITION congruent_remainder5 VALUES IN (5) ENGINE = InnoDB,
 PARTITION congruent_remainder6 VALUES IN (6) ENGINE = InnoDB,
 PARTITION congruent_remainder7 VALUES IN (7) ENGINE = InnoDB,
 PARTITION congruent_remainder8 VALUES IN (8) ENGINE = InnoDB,
 PARTITION congruent_remainder9 VALUES IN (9) ENGINE = InnoDB,
 PARTITION congruent_remainder10 VALUES IN (10) ENGINE = InnoDB,
 PARTITION congruent_remainder11 VALUES IN (11) ENGINE = InnoDB,
 PARTITION congruent_remainder12 VALUES IN (12) ENGINE = InnoDB,
 PARTITION congruent_remainder13 VALUES IN (13) ENGINE = InnoDB,
 PARTITION congruent_remainder14 VALUES IN (14) ENGINE = InnoDB,
 PARTITION congruent_remainder15 VALUES IN (15) ENGINE = InnoDB,
 PARTITION congruent_remainder16 VALUES IN (16) ENGINE = InnoDB,
 PARTITION congruent_remainder17 VALUES IN (17) ENGINE = InnoDB,
 PARTITION congruent_remainder18 VALUES IN (18) ENGINE = InnoDB,
 PARTITION congruent_remainder19 VALUES IN (19) ENGINE = InnoDB,
 PARTITION congruent_remainder20 VALUES IN (20) ENGINE = InnoDB,
 PARTITION congruent_remainder21 VALUES IN (21) ENGINE = InnoDB,
 PARTITION congruent_remainder22 VALUES IN (22) ENGINE = InnoDB,
 PARTITION congruent_remainder23 VALUES IN (23) ENGINE = InnoDB) */;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `msg_body`
--

DROP TABLE IF EXISTS `msg_body`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `msg_body` (
  `md5` char(32) NOT NULL,
  `partition_key` smallint(6) GENERATED ALWAYS AS (hour(`ts`)) VIRTUAL,
  `body` text,
  `ts` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  KEY `md5` (`md5`),
  KEY `ts` (`ts`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8
/*!50100 PARTITION BY LIST (partition_key)
(PARTITION congruent_remainder0 VALUES IN (0) ENGINE = InnoDB,
 PARTITION congruent_remainder1 VALUES IN (1) ENGINE = InnoDB,
 PARTITION congruent_remainder2 VALUES IN (2) ENGINE = InnoDB,
 PARTITION congruent_remainder3 VALUES IN (3) ENGINE = InnoDB,
 PARTITION congruent_remainder4 VALUES IN (4) ENGINE = InnoDB,
 PARTITION congruent_remainder5 VALUES IN (5) ENGINE = InnoDB,
 PARTITION congruent_remainder6 VALUES IN (6) ENGINE = InnoDB,
 PARTITION congruent_remainder7 VALUES IN (7) ENGINE = InnoDB,
 PARTITION congruent_remainder8 VALUES IN (8) ENGINE = InnoDB,
 PARTITION congruent_remainder9 VALUES IN (9) ENGINE = InnoDB,
 PARTITION congruent_remainder10 VALUES IN (10) ENGINE = InnoDB,
 PARTITION congruent_remainder11 VALUES IN (11) ENGINE = InnoDB,
 PARTITION congruent_remainder12 VALUES IN (12) ENGINE = InnoDB,
 PARTITION congruent_remainder13 VALUES IN (13) ENGINE = InnoDB,
 PARTITION congruent_remainder14 VALUES IN (14) ENGINE = InnoDB,
 PARTITION congruent_remainder15 VALUES IN (15) ENGINE = InnoDB,
 PARTITION congruent_remainder16 VALUES IN (16) ENGINE = InnoDB,
 PARTITION congruent_remainder17 VALUES IN (17) ENGINE = InnoDB,
 PARTITION congruent_remainder18 VALUES IN (18) ENGINE = InnoDB,
 PARTITION congruent_remainder19 VALUES IN (19) ENGINE = InnoDB,
 PARTITION congruent_remainder20 VALUES IN (20) ENGINE = InnoDB,
 PARTITION congruent_remainder21 VALUES IN (21) ENGINE = InnoDB,
 PARTITION congruent_remainder22 VALUES IN (22) ENGINE = InnoDB,
 PARTITION congruent_remainder23 VALUES IN (23) ENGINE = InnoDB) */;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `msg_header`
--

DROP TABLE IF EXISTS `msg_header`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `msg_header` (
  `id` varchar(36) NOT NULL COMMENT 'this is a uuid',
  `partition_key` smallint(6) GENERATED ALWAYS AS (hour(`ts`)) VIRTUAL,
  `body_md5_fk` char(32) NOT NULL,
  `ts` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  KEY `id` (`id`),
  KEY `body_md5_fk` (`body_md5_fk`),
  KEY `ts` (`ts`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8
/*!50100 PARTITION BY LIST (partition_key)
(PARTITION congruent_remainder0 VALUES IN (0) ENGINE = InnoDB,
 PARTITION congruent_remainder1 VALUES IN (1) ENGINE = InnoDB,
 PARTITION congruent_remainder2 VALUES IN (2) ENGINE = InnoDB,
 PARTITION congruent_remainder3 VALUES IN (3) ENGINE = InnoDB,
 PARTITION congruent_remainder4 VALUES IN (4) ENGINE = InnoDB,
 PARTITION congruent_remainder5 VALUES IN (5) ENGINE = InnoDB,
 PARTITION congruent_remainder6 VALUES IN (6) ENGINE = InnoDB,
 PARTITION congruent_remainder7 VALUES IN (7) ENGINE = InnoDB,
 PARTITION congruent_remainder8 VALUES IN (8) ENGINE = InnoDB,
 PARTITION congruent_remainder9 VALUES IN (9) ENGINE = InnoDB,
 PARTITION congruent_remainder10 VALUES IN (10) ENGINE = InnoDB,
 PARTITION congruent_remainder11 VALUES IN (11) ENGINE = InnoDB,
 PARTITION congruent_remainder12 VALUES IN (12) ENGINE = InnoDB,
 PARTITION congruent_remainder13 VALUES IN (13) ENGINE = InnoDB,
 PARTITION congruent_remainder14 VALUES IN (14) ENGINE = InnoDB,
 PARTITION congruent_remainder15 VALUES IN (15) ENGINE = InnoDB,
 PARTITION congruent_remainder16 VALUES IN (16) ENGINE = InnoDB,
 PARTITION congruent_remainder17 VALUES IN (17) ENGINE = InnoDB,
 PARTITION congruent_remainder18 VALUES IN (18) ENGINE = InnoDB,
 PARTITION congruent_remainder19 VALUES IN (19) ENGINE = InnoDB,
 PARTITION congruent_remainder20 VALUES IN (20) ENGINE = InnoDB,
 PARTITION congruent_remainder21 VALUES IN (21) ENGINE = InnoDB,
 PARTITION congruent_remainder22 VALUES IN (22) ENGINE = InnoDB,
 PARTITION congruent_remainder23 VALUES IN (23) ENGINE = InnoDB) */;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `msg_header_items`
--

DROP TABLE IF EXISTS `msg_header_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `msg_header_items` (
  `ts` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `partition_key` smallint(6) GENERATED ALWAYS AS (hour(`ts`)) VIRTUAL,
  `header_id_fk` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `value` varchar(255) DEFAULT NULL,
  KEY `header_id_fk` (`header_id_fk`),
  KEY `name` (`name`),
  KEY `value` (`value`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8
/*!50100 PARTITION BY LIST (partition_key)
(PARTITION congruent_remainder0 VALUES IN (0) ENGINE = InnoDB,
 PARTITION congruent_remainder1 VALUES IN (1) ENGINE = InnoDB,
 PARTITION congruent_remainder2 VALUES IN (2) ENGINE = InnoDB,
 PARTITION congruent_remainder3 VALUES IN (3) ENGINE = InnoDB,
 PARTITION congruent_remainder4 VALUES IN (4) ENGINE = InnoDB,
 PARTITION congruent_remainder5 VALUES IN (5) ENGINE = InnoDB,
 PARTITION congruent_remainder6 VALUES IN (6) ENGINE = InnoDB,
 PARTITION congruent_remainder7 VALUES IN (7) ENGINE = InnoDB,
 PARTITION congruent_remainder8 VALUES IN (8) ENGINE = InnoDB,
 PARTITION congruent_remainder9 VALUES IN (9) ENGINE = InnoDB,
 PARTITION congruent_remainder10 VALUES IN (10) ENGINE = InnoDB,
 PARTITION congruent_remainder11 VALUES IN (11) ENGINE = InnoDB,
 PARTITION congruent_remainder12 VALUES IN (12) ENGINE = InnoDB,
 PARTITION congruent_remainder13 VALUES IN (13) ENGINE = InnoDB,
 PARTITION congruent_remainder14 VALUES IN (14) ENGINE = InnoDB,
 PARTITION congruent_remainder15 VALUES IN (15) ENGINE = InnoDB,
 PARTITION congruent_remainder16 VALUES IN (16) ENGINE = InnoDB,
 PARTITION congruent_remainder17 VALUES IN (17) ENGINE = InnoDB,
 PARTITION congruent_remainder18 VALUES IN (18) ENGINE = InnoDB,
 PARTITION congruent_remainder19 VALUES IN (19) ENGINE = InnoDB,
 PARTITION congruent_remainder20 VALUES IN (20) ENGINE = InnoDB,
 PARTITION congruent_remainder21 VALUES IN (21) ENGINE = InnoDB,
 PARTITION congruent_remainder22 VALUES IN (22) ENGINE = InnoDB,
 PARTITION congruent_remainder23 VALUES IN (23) ENGINE = InnoDB) */;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50112 SET @disable_bulk_load = IF (@is_rocksdb_supported, 'SET SESSION rocksdb_bulk_load = @old_rocksdb_bulk_load', 'SET @dummy_rocksdb_bulk_load = 0') */;
/*!50112 PREPARE s FROM @disable_bulk_load */;
/*!50112 EXECUTE s */;
/*!50112 DEALLOCATE PREPARE s */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-03-04 13:59:48

DELIMITER $$
CREATE DEFINER=`eds_rw`@`%` PROCEDURE `policy_capped_storage_footprint_partitions`(IN trim_size_in_mb numeric)
    MODIFIES SQL DATA
    SQL SECURITY INVOKER
    COMMENT 'this procedure makes sure the total storage footprint is not more then (total_size) at the time of this calling'
main:
BEGIN
  DECLARE total_size_mb numeric default 0;
  DECLARE current_hour int4 default 0;
  DECLARE get_size CURSOR FOR SELECT ROUND(sum(data_length + index_length)/1024/1024,2) size_mb
FROM
    information_schema.TABLES
WHERE
    LOWER(table_name) IN ('msg_header_items' , 'msg_body', 'msg_header', 'keep_alive');
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
