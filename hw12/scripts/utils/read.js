const { READ_LB_URL } = require('./config');
const { getClient } = require('./client');

async function read(key) {
    const client = await getClient(READ_LB_URL);
    const value = await client.get(key);
    if (!value) {
        console.log(`Key ${randomKey} was expired or evictioned`);
    }
    await client.quit();
    return value;
}

async function readAllKeys() {
    const client = await getClient(READ_LB_URL);
    const keys = await client.keys('*');
    const ttls = await Promise.all(keys.map(async (key) => [key, await client.ttl(key)]));
    await client.quit();
    return { keys, ttls };
}

async function readAll() {
    const client = await getClient(READ_LB_URL);
    const keys = await client.keys('*');
    const values = await client.mGet(keys);
    await client.quit();
    return values;
}

module.exports = {
    read,
    readAll,
    readAllKeys
};