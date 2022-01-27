import TCPNodeServerSettings from "./TCPNodeServerSettings";
import { PartialDeep } from "type-fest";
import net, { Server as NetServer, Socket } from "net";
import tls, { Server as TLSServer } from "tls";
import { EventEmitter } from "events";
import TCPNodeServerSocket from "./TCPNodeServerSocket";
import deepmerge from "deepmerge";
import TCPNodeServerStartErrors from "./TCPNodeServerStartErrors";
import * as uuid from "uuid";

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
	 * Total number of living connections
	 */
	private _totalAlive = 0;

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
			var connection = {
				canBeDeleted: new TCPNodeServerSocket(socket, this.generateUniqueID()),
			} as undefined | { canBeDeleted: TCPNodeServerSocket | undefined };

			connection?.canBeDeleted?.on("close-pre-handled", () => {
				const newAliveConnections = [] as TCPNodeServerSocket[];

				this.aliveConnections.forEach((possiblyAliveConnection) => {
					if (
						possiblyAliveConnection.alive ||
						connection?.canBeDeleted?.alive ||
						possiblyAliveConnection.id != connection?.canBeDeleted?.id
					) {
						newAliveConnections.push(possiblyAliveConnection);
						return;
					}

					this._totalAlive--;
					possiblyAliveConnection.internalForceCloseEmit();

					if (connection) delete connection.canBeDeleted;
					connection = undefined;
				});

				this.aliveConnections = newAliveConnections;
				this._totalAlive = this.aliveConnections.length;
			});

			if (connection?.canBeDeleted?.alive) {
				this.aliveConnections.push(connection?.canBeDeleted);
				this._totalAlive = this.aliveConnections.length;
				
				this.emit("open", connection.canBeDeleted);
			}
		};

		if (this._settings.ssl) {
			this.server = tls.createServer(
				{
					cert: this._settings.ssl.certificate ?? "",
					key: this._settings.ssl.key ?? "",
				},
				connectionListener
			);

			return;
		}

		this.server = net.createServer(connectionListener);
	}

	/**
	 * Total number of living connections
	 */
	public get totalAlive() {
		return this._totalAlive;
	}

	/**
	 * Generate a new unique connection ID
	 * @returns The unique ID
	 */
	private generateUniqueID() {
		let resultID = "";

		const checkIDExists = (checkID: string) => {
			let exists = false;

			this.aliveConnections.forEach((conn) => {
				if (conn.id == checkID) {
					exists = true;
				}
			});

			return exists;
		};

		const recurse = () => {
			const id = uuid.v4();

			if (checkIDExists(id)) {
				recurse();
				return;
			}

			resultID = id;
		};

		recurse();

		return resultID;
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
