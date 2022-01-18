import objectTools, { DeepPartial } from "@skylixgh/nitrojs-object-tools";
import EventEmitter from "events";
import http, { Server } from "http";
import https from "https";

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
     * SSL information
     */
    ssl: false | {
        /**
         * SSL certificate
         */
        certificate: string;

        /**
         * SSL certificate key
         */
        key: string;
    }
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

export default class RESTServer extends EventEmitter {
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
                ssl: false
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
                httpResponse.write("<h3>NitroJS....</h3>");
                httpResponse.end();
            });

            // ! Update back log
            this.httpServer.listen(this._settings.port, this._settings.host, 100000, () => {
                this._bootState = BootState.running;
                resolve();
            });
        });
    }
}
