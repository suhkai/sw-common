create table transaction (
  id NUMERIC,
  amount NUMERIC,
  status varchar(40),
  created_at timestamp,
  updated_at timestamp,
  deleted_at timestamp
);

BEGIN;
insert into transaction values(
124,
5349,
'COMPLETED',
'2021-02-15 18:59:03.861168',
'2021-02-15 18:59:03.861168',
NULL
);

insert into transaction values(
240,
5349,
'COMPLETED',
'2021-03-01 18:59:03.861168',
'2021-03-01 18:59:03.861168',
NULL
);
insert into transaction values(
456,
6234,
'COMPLETED',
'2021-03-08 18:59:03.861168',
'2021-03-08 18:59:03.861168',
NULL
);
insert into transaction values(
675,
5795,
'COMPLETED',
'2021-03-26 18:59:03.861168',
'2021-03-26 18:59:03.861168',
NULL
);
COMMIT;

create table transaction_payment (
  transaction_id numeric,
  payment_id numeric,
  amount numeric,
  created_at timestamp,
  updated_at timestamp,
  deleted_at timestamp
);
INSERT INTO transaction_payment
VALUES      ( 124,
              9,
              5349,
              '2021-02-15 18:59:03.861168',
              '2021-02-15 18:59:03.861168',
              NULL );

INSERT INTO transaction_payment
VALUES      ( 240,
              10,
              5349,
              '2021-03-01 18:59:03.861168',
              '2021-03-01 18:59:03.861168',
              NULL );

INSERT INTO transaction_payment
VALUES      ( 456,
              11,
              5349,
              '2021-03-08 18:59:03.861168',
              '2021-03-08 18:59:03.861168',
              NULL );

INSERT INTO transaction_payment
VALUES      ( 456,
              12,
              885,
              '2021-03-08 18:59:03.861168',
              '2021-03-08 18:59:03.861168',
              null );

INSERT INTO transaction_payment
VALUES      ( 675,
              12,
              4467,
              '2021-03-26 18:59:03.861168',
              '2021-03-26 18:59:03.861168',
               null );

INSERT INTO transaction_payment
VALUES      ( 675,
              13,
              1328,
              '2021-03-26 18:59:03.861168',
              '2021-03-26 18:59:03.861168',
               null ); 


create table payment (
 id NUMERIC,
 amount NUMERIC,
 paid_amount NUMERIC,
 status varchar(20),
 created_at timestamp,
 updated_at timestamp,
 deleted_at timestamp
);

insert into payment values (
9,
5349,
5349,
'PAID',
'2021-02-15 18:59:03.861168',
'2021-02-15 18:59:03.861168',
NULL
);
insert into payment values (
10,
5349,
5349,
'PAID',
'2021-03-01 18:59:03.861168',
'2021-03-01 18:59:03.861168',
NULL
);

insert into payment values (
11,
5349,
5349,
'PAID',
'2021-03-06 18:59:03.861168',
'2021-03-06 18:59:03.861168',
NULL
);
insert into payment values (
12,
5349,
5349,
'PAID',
'2021-03-06 18:59:03.861168',
'2021-03-26 18:59:03.861168',
NULL
);
insert into payment values (
13,
3456,
1328,
'DUE',
'2021-03-06 18:59:03.861168',
'2021-03-26 18:59:03.861168',
NULL
);