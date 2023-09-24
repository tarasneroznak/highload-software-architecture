#!/bin/bash

docker-compose down -v
docker-compose up -d

sleep 30

docker exec postgres psql -U postgres -f "/data.sql"
docker exec postgres_b psql -U postgres -f "/data.sql"
docker exec citus_master psql -U postgres -f "/data.sql"

# default
docker exec postgres psql -U postgres -f "/main.sql"

echo "default: insert_random_books(1000);"
time docker exec postgres psql -U postgres -d postgres -c "call insert_random_books(1000);" > /dev/null 2>&1
echo "default: insert_random_books(10000);"
time docker exec postgres psql -U postgres -d postgres -c "call insert_random_books(10000);" > /dev/null 2>&1
echo "default: insert_random_books(100000);"
time docker exec postgres psql -U postgres -d postgres -c "call insert_random_books(100000);" > /dev/null 2>&1

echo "default: select * from books;"
time docker exec postgres psql -U postgres -d postgres -c "select * from books;" > /dev/null 2>&1
echo "default: select * from books where category_id = 1;"
time docker exec postgres psql -U postgres -d postgres -c "select * from books where category_id = 1;" > /dev/null 2>&1
echo "default: select * from books where category_id = 2;"
time docker exec postgres psql -U postgres -d postgres -c "select * from books where category_id = 2;" > /dev/null 2>&1
echo "default: select * from books where category_id in (1,2);"
time docker exec postgres psql -U postgres -d postgres -c "select * from books where category_id in (1,2);" > /dev/null 2>&1


# fwd
docker exec postgres_b1 psql -U postgres -f "/main.sql"
docker exec postgres_b2 psql -U postgres -f "/main.sql"
docker exec postgres_b psql -U postgres -f "/main.sql"

docker exec postgres_b psql -U postgres -d postgres -c "call insert_random_books(4);"
docker exec postgres_b psql -U postgres -d postgres -c "select * from books;"

echo "fwd: insert_random_books(1000);"
time docker exec postgres_b psql -U postgres -d postgres -c "call insert_random_books(1000);" > /dev/null 2>&1
echo "fwd: insert_random_books(10000);"
time docker exec postgres_b psql -U postgres -d postgres -c "call insert_random_books(10000);" > /dev/null 2>&1
echo "fwd: insert_random_books(100000);"
time docker exec postgres_b psql -U postgres -d postgres -c "call insert_random_books(100000);" > /dev/null 2>&1

echo "fwd: select * from books;"
time docker exec postgres_b psql -U postgres -d postgres -c "select * from books;" > /dev/null 2>&1
echo "fwd: select * from books where category_id = 1;"
time docker exec postgres_b psql -U postgres -d postgres -c "select * from books where category_id = 1;" > /dev/null 2>&1
echo "fwd: select * from books where category_id = 2;"
time docker exec postgres_b psql -U postgres -d postgres -c "select * from books where category_id = 2;" > /dev/null 2>&1
echo "fwd: select * from books where category_id in (1,2);"
time docker exec postgres_b psql -U postgres -d postgres -c "select * from books where category_id in (1,2);" > /dev/null 2>&1

# Citus
docker exec citus_master psql -U postgres -f "/main.sql"
docker exec citus_master psql -U postgres -d postgres -c "call insert_random_books(4);"
docker exec citus_master psql -U postgres -d postgres -c "select * from books;"

echo "citus: insert_random_books(1000);"
time docker exec citus_master psql -U postgres -d postgres -c "call insert_random_books(1000);" > /dev/null 2>&1
echo "citus: insert_random_books(10000);"
time docker exec citus_master psql -U postgres -d postgres -c "call insert_random_books(10000);" > /dev/null 2>&1
echo "citus: insert_random_books(100000);"
time docker exec citus_master psql -U postgres -d postgres -c "call insert_random_books(100000);" > /dev/null 2>&1

echo "citus: select * from books;"
time docker exec citus_master psql -U postgres -d postgres -c "select * from books;" > /dev/null 2>&1
echo "citus: select * from books where category_id = 1;"
time docker exec citus_master psql -U postgres -d postgres -c "select * from books where category_id = 1;" > /dev/null 2>&1
echo "citus: select * from books where category_id = 2;"
time docker exec citus_master psql -U postgres -d postgres -c "select * from books where category_id = 2;" > /dev/null 2>&1
echo "citus: select * from books where category_id in (1,2);"
time docker exec citus_master psql -U postgres -d postgres -c "select * from books where category_id in (1,2);" > /dev/null 2>&1
