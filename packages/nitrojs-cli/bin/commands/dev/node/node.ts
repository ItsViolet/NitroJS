import terminal, { State as TerminalState } from "@skylixgh/nitrojs-terminal";
import { appCLIRoot, appPackage } from "../dev";
import fs from "fs-extra";
import path from "path";
import chokidar from "chokidar";
import { UserConfig } from "../../../../lib/main";
import { ChildProcess, spawn } from "child_process";
import tty from "tty";

/**
 * The node application dev server
 */
export default function node(appConfig: UserConfig) {
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
        mainEntryPath = appPackage["main"];
    } else if (appPackage["main"].endsWith(".ts")) {
        jsPreProcessor = "ts";
        mainEntryPath = appPackage["main"];
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
        mainEntryPath = appPackage["main"] + ".ts";
    } else if (
        fs.existsSync(
            path.join(
                appCLIRoot,
                appPackage["main"] + ".js"
            )
        )
    ) {
        jsPreProcessor = "js";
        mainEntryPath = appPackage["main"] + ".js";
    } else {
        terminal.stopAnimation(TerminalState.error, invalidMainEntryMessage);
        return;
    }

    terminal.stopAnimation(TerminalState.success, `Detected ${jsPreProcessor == "ts" ? "TypeScript" : "Vanilla"} as the JavaScript preprocessor`);
    let appInstance: ChildProcess;

    const spawnAppProcess = () => {
        if (jsPreProcessor == "ts") {
            appInstance = spawn("node", [ path.join(__dirname, "./proxy/typescript.js"), path.join(appCLIRoot, mainEntryPath), appCLIRoot ]);
        } else {
            appInstance = spawn("node", [ path.join(__dirname, "./proxy/node.js"), path.join(appCLIRoot, mainEntryPath) ]);
        }

        appInstance.on("exit", (code) => {
            process.stdin.pause();
            process.stdin.unpipe();

            if (code != undefined)
                terminal.notice("The app has exited with exit code " + code);
        });
    
        process.stdin.pipe(appInstance.stdin!);
        process.stdin.resume();

        appInstance.stdout?.on("data", data => {
            process.stdout.write(data.toString());
        });

        appInstance.stderr?.on("data", data => {
            process.stderr.write(data.toString());
        });
    }

    const killAppProcess = () => {
        appInstance.kill();
        process.stdin.pause();
    }
    
    const appRootWatcher = () => {
        process.stdout.write("\n");  
        terminal.log("Restarting the app");
        
        killAppProcess();
        spawnAppProcess(); 
    }

    spawnAppProcess();

    const pkgWatch = chokidar.watch(path.join(appCLIRoot, "package.json"), {
        ignoreInitial: true
    });

    pkgWatch.on("all", () => {
        process.stdout.write("\n");
        terminal.notice("The package.json file was modified, please stop this app and start it again");
    });

    if (appConfig.node.autoRestart) {
        chokidar.watch(appCLIRoot, {
            ignoreInitial: true,
            ignored: [ "**/node_modules/**/*" ]
        }).on("all", (eventName, pathName) => {
            if (path.join(pathName) != path.join(appCLIRoot, "package.json")) {
                appRootWatcher();
            }
        }); 
    }
}