import { Socket } from "net";
import { EventEmitter } from "events";

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
	 * Create and initialize a new net/TLS socket for a higher level API
	 * @param netSocket The net/TLS socket
	 * @param identifier The connection unique identifier
	 */
	public constructor(netSocket: Socket, identifier: string) {
        super();
        this.socket = netSocket;

		netSocket.on("close", () => {
            this._alive = false;
            this.emit("close-pre-handled");
		});

		this._id = identifier;
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
