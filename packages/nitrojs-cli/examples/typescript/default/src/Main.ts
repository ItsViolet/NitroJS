import net from "net";

/**
 * Application main class
 */ 
new (class Main {
	/**  
	 * Application main entry
	 */ 
	public constructor(args: string[] = []) {
        console.log("This will be a TCP server"); 
        let ind = 0;
        setInterval(() => {  
            console.log(ind++); 
        }, 300);     
                     
        return;              
  
		const tcpServer = net.createServer((socket) => {
			socket.on("data", (bufferData) => {
				console.log(bufferData.toString());
			});  
		});

		tcpServer.on("listening", () => {
			console.log("TCP > Ready");

			const client = net.createConnection({
				port: process.env.PORT as unknown as number,
            }, () => {

            });
            
            client.connect({path: "/"});
		});

		tcpServer.listen(process.env.PORT);
	}
})();
