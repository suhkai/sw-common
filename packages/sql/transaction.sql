

update transaction
  set 
    
The transaction with id 675 was refunded,
 create SQL script to make the necessary 
 changes to those tables which are: 

 1. Set the transaction status to REFUNDED 
 2.Delete the related transaction_payment rows 
 3.Set the related payment status row to DUE 
 4.Set the related payment paid_amounts to the correct values.
 
 We also need to ensure that all the operations run successfully

-- start transaction
-- should use postgresql db
BEGIN;
-- update transaction table
WITH total_sum AS
  (SELECT transaction_id,
          sum(amount) AS total
   FROM transaction_payment
   WHERE transaction_id = 675
   GROUP BY transaction_id)
UPDATE TRANSACTION AS t0
SET (amount,
     status,
     updated_at,
     deleted_at) =
  (SELECT t1.amount - total_sum.total,
          'REFUNDED',
          now()::TIMESTAMP,
          now()::TIMESTAMP
   FROM TRANSACTION AS t1,
                       total_sum
   WHERE t1.id = t0.id
     AND t1.id = total_sum.transaction_id )
WHERE t0.id = 675
  AND t0.deleted_at IS NULL;

-- update transaction_payment
WITH trans_payment AS
  (SELECT transaction_id,
          payment_id,
          sum(amount) s_amount
   FROM transaction_payment
   WHERE transaction_id = 675
   GROUP BY transaction_id,
            payment_id)
UPDATE payment p0
SET paid_amount = p0.paid_amount - tp.s_amount,
    status = 'DUE',
    updated_at = now()::TIMESTAMP,
    deleted_at = now()::TIMESTAMP
FROM trans_payment tp
WHERE p0.id = tp.payment_id
  AND deleted_at IS NULL;

-- update transaction_payment table

UPDATE transaction_payment p0
SET amount=0,
    updated_at = now()::TIMESTAMP,
    deleted_at = now()::TIMESTAMP
WHERE p0.deleted_at IS NULL
  AND transaction_id = 675;


COMMIT;