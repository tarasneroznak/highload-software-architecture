#!/bin/bash

docker exec postgres1 psql -U postgres -d postgres -c "show archive_mode"
docker exec postgres2 psql -U postgres -d postgres -c "show archive_mode"
docker exec postgres3 psql -U postgres -d postgres -c "show archive_mode"

echo "create stanza"
docker exec postgres1 pgbackrest --stanza=full stanza-create
docker exec postgres2 pgbackrest --stanza=incremental stanza-create
docker exec postgres3 pgbackrest --stanza=differential stanza-create

echo "backup full"
docker exec postgres1 pgbackrest backup --stanza=full --type=full
echo "backup incremental"
docker exec postgres2 pgbackrest backup --stanza=incremental --type=incr
echo "backup differential"
docker exec postgres3 pgbackrest backup --stanza=differential --type=diff

sleep 10

echo "insert - 100000"
docker exec postgres1 psql -U postgres -d postgres -c "call insert_random_books(100000);"
docker exec postgres2 psql -U postgres -d postgres -c "call insert_random_books(100000);"
docker exec postgres3 psql -U postgres -d postgres -c "call insert_random_books(100000);"

echo "backup2 full"
docker exec postgres1 pgbackrest backup --stanza=full --type=full
echo "backup2 incremental"
docker exec postgres2 pgbackrest backup --stanza=incremental --type=incr
echo "backup2 differential"
docker exec postgres3 pgbackrest backup --stanza=differential --type=diff
