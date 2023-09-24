# Horizontal Sharding

1. Create 3 docker containers: postgresql-b, postgresql-b1, postgresql-b2
1. Setup horizontal/vertical sharding as it’s described in this lesson and with alternative tool ( citus, pgpool-|| etc )
1. Insert 1 000 000 rows into books
1. Measure performance for reads and writes
1. Do the same without sharding
1. Compare performance of 3 cases ( without sharding, FDW, and approach of your choice )

# Solution

Scripts:

- [Default SQl](./sql/postgres.sql)
- [FWD SQl](./sql/postgres-b.sql)
- [Citus SQl](./sql/citus.sql)
- [Measurement script](./main.sh)

Example of measurement command:

```bash
$ time docker exec postgres psql -U postgres -d postgres -c "call insert_random_books(1000);"
```

For measurements used `time` util, and for results took the `total` value.

| query/result                                     | Default | FWD    | Citus   |
| ------------------------------------------------ | ------- | ------ | ------- |
| insert_random_books(1000);                       | 0.086   | 0.353  | 2.020   |
| insert_random_books(10000);                      | 0.122   | 2.019  | 13.192  |
| insert_random_books(100000);                     | 0.719   | 19.674 | 2:01.48 |
| select \* from books;                            | 0.741   | 0.683  | 5.809   |
| select \* from books where category_id = 1;      | 0.354   | 0.353  | 2.550   |
| select \* from books where category_id = 2;      | 0.283   | 0.361  | 2.498   |
| select \* from books where category_id in (1,2); | 0.472   | 0.858  | 4.709   |

From this table, we can see that the default solution has the best results, which was expected, because all measurements are performed on the same machine, so there is no increase in resources. It is also worth noting that cytus has the worst result, most of this is also related to the solution built on docker.