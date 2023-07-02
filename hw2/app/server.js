const http = require('http');
const { controller } = require('./controller');

const HOSTNAME = process.env.HOSTNAME ?? '127.0.0.1';
const PORT = process.env.PORT ?? 8000;

const server = http.createServer(controller);

server.listen(PORT, HOSTNAME, () => {
    console.log(`Server running at http://${HOSTNAME}:${PORT}/`);
});

server.on('error', (err) => {
    if (err.code === 'EACCES') {
        console.log(`No access to port: ${PORT}`);
    }
});