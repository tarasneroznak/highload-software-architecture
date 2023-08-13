const { WRITE_LB_URL } = require('./config');
const { getClient } = require('./client');

const ALLOWED_MEMORY_POLICY = [
    'volatile-lru',
    'allkeys-lru',
    'volatile-lfu',
    'allkeys-lfu',
    'volatile-random',
    'allkeys-random',
    'volatile-ttl',
    'noeviction'
];

async function setMaxmemoryPolicy(policy) {
    if (!ALLOWED_MEMORY_POLICY.includes(policy)) {
        throw new Error(`Invalid maxmemory-policy: ${MAX_MEMORY_POLICY}`)
    }
    const client = await getClient(WRITE_LB_URL)
    await client.configSet('maxmemory-policy', policy)
    await client.quit()
}


module.exports = {
    setMaxmemoryPolicy
}