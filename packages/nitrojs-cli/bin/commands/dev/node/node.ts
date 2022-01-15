import terminal, { State as TerminalState } from "@skylixgh/nitrojs-terminal";
import { appCLIRoot, appPackage } from "../dev";
import fs from "fs-extra";
import path from "path";
import objectTools from "../../../../../nitrojs-cli-builder/node_modules/@skylixgh/nitrojs-object-tools/lib/main";

/**
 * The node application dev server
 */
export default function node() {
    terminal.animate("Detecting JavaScript preprocessor");

    const invalidMainEntryMessage = "Could not detect JavaScript preprocessor because the main field provided in the package file is invalid";
    let mainEntryPath = "";
    let jsPreProcessor = null as null | "ts" | "js";

    if (!appPackage["main"]) {
        terminal.stopAnimation(TerminalState.error, "Could not detect JavaScript preprocessor because the main field was not provided in the package file");
        return;
    } 
    
    if (
        !fs.existsSync(path.join(appCLIRoot, appPackage["main"]))
        && !fs.existsSync(path.join(appCLIRoot, appPackage["main"] + ".js"))
        && !fs.existsSync(path.join(appCLIRoot, appPackage["main"] + ".ts"))
    ) {
        terminal.stopAnimation(TerminalState.error, invalidMainEntryMessage);
        return;
    }

    if (appPackage["main"].endsWith(".js")) {
        jsPreProcessor = "js";
    } else if (appPackage["main"].endsWith(".ts")) {
        jsPreProcessor = "ts";
    } else if (
        (
            appPackage["devDependencies"]["typescript"]
            || appPackage["dependencies"]["typescript"]
        )
        && fs.existsSync(
            path.join(
                appCLIRoot,
                appPackage["main"] + ".ts"
            )
        )
    ) {
        jsPreProcessor = "ts";
    } else if (
        fs.existsSync(
            path.join(
                appCLIRoot,
                appPackage["main"] + ".js"
            )
        )
    ) {
        jsPreProcessor = "js";
    } else {
        terminal.stopAnimation(TerminalState.error, invalidMainEntryMessage);
        return;
    }

    terminal.stopAnimation(TerminalState.success, `Detected ${jsPreProcessor == "ts" ? "TypeScript" : "Vanila"} as the JavaScript preprocessor`);
}