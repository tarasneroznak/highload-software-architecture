#!/bin/bash

docker-compose down -v
docker-compose up -d

sleep 5

docker exec postgres psql -U postgres -f "/data.sql"
docker exec postgres psql -U postgres -f "/main.sql"

echo "insert - 1000000"
docker exec postgres psql -U postgres -d postgres -c "call insert_random_books(100000);"
echo "size"
docker exec postgres psql -U postgres -d postgres -c "select pg_size_pretty(pg_database_size('postgres'));"

# Full
echo "Full"
full_backup_file="/full_backup.sql"
docker exec postgres pg_dump -U postgres -d postgres -f /full_backup.sql

# Incremental
echo "Incremental"
docker exec postgres psql -U postgres -d postgres -c "call insert_random_books(10000);"

timestamp=$(date +"%Y%m%d%H%M%S")
incremental_backup_file="/incremental_$timestamp.sql"
echo $timestamp
docker exec postgres pg_dump -U postgres -d postgres --file="$incremental_backup_file" --format=c --no-password --data-only --file="$full_backup_file"
