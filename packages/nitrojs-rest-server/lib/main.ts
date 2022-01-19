import objectTools, { DeepPartial, ObjectType } from "@skylixgh/nitrojs-object-tools";
import EventEmitter from "events";
import http, { Server } from "http";
import https from "https";
import Request from "./Request";
import Response from "./Response";

export enum SettingsCORS {
    /**
     * Allow request from anywhere
     */
    allowAll,

    /**
     * Allow requests from the current origin
     */
    currentOrigin
}

export interface Settings {
    /**
     * The port for the REST server
     */
    port: number;

    /**
     * The host for the REST server
     */
    host: string;

    /**
     * HTTP(s) back log
     */
    backlog: number;

    /**
     * The CORS mode
     */
    cors: SettingsCORS;

    /**
     * SSL information
     */
    ssl:
        | false
        | {
              /**
               * SSL certificate
               */
              certificate: string;

              /**
               * SSL certificate key
               */
              key: string;
          };
}

export enum BootState {
    /**
     * The server isn't doing anything
     */
    halted,

    /**
     * The server is starting
     */
    starting,

    /**
     * The server is starting
     */
    running
}

export enum StartErrors {
    /**
     * The server is already running
     */
    alreadyRunning,

    /**
     * The server is already starting
     */
    alreadyStarting
}

declare interface RESTServer {
    /**
     * Listen for when the server is ready
     * @param event Event name
     * @param listener Event callback
     */
    on(event: "ready", listener: () => void): this;

    /**
     * Listen for when the server is ready
     * @param event Event name
     * @param listener Event callback
     */
    once(event: "ready", listener: () => void): this;

    /**
     * Listen for new connections to the server
     * @param event Event name
     * @param listener Event callback
     */
    on(event: "request", listener: (request: Request, response: Response) => void): this;

    /**
     * Listen for when the server is ready
     * @param event Event name
     * @param listener Event callback
     */
    once(event: "request", listener: () => void): this;

    /**
     * Listen for new connections to the server
     * @param event Event name
     * @param listener Event callback
     */
    on(event: "connection", listener: (request: Request, response: Response) => void): this;

    /**
     * Listen for new connections to the server
     * @param event Event name
     * @param listener Event callback
     */
    once(event: "connection", listener: (request: Request, response: Response) => void): this;
}

class RESTServer extends EventEmitter {
    /**
     * Server settings
     */
    private _settings: Settings;

    /**
     * The boot state of the server
     */
    private _bootState = BootState.halted;

    /**
     * The core HTTP(s) server
     */
    private httpServer?: Server;

    /**
     * Create a new REST server instance
     * @param settings Settings for the REST server
     */
    public constructor(settings: DeepPartial<Settings> = {}) {
        super();

        this._settings = objectTools.mergeObject<Settings>(
            {
                port: 8080,
                host: "localhost",
                ssl: false,
                backlog: 10000,
                cors: SettingsCORS.allowAll
            },
            settings
        );
    }

    /**
     * Server settings
     */
    public get settings() {
        return { ...this._settings };
    }

    /**
     * The server boot state
     */
    public get bootState() {
        return this._bootState;
    }

    /**
     * Start the REST server
     * @returns Promise for if the server was started
     */
    public async start(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this._bootState == BootState.running) {
                reject(StartErrors.alreadyRunning);
                return;
            }

            if (this._bootState == BootState.starting) {
                reject(StartErrors.alreadyStarting);
                return;
            }

            this._bootState = BootState.starting;

            if (this._settings.ssl) {
                this.httpServer = https.createServer({
                    cert: this._settings.ssl.certificate,
                    key: this._settings.ssl.key
                });
            } else {
                this.httpServer = http.createServer();
            }

            this.httpServer.on("request", (httpRequest, httpResponse) => {
                const requestHeaders = {
                    "Access-Control-Allow-Methods": "GET, POST",
                    "Access-Control-Max-Age": 2592000,
                    "Content-Type": "text"
                } as ObjectType;

                if (this._settings.cors == SettingsCORS.allowAll) {
                    requestHeaders["Access-Control-Allow-Origin"] = "*";
                }

                // TODO: Router
                httpResponse.writeHead(200, requestHeaders);

                httpResponse.write('{ hello: "world" }');
                httpResponse.end();
            });

            this.httpServer.listen(this._settings.port, this._settings.host, this._settings.backlog, () => {
                this._bootState = BootState.running;
                resolve();

                this.emit("ready");
            });
        });
    }
}

export default RESTServer;
