const { write, flushAll } = require('./utils/write');
const { readAllKeys, read } = require('./utils/read');
const { setMaxmemoryPolicy } = require('./utils/set-maxmemory-policy');

const jobs = [
    // allkeys-lru: Keeps most recently used keys; removes least recently used (LRU) keys
    { policy: 'allkeys-lru', ttl: false },
    // allkeys-lfu: Keeps frequently used keys; removes least frequently used (LFU) keys
    { policy: 'allkeys-lfu', ttl: false },
    // volatile-lru: Removes least recently used (LRU) keys with an expire field set.
    { policy: 'volatile-lru', ttl: 'rand' },
    // volatile-lfu: Removes least frequently used (LFU) keys with an expire field set.
    { policy: 'volatile-lfu', ttl: 'rand' },
    // allkeys-random: Randomly removes keys
    { policy: 'allkeys-random', ttl: false },
    // volatile-random: Randomly removes keys with an expire field set
    { policy: 'volatile-random', ttl: 'rand'  },
    // volatile-ttl: Removes keys with an expire field set, and tries to remove keys with a shorter time to live (TTL) first
    { policy: 'volatile-ttl', ttl: 'rand' },
    // noeviction: Does not evict keys
    { policy: 'noeviction' },
]

async function main() {
    for (let i = 0; i < jobs.length; i++) {
        let { policy, ttl, reads = 10, writes = 2 } = jobs[i];
        console.log(`\n${policy}`);
        await setMaxmemoryPolicy(policy);
        await write(writes, ttl);
        const before = await readAllKeys();
        console.log('before', before.ttls);
        for (let i = 0; i < reads; i++) {
            await read(before.keys[0]);
        }
        for (let i = 0; i < reads / 2; i++) {
            await read(before.keys[1]);
        }
        await write(1, ttl);
        const after = await readAllKeys();
        console.log('after', after.ttls);
        await flushAll()
    }
}
main();