import { Socket } from "net";
import { EventEmitter } from "events";
import { PartialDeep } from "type-fest";
import deepmerge from "deepmerge";

declare interface TCPNodeServerSocket {
	/**
	 * Listen for when the socket disconnects before the server even gets to process the data
	 * @param event Event name
	 * @param listener Event listener
	 * @internal
	 */
	on(event: "close-pre-handled", listener: () => void): this;

	/**
	 * Listen for when the socket is closed
	 * @param event Event name
	 * @param listener Event listener
	 */
	on(event: "close", listener: () => void): this;

	on(event: string, listener: () => void): this;
}

/**
 * The socket server's socket
 */
class TCPNodeServerSocket extends EventEmitter {
	/**
	 * The connection's unique identifier
	 */
	private _id: string;

	/**
	 * If the connection is alive
	 */
	private _alive = true;

	/**
	 * The socket client
	 */
	private socket: Socket;

	/**
	 * All request listeners
	 */
	private requestListeners = [] as {
		channel: string;
		listener: (requestMessage: Object) => void;
		defaultObjectValues: Object;
	}[];

	/**
	 * Create and initialize a new net/TLS socket for a higher level API
	 * @param netSocket The net/TLS socket
	 * @param identifier The connection unique identifier
	 */
	public constructor(netSocket: Socket, identifier: string) {
		super();
		this.socket = netSocket;

		netSocket.on("data", (chunk) => {
			try {
				const jsonObject = JSON.parse(chunk.toString());

				if (typeof jsonObject.channel != "string") {
					return this.kill();
				}

				if (typeof jsonObject.body != "object" || Array.isArray(jsonObject.body)) {
					return this.kill();
				}

				this.requestListeners.forEach((requestListener) => {
					if (requestListener.channel == jsonObject.channel) {
						requestListener.listener(
							deepmerge(requestListener.defaultObjectValues, jsonObject.body)
						);
					}
				});
			} catch {
				this.kill();
			}
		});

		netSocket.on("close", () => {
			this._alive = false;
			this.emit("close-pre-handled");
		});

		netSocket.on("error", () => void 0);

		this._id = identifier;
	}

	/**
	 * Kill the connection to the socket
	 */
	public kill() {
		this.socket.end();
	}

    /**
     * Send a request message to the client socket
     * @param channel The channel to send the request it
     * @param defaultObjectValues The default request message property values
     * @param request The request message
     */
	public send<RequestObjectType = any>(
		channel: string,
		defaultObjectValues: RequestObjectType = {} as any,
		request: PartialDeep<RequestObjectType>
    ) {
        if (!this.alive) return;

        this.socket.write(JSON.stringify({
            channel,
            body: deepmerge(defaultObjectValues, request as any)
        }));
    }

	/**
	 * Listen for message requests from the client
	 * @param channel Request message channel
	 * @param defaultObjectValues Request object properties for the request object
	 * @param listener The request listener
	 */
	public request<RequestObjectType = any>(
		channel: string,
		defaultObjectValues: PartialDeep<RequestObjectType> = {} as any,
		listener: (requestData: RequestObjectType) => void
	) {
		this.requestListeners.push({
			channel,
			listener: listener as any,
			defaultObjectValues: defaultObjectValues as any,
		});
	}

	/**
	 * The connection's unique identifier
	 */
	public get id() {
		return this._id;
	}

	/**
	 * If the connection is alive
	 */
	public get alive() {
		return this._alive;
	}

	/**
	 * Force emit close
	 * @internal
	 */
	public internalForceCloseEmit() {
		this.emit("close");
	}

	/**
	 * The remote IP address
	 */
	public get remoteIPAddress() {
		return this.socket.remoteAddress;
	}
}

export default TCPNodeServerSocket;
