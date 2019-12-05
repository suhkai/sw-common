drop event prune_eds_storage;
create event prune_eds_storage ON 
 SCHEDULE EVERY 5 MINUTE
 ON COMPLETION PRESERVE
 ENABLE
 COMMENT 'keep the storage footprint below a 20G'
 DO
   CALL eds_storage.policy_capped_storage_footprint_partitions(20000);