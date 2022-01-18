import terminal, { State as TerminalState } from "@skylixgh/nitrojs-terminal";
import RESTServer from "@skylixgh/nitrojs-rest-server";

terminal.animate("Starting REST server");

const server = new RESTServer();

server
    .start()
    .then(() => {
        terminal.stopAnimation(TerminalState.success, "Server started successfully");
    })
    .catch((code) => {
        terminal.stopAnimation(TerminalState.error, "Failed to start server, error code: " + code);
    });
