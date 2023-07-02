const { insertFibUser, searchFibUser } = require("./elastic.js");
const { insertFibNumber, findByUser } = require("./mongo.js");
const { fib, randInt, randName } = require("./services.js");

const controller = async (req, res) => {
    if (req.url === '/favicon.ico') {
        res.writeHead(200, { 'Content-Type': 'image/x-icon' });
        res.end();
        return;
    }
    console.info('req', req.url);
    const userName = randName()
    const num = randInt(10, 30)
    const fibNum = fib(num)
    try {
        await insertFibUser(userName, num, fibNum)
        await insertFibNumber(userName, num, fibNum)

        const elasticHits = await searchFibUser(userName);
        const mongoUsers = await findByUser(userName);

        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ elasticHits, mongoUsers }));
    } catch (error) {
        console.error(error)
        res.statusCode = 500;
        res.setHeader("Content-Type", "text/plain");
        res.end("Internal server error");
    }
}

module.exports = {
    controller
}