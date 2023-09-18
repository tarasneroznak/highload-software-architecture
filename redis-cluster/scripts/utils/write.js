const { randomUUID, randomBytes } = require('node:crypto');
const { WRITE_LB_URL } = require('./config');
const { getClient } = require('./client');
const { randomInt } = require('./rand');

async function write(count = 1, ttl) {
    const client = await getClient(WRITE_LB_URL);
    const keys = []
    for (let i = 0; i < count; i++) {
        const key = randomUUID()
        const value = randomBytes(1024 * 724);
        try {
            await client.set(key, value);
            if (ttl && ttl !== false) {
                expire = ttl === 'rand' ? randomInt(10, 40) : ttl;
                await client.expire(key, expire);
            }
        } catch (error) {
            console.error(error);
        }
        keys.push(key)
    }
    await client.quit();
    return keys;
}

async function flushAll() {
    const client = await getClient(WRITE_LB_URL);
    await client.flushAll();
    await client.quit();
}

module.exports = {
    write,
    flushAll,
};