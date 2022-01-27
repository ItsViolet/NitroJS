import TCPNodeServerSettings from "./TCPNodeServerSettings";
import { PartialDeep } from "type-fest";
import net, { Server as NetServer, Socket } from "net";
import tls, { Server as TLSServer } from "tls";
import { EventEmitter } from "events";
import TCPNodeServerSocket from "./TCPNodeServerSocket";
import deepmerge from "deepmerge";
import TCPNodeServerStartErrors from "./TCPNodeServerStartErrors";

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
	private server: NetServer | TLSServer;

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

		this._settings = deepmerge<TCPNodeServerSettings, PartialDeep<TCPNodeServerSettings>>(
			{
				port: 41258,
				host: "localhost",
				ssl: false,
				backlog: 100000,
			},
			settings
		);

		const connectionListener = (socket: Socket) => {
			const connection = new TCPNodeServerSocket(socket);

			socket.on("data", (chunk) => {
				console.log(chunk.toString());
				socket.write(Buffer.from("Your message received " + chunk.toString()));
			});

			this.aliveConnections.push(connection);
		};

		if (this._settings.ssl) {
			this.server = tls.createServer({
				cert: this._settings.ssl.certificate ?? "",
				key: this._settings.ssl.key ?? ""
			}, connectionListener);

			return;
		}

		this.server = net.createServer(connectionListener);
	}

	/**
	 * Start the TCP server
	 */
	public start(): Promise<string> {
		return new Promise((resolve, reject) => {
			if (this.listenerState == ListenerState.listening) {
				reject(
					new Error(
						`${TCPNodeServerStartErrors.currentlyListening} | The server is already listening`
					)
				);
				return;
			}

			if (this.listenerState == ListenerState.booting) {
				reject(
					new Error(`${TCPNodeServerStartErrors.currentlyBooting} | The server is already starting`)
				);
				return;
			}

			this.listenerState = ListenerState.booting;
			let listeningAddress = this.getListeningAddress();

			// TODO: Error listener

			this.server.listen(this._settings.port, this._settings.host, this._settings.backlog, () => {
				resolve(listeningAddress);
				this.emit("ready", listeningAddress);
			});
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
