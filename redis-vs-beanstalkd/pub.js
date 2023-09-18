const http = require('node:http');
const { setInterval } = require('node:timers/promises');
const redis = require('redis');
const { default: Beanstalkd } = require('beanstalkd');

const beanstalkd = (new Beanstalkd()).connect();

const redisRdb = redis.createClient({
    url: 'redis://localhost:6379'
});
const redisAof = redis.createClient({
    url: 'redis://localhost:6380'
});

async function main(req, res) {
    if (req.url === '/favicon.ico') {
        res.writeHead(200, { 'Content-Type': 'image/x-icon' });
        res.end();
        return;
    }
    if (!redisRdb.isReady) {
        await redisRdb.connect();
    }
    if (!redisAof.isReady) {
        await redisAof.connect();
    }
    const msg = JSON.stringify({ msg: 'Hello World!' })
    await redisRdb.publish('topic', msg);
    await redisAof.publish('topic', msg);

    const b = await beanstalkd;
    await b.use('topic');
    await b.put(0, 0, 0, msg);
    
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ ping: 'pong' }));
}

const HOSTNAME = process.env.HOSTNAME ?? '127.0.0.1';
const PORT = process.env.PORT ?? 8000;

const server = http.createServer(main);

server.listen(PORT, HOSTNAME, () => {
    console.log(`Server running at http://${HOSTNAME}:${PORT}/`);
});

server.on('error', (err) => {
    if (err.code === 'EACCES') {
        console.log(`No access to port: ${PORT}`);
    }
});
