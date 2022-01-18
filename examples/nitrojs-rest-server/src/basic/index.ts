import terminal, { State as TerminalState } from "@skylixgh/nitrojs-terminal";
import RESTServer from "@skylixgh/nitrojs-rest-server";

terminal.animate("Starting REST server");

const server = new RESTServer();

server.once("ready", () => {
    terminal.stopAnimation(TerminalState.success, "Server started successfully");
});

server
    .start()
    .catch((code) => {
        terminal.stopAnimation(TerminalState.error, "Failed to start server, error code: " + code);
    });
