const { faker } = require('@faker-js/faker')
const {
    TABLE_NAME,
    BTREE_TABLE_NAME,
    HASH_TABLE_NAME,
    BTREE_INDEX_NAME,
    HASH_INDEX_NAME,
    connect,
    createUsersTable,
    insertUsers,
    createBtreeIndex,
    createHashIndex,
    generateUsers,
    withTransaction
} = require('./db')

const USERS_COUNT = 500000;

async function runTest(steps, options) {
    const mysql = connect()
    for (let i = 0; i < steps.length; i++) {
        await steps[i](mysql, options);
    }
    await mysql.destroy()
}

async function setup(mysql) {
    await createUsersTable(mysql)
    await createBtreeIndex(mysql)
    await createHashIndex(mysql)
}

async function checkIndexes(mysql, options) {
    try {
        const btree = await mysql.raw(`SHOW INDEXES FROM ${BTREE_TABLE_NAME}`)
        const hash = await mysql.raw(`SHOW INDEXES FROM ${HASH_TABLE_NAME}`)
        const hasBtree = btree[0].find((index) => index.Key_name === BTREE_INDEX_NAME)
        const hasHash = hash[0].find((index) => index.Key_name === HASH_INDEX_NAME)
        if (!hasBtree || !hasHash) {
            throw new Error('No indexes')
        }
    } catch (_) {
        console.log("INFO: creation tables and indexes");
        console.log('=====================')
        await setup(mysql);
    }
    console.log("INFO: indexes are created");
    console.log('=====================')
    const { rows_count } = await mysql.select().count('id as rows_count').from(TABLE_NAME).first()
    console.log(`Rows count: ${rows_count}`)
    const informationSchema = await mysql.select().from('information_schema.TABLES').where('TABLE_SCHEMA', '=', 'hw9')
    console.log('Tables:')
    informationSchema.forEach((table) => console.log(`\t${table.TABLE_NAME}: ${table.ENGINE}`))
    console.log('=====================')
}

async function insert(mysql, options) {
    console.log('=====================')
    for (let i = 0; i < 1; i++) {
        await mysql.raw(`SET GLOBAL innodb_flush_log_at_trx_commit = ${i};`)
        const [[{ Value }]] = await mysql.raw("SHOW VARIABLES LIKE 'innodb_flush_log_at_trx_commit'")
        console.log(`INFO: innodb_flush_log_at_trx_commit = ${Value}`)
        await testInsert(mysql, options)
        await testInsertBtree(mysql, options)
        await testInsertHash(mysql, options)
        console.log()
    }
}

async function testSelect(mysql, options) {
    console.time('select')
    await mysql.select().from(TABLE_NAME).where('birthday', '=', options.date)
    console.timeEnd('select')
}

async function testBtreeSelect(mysql, options) {
    console.time('btree_select')
    await mysql.select().from(BTREE_TABLE_NAME).where('birthday', '=', options.date)
    console.timeEnd('btree_select')
}

async function testHashSelect(mysql, options) {
    console.time('hash_select')
    await mysql.select().from(HASH_TABLE_NAME).where('birthday', '=', options.date)
    console.timeEnd('hash_select')
}

async function testInsert(mysql, options) {
    console.time('insert')
    await withTransaction(mysql, async (mysql, trx) => {
        await insertUsers(mysql, TABLE_NAME, options.users, trx)
    })
    console.timeEnd('insert')
}

async function testInsertBtree(mysql, options) {
    console.time('btree_insert')
    await withTransaction(mysql, async (mysql, trx) => {
        await insertUsers(mysql, BTREE_TABLE_NAME, options.users, trx)
    })
    console.timeEnd('btree_insert')
}

async function testInsertHash(mysql, options) {
    console.time('hash_insert')
    await withTransaction(mysql, async (mysql, trx) => {
        await insertUsers(mysql, HASH_TABLE_NAME, options.users, trx)
    })
    console.timeEnd('hash_insert')
}

const REPEAT_COUNT = parseInt(process.argv[2]) || 1;
console.log(`REPEAT_COUNT: ${REPEAT_COUNT}`);
async function bench(s = 0) {
    if (s >= REPEAT_COUNT) return;
    console.log(`=====================\n${s + 1} of ${REPEAT_COUNT}`);
    await runTest([
        checkIndexes,
        testSelect,
        testBtreeSelect,
        testHashSelect,
        insert,
    ], {
        date: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }),
        users: generateUsers(USERS_COUNT)
    })
    bench(s + 1);
}
bench();