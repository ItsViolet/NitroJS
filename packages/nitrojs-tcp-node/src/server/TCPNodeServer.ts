import TCPNodeServerSettings from "./TCPNodeServerSettings";
import { PartialDeep } from "type-fest";
import net, { Server } from "net";
import { EventEmitter } from "events";
import TCPNodeServerSocket from "./TCPNodeServerSocket";

declare interface TCPNodeServer {
	/**
	 * Listen for when the server is listening
	 * @param event Event name
	 * @param listener Event listener
	 */
	on(event: "ready", listener: (address: string) => void): this;

	/**
	 * Listen for when a new socket is opened to the server
	 * @param event Event name
	 * @param listener Event listener
	 */
	on(event: "open", listener: (socket: TCPNodeServerSocket) => void): this;

	on(event: string, listener: Function): this;
}

/**
 * The state of the socket listener
 */
enum ListenerState {
	/**
	 * The server is booting
	 */
	booting,

	/**
	 * The server is ready
	 */
	listening,

	/**
	 * The server is not alive
	 */
	dead,
}

/**
 * Create a TCP server for a node environment
 */
class TCPNodeServer extends EventEmitter {
	/**
	 * The socket server
	 */
	private server: Server;

	/**
	 * All currently alive connections
	 */
	private aliveConnections = [] as TCPNodeServerSocket[];

	/**
	 * The server listening state
	 */
	private listenerState = ListenerState.dead;

	/**
	 * Server settings
	 */
	private _settings: TCPNodeServerSettings;

	/**
	 * Create a new TCP node server
	 * @param settings Settings for the server
	 */
	public constructor(settings: PartialDeep<TCPNodeServerSettings>) {
		super();
		// ! Install deep merge and merge configs
		this._settings = {
			...{
				port: 41258,
				host: "localhost",
				ssl: false,
			},
			...settings,
		};

		this.server = net.createServer((socket) => {
			const connection = new TCPNodeServerSocket(socket);

			this.aliveConnections.push(connection);
		});
	}

	/**
	 * Start the TCP server
	 */
	public start(): Promise<string> {
		return new Promise((resolve, reject) => {
			if (this.listenerState == ListenerState.listening) {
				// ! TODO: Error code
				reject(new Error("The server is already listening"));
				return;
			}

			if (this.listenerState == ListenerState.booting) {
				reject(new Error("The server is already starting"));
				return;
            }
            
            this.listenerState = ListenerState.booting;

			let listeningAddress = this.getListeningAddress();
		});
	}

	/**
	 * Get the server listening address
	 * @returns The full listening address
	 */
	public getListeningAddress(): string {
		let protocol = this._settings.ssl ? "tls://" : "tcp://";
		return `${protocol}${this._settings.host}:${this._settings.port}`;
	}
}

export default TCPNodeServer;
