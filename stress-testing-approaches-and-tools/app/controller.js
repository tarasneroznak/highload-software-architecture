const { insertFibNumber, findByUser } = require("./mongo.js");

const controller = async (req, res) => {
    if (req.url === "/favicon.ico") {
        res.writeHead(200, { "Content-Type": "image/x-icon" });
        res.end();
        return;
    }
    console.info("req", req.url);
    if (req.method !== "POST") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end();
    }
    const buffers = [];
    for await (const chunk of req) buffers.push(chunk);      
    const data = Buffer.concat(buffers).toString();
    const { name, number, result } = JSON.parse(data);
    try {
        await insertFibNumber(name, number, result)
        const mongoUsers = await findByUser(name);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ mongoUsers }));
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