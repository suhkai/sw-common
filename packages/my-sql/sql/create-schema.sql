-- create the database , user and schema objects

drop database IF EXISTS bulk_insert_db_test;
create database bulk_insert_db_test;
drop user if exists 'bulk_insert_user'@'%';
create user 'bulk_insert_user'@'%' identified by 'Munch2019';
grant all privileges on *.* to 'bulk_insert_user'@'%';
DROP TABLE IF EXISTS bulk_insert_db_test.keep_alive;
CREATE TABLE bulk_insert_db_test.keep_alive (
  `partition_key` smallint(6) NOT NULL,
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
  `os_uptime` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



