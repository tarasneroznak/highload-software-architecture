#!/bin/bash

ACTIVE=1
TABLE_NAME="table1"

DROP_QUERY="DROP TABLE $TABLE_NAME"
docker exec mysql_master sh -c "export MYSQL_PWD=111; mysql -D mydb -u root -e '$DROP_QUERY'"

CREATE_TABLE_SQL="create table $TABLE_NAME(
   id INT NOT NULL AUTO_INCREMENT,
   title VARCHAR(100) NOT NULL,
   author VARCHAR(40) NOT NULL,
   PRIMARY KEY ( id )
);"

docker exec mysql_master sh -c "export MYSQL_PWD=111; mysql -D mydb -u root -e '$CREATE_TABLE_SQL'"

slave_status () {
    R=$(docker exec mysql_slave1 sh -c "export MYSQL_PWD=111; mysql -u root -e 'SHOW SLAVE STATUS \G'")
    S=$(echo "$R" | grep -o 'Slave_IO_Running:.*')
    echo $S
}

start_slave () {
    QUERY="START SLAVE"
    docker exec mysql_slave1 sh -c "export MYSQL_PWD=111; mysql -u root -e '$QUERY'"
}

stop_slave () {
    QUERY="STOP SLAVE"
    docker exec mysql_slave1 sh -c "export MYSQL_PWD=111; mysql -u root -e '$QUERY'"
}

drop_middle_column () {
    QUERY="ALTER TABLE $TABLE_NAME DROP COLUMN title"
    docker exec mysql_slave1 sh -c "export MYSQL_PWD=111; mysql -D mydb -u root -e '$QUERY'"
}

drop_last_column () {
    QUERY="ALTER TABLE $TABLE_NAME DROP COLUMN author"
    docker exec mysql_slave1 sh -c "export MYSQL_PWD=111; mysql -D mydb -u root -e '$QUERY'"
}

write () {
    INDEX=1
    while [ $ACTIVE -eq 1 ]
    do
        QUERY="INSERT INTO $TABLE_NAME (title, author) VALUES ('\''t$INDEX'\'', '\''a$INDEX'\'')"
        docker exec mysql_master sh -c "export MYSQL_PWD=111; mysql -D mydb -u root -e '$QUERY'"
        INDEX=$(($INDEX+1))
        if ((INDEX % 10 == 0))
        then
            slave_status
        fi
        if ((INDEX % 100 == 0))
        then
            stop_slave
            slave_status
            echo "Stopped slave"
        fi
        if ((INDEX % 200 == 0))
        then
            # drop_middle_column
            drop_last_column
            start_slave
            slave_status
            echo "Started slave"
        fi
    done
}

write
