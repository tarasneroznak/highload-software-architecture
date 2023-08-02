# Isolations & locks

Set up percona and postgre and create an InnoDB table

By changing isolation levels and making parallel queries, reproduce the main problems of parallel access:

- lost update
- dirty read
- non-repeatable read
- phantom read

# Solution

Before starting script execution run initialization [scripts](./db) for the specific database

## Dirty read

[sql scripts](./dirty-read)

| trx1                               | trx2                                             |
| ---------------------------------- | ------------------------------------------------ |
| BEGIN;                             |                                                  |
| SELECT \* FROM users WHERE id = 1; |                                                  |
|                                    | BEGIN;                                           |
|                                    | UPDATE users SET "status" = active WHERE id = 1; |
| SELECT \* FROM users WHERE id = 1; |                                                  |

|                  | MySQL | Postgres |
| ---------------- | ----- | -------- |
| REPEATABLE READ  | x     | x        |
| READ COMMITTED   | x     | x        |
| READ UNCOMMITTED | +     | x        |
| SERIALIZABLE     | x     | x        |

## Lost update

[sql scripts](./lost-update)

| trx1                                           | trx2                                           |
| ---------------------------------------------- | ---------------------------------------------- |
| BEGIN;                                         |                                                |
| SELECT \* FROM users WHERE id = 1;             |                                                |
|                                                | BEGIN;                                         |
|                                                | SELECT \* FROM users WHERE id = 1;             |
|                                                | UPDATE users SET status = 'trx2' WHERE id = 1; |
|                                                | COMMIT;                                        |
| UPDATE users SET status = 'trx1' WHERE id = 1; |                                                |
| COMMIT;                                        |                                                |

|                  | MySQL | Postgres |
| ---------------- | ----- | -------- |
| REPEATABLE READ  | +     | +        |
| READ COMMITTED   | +     | +        |
| READ UNCOMMITTED | +     | +        |
| SERIALIZABLE     | x     | x        |

## Non repeatable read

[sql scripts](./non-repeatable-read)

| trx1                               | trx2                                       |
| ---------------------------------- | ------------------------------------------ |
| BEGIN;                             |                                            |
|                                    | BEGIN;                                     |
| SELECT \* FROM users WHERE id = 1; |                                            |
|                                    | UPDATE users SET score = 500 WHERE id = 2; |
|                                    | COMMIT;                                    |
| SELECT \* FROM users WHERE id = 2; |                                            |
| COMMIT;                            |                                            |

|                  | MySQL | Postgres |
| ---------------- | ----- | -------- |
| REPEATABLE READ  | x     | x        |
| READ COMMITTED   | +     | +        |
| READ UNCOMMITTED | +     | +        |
| SERIALIZABLE     | x     | x        |

## Phantom read

[sql scripts](./phantom-read)

| trx1                               | trx2                                                           |
| ---------------------------------- | -------------------------------------------------------------- |
| BEGIN;                             |                                                                |
|                                    | BEGIN;                                                         |
| SELECT \* FROM users WHERE id > 1; |                                                                |
|                                    | INSERT INTO users (username, status) VALUES ('Dan', 'active'); |
| SELECT \* FROM users WHERE id > 1; |                                                                |
|                                    | ROLLBACK;                                                      |
| ROLLBACK;                          |                                                                |

|                  | MySQL | Postgres |
| ---------------- | ----- | -------- |
| REPEATABLE READ  | +     | +        |
| READ COMMITTED   | +     | +        |
| READ UNCOMMITTED | +     | +        |
| SERIALIZABLE     | x     | x        |
