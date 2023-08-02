-- Active: 1690153883511@@localhost@3306@hw10

USE hw10;

SHOW ENGINE INNODB STATUS;

SHOW VARIABLES LIKE 'autocommit';

-- levels

SET SESSION TRANSACTION ISOLATION LEVEL REPEATABLE READ;

SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;

SET SESSION TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;

SET SESSION TRANSACTION ISOLATION LEVEL SERIALIZABLE;

SHOW VARIABLES LIKE 'transaction_isolation';

-- trx 1

BEGIN;

SELECT * FROM users WHERE id > 1;

SELECT * FROM users WHERE id > 1;

ROLLBACK;

-- trx 2

BEGIN;

INSERT INTO users (username, status) VALUES ('Dan', 'active');

ROLLBACK;