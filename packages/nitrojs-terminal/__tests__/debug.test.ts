import path from "path";
import terminal from "..";

terminal.setDebuggerEnabled(true);
terminal.setDebugLocation(path.join(__dirname, "./debug"));

terminal.log("Initializing debugger");

terminal.log("This test case is used for testing debug");
terminal.log("All messages that are logged or stored explicitly as a debug output will be sent to the debug logger");
terminal.notice("Debugging", true);

terminal.log("This is an info message", true);
terminal.success("This is a success message", true);
terminal.warning("This is a warning message", true);
