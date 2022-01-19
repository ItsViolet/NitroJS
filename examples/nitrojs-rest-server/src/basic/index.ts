import terminal, { State as TerminalState } from "@skylixgh/nitrojs-terminal";
import RESTServer, { SettingsCORS } from "@skylixgh/nitrojs-rest-server";

terminal.animate("Starting REST server");

const server = new RESTServer({
    cors: SettingsCORS.allowAll
});

server.once("ready", () => {
    terminal.stopAnimation(TerminalState.success, "Server started successfully");
});

server.on("connection", (req, res) => {
    terminal.log("New request");
});

server.start().catch((code) => {
    terminal.stopAnimation(TerminalState.error, "Failed to start server, error code: " + code);
});
