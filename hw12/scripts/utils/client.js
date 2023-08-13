const redis = require('redis');

async function getClient(url) {
    const redisClient = redis.createClient({ url });
    if (!redisClient.isReady) {
        await redisClient.connect();
    }
    return redisClient;
}

module.exports = {
    getClient
}