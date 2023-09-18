const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'example',
    database: 'example',
    pool: {
        max: 100,
        min: 10,
        idle: 10000
    }
});

connection.connect();

const sleep = process.argv[2] || 1;
for (let i = 0; i < 100000; i++) {
    connection.query(`SELECT SLEEP(${sleep})`, () => {});
    connection.query(`SELECT SLEEP(${sleep})`, () => {});
    connection.query(`SELECT SLEEP(${sleep})`, () => {});
    connection.query(`SELECT SLEEP(${sleep})`, () => {});
    connection.query(`SELECT SLEEP(${sleep})`, () => {});
    connection.query(`SELECT SLEEP(${sleep})`, () => {});
    connection.query(`SELECT SLEEP(${sleep})`, () => {});
    connection.query(`SELECT SLEEP(${sleep})`, () => {});
    connection.query(`SELECT SLEEP(${sleep})`, () => {});
    connection.query(`SELECT SLEEP(${sleep})`, () => {});
    connection.query(`SELECT SLEEP(${sleep})`, () => {});
    connection.query(`SELECT SLEEP(${sleep})`, () => {});
    connection.query(`SELECT SLEEP(${sleep})`, () => {});
    connection.query(`SELECT SLEEP(${sleep})`, () => {});
    connection.query(`SELECT SLEEP(${sleep})`, () => {});
}

connection.end();