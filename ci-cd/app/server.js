import http from "node:http";
import { controller } from "./controller.js";

const HOSTNAME = "127.0.0.1";
const PORT = 8000;

const server = http.createServer(controller);

server.listen(PORT, HOSTNAME, () => {
  console.log(`Server running at http://${HOSTNAME}:${PORT}/`);
});

server.on("error", (err) => {
  if (err.code === "EACCES") {
    console.log(`No access to port: ${PORT}`);
  }
});
