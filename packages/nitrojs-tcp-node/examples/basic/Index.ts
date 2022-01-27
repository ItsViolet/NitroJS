import { TCPNodeServer } from "../../src/TCPNode";
import fs from "fs";

const server = new TCPNodeServer({
	port: 9099,
	host: "0.0.0.0",
	ssl: {
		certificate: fs.readFileSync("C:\\Users\\xfaon\\Documents\\certificate.pem").toString(),
		key: fs.readFileSync("C:\\Users\\xfaon\\Documents\\key.pem").toString(),
	},
});

server.on("ready", (addr) => {
    console.log(`Server running at ${addr}`);
});

server.start();
