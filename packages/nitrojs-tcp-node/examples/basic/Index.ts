import { TCPNodeServer } from "../../src/TCPNode";

const server = new TCPNodeServer({
    port: 9099,
    host: "0.0.0.0"
});

server.on("ready", (addr) => {
    console.log(`Server running at ${addr}`);
});

server.start();
