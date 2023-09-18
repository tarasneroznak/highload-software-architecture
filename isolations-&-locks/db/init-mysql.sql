-- Active: 1690153883511@@localhost@9991

CREATE DATABASE hw10;

USE hw10;

CREATE TABLE
    users (
        id INT NOT NULL AUTO_INCREMENT,
        username VARCHAR(255) NOT NULL,
        status VARCHAR(10) NOT NULL,
        score INT NOT NULL,
        PRIMARY KEY (id)
    );

-- config

SHOW VARIABLES LIKE 'autocommit';

SET autocommit = 0;

SET GLOBAL innodb_status_output = ON;

SET GLOBAL innodb_status_output_locks = ON;