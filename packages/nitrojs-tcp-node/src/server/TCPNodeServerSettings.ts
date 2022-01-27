/**
 * Settings for the TCP node server
 */
export default interface TCPNodeServerSettings {
    /**
     * Port for the TCP node server
     */
    port: number;

    /**
     * Host for the TCP
     */
    host: string;

    /**
     * The SSL information for TLS
     */
    ssl: false | {
        /**
         * The certificate record
         */
        certificate: string;

        /**
         * The authentication key
         */
        key: string;
    };
}