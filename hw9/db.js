const knex = require('knex')
const { faker } = require('@faker-js/faker');

const DATABASE_NAME = 'hw9';

const TABLE_NAME = 'users';
const BTREE_TABLE_NAME = 'users_btree';
const HASH_TABLE_NAME = 'users_hash';

const BTREE_INDEX_NAME = 'btree_index';
const HASH_INDEX_NAME = 'hash_index';

const INDEX_COLUMN = 'birthday';

function connect() {
    return knex({
        client: 'mysql',
        connection: {
            database: process.env.DATABASE ?? DATABASE_NAME,
            user: process.env.ROOT ?? 'root',
            password: process.env.PASSWORD ?? 'example'
        },
    });
}

function createTable(table) {
    table.increments('id').primary();
    table.string('email', 255).notNullable();
    table.string('first_name', 255).notNullable();
    table.string('last_name', 255).notNullable();
    table.string('birthday', 255);
}

async function createUsersTable(knex) {
    await knex.schema.createTable(TABLE_NAME, createTable)
    await knex.schema.createTable(BTREE_TABLE_NAME, createTable)
    await knex.schema.createTable(HASH_TABLE_NAME, createTable);
}

async function insertUsers(knex, tableName, data, trx) {
    await knex(tableName).transacting(trx).insert(data);
}

async function insertBatchUsers(knex, tableName, data, trx, chunkSize = 1000) {
    await knex.batchInsert(tableName, data, chunkSize).transacting(trx)
}

function generateUsers(count = 100) {
    return Array.from({ length: count }).map(() => ({
        email: faker.internet.email(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        birthday: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }),
    }));
}

async function createBtreeIndex(knex) {
    await knex.schema.alterTable(BTREE_TABLE_NAME, (table) => {
        table.index([INDEX_COLUMN], BTREE_INDEX_NAME, {
            storageEngineIndexType: 'btree',
        });
    });
}

async function dropBtreeIndex(knex) {
    await knex.schema.alterTable(BTREE_TABLE_NAME, (table) => {
        table.dropIndex([INDEX_COLUMN], BTREE_INDEX_NAME);
    });
}

async function createHashIndex(knex) {
    await knex.raw(`ALTER TABLE "hw9"."users_hash" DROP INDEX "hash_index", ADD HASH INDEX "hash_index" ("birthday");`)

    // .schema.alterTable(HASH_TABLE_NAME, (table) => {
    //     table.index([INDEX_COLUMN], HASH_INDEX_NAME, {
    //         storageEngineIndexType: 'hash',
    //     });
    // });
}

async function dropHashIndex(knex) {
    await knex.schema.alterTable(HASH_TABLE_NAME, (table) => {
        table.dropIndex([INDEX_COLUMN], HASH_INDEX_NAME);
    });
}

async function withTransaction(knex, handler) {
    return knex.transaction(async (trx) => {
        await handler(knex, trx);
        await trx.commit();
    });
}

module.exports = {
    TABLE_NAME,
    BTREE_TABLE_NAME,
    HASH_TABLE_NAME,
    BTREE_INDEX_NAME,
    HASH_INDEX_NAME,
    connect,
    createUsersTable,
    insertUsers,
    insertBatchUsers,
    createBtreeIndex,
    dropBtreeIndex,
    createHashIndex,
    dropHashIndex,
    generateUsers,
    withTransaction,
}
