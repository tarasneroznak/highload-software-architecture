BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ;

BEGIN TRANSACTION ISOLATION LEVEL READ COMMITTED;

BEGIN TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;

BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE;

SHOW transaction_isolation;

-- trx 1

SELECT * FROM users WHERE id = 1;

SELECT * FROM users WHERE id = 2;

ROLLBACK;

-- trx 2

UPDATE users SET score = 500 WHERE id = 2;

ROLLBACK;