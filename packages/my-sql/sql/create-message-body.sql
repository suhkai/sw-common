drop table if exists msg_body;
create table msg_body(
	md5 char(32) NOT NULL,
    partition_key smallint(6) generated always as (hour(ts)),
    body TEXT,
    ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    key(md5)
) ENGINE=InnoDB AUTO_INCREMENT=8001 DEFAULT CHARSET=utf8;
alter table msg_body partition by list(partition_key) (
   partition congruent_remainder0 values in (0),
   partition congruent_remainder1 values in (1),
   partition congruent_remainder2 values in (2),
   partition congruent_remainder3 values in (3),
   partition congruent_remainder4 values in (4),
   partition congruent_remainder5 values in (5),
   partition congruent_remainder6 values in (6),
   partition congruent_remainder7 values in (7),
   partition congruent_remainder8 values in (8),
   partition congruent_remainder9 values in (9),
   partition congruent_remainder10 values in (10),
   partition congruent_remainder11 values in (11),
   partition congruent_remainder12 values in (12),
   partition congruent_remainder13 values in (13),
   partition congruent_remainder14 values in (14),
   partition congruent_remainder15 values in (15),
   partition congruent_remainder16 values in (16),
   partition congruent_remainder17 values in (17),
   partition congruent_remainder18 values in (18),
   partition congruent_remainder19 values in (19),
   partition congruent_remainder20 values in (20),
   partition congruent_remainder21 values in (21),
   partition congruent_remainder22 values in (22),
   partition congruent_remainder23 values in (23)
);
