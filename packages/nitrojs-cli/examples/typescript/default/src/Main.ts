import net from "net";

/**
 * Application main class
 */
new (class Main {
	/**
	 * Application main entry
	 */
	public constructor(args: string[] = []) {
		const tcpServer = net.createServer((socket) => {
			socket.on("data", (bufferData) => {
				console.log(bufferData.toString());
            });
            
            socket.on("end", () => {
                console.log("Connection closed");
            });
		});

		tcpServer.on("listening", () => {
			console.log("TCP > Ready");

			const client = new net.Socket();

			client.connect(9099, () => {
				console.log("CLient > Connected");
                client.write("Hello bois");
                client.destroy();
			});
		});

		tcpServer.listen(9099);
	}
})();
