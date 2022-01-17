import terminal, { State as TerminalState } from "@skylixgh/nitrojs-terminal";
import { appCLIRoot, appPackage as appPackageOriginal } from "../dev";
import fs from "fs-extra";
import path from "path";
import chokidar from "chokidar";
import { UserConfig } from "../../../../lib/main";
import { ChildProcess, spawn } from "child_process";

/**
 * The node application dev server
 */
export default function node(appConfig: UserConfig, appConfigLocation: string, mainLocation?: string) {
    terminal.animate("Detecting JavaScript preprocessor");

    const invalidMainEntryMessage = "Could not detect JavaScript preprocessor because the main field provided in the package file is invalid";
    let mainEntryPath = "";
    let jsPreProcessor = null as null | "ts" | "js";

    const appPackage = { ...appPackageOriginal };

    if (mainLocation) {
        appPackage["main"] = mainLocation;
    }

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
            appInstance = spawn("node", [ path.join(__dirname, "./proxy/typescript.js"), path.join(appCLIRoot, mainEntryPath), appCLIRoot ], { env : { FORCE_COLOR: true } as any});
        } else {
            appInstance = spawn("node", [ path.join(__dirname, "./proxy/node.js"), path.join(appCLIRoot, mainEntryPath) ], { env : { FORCE_COLOR: true } as any});
        }

        appInstance.on("exit", (code) => {
            process.stdin.pause();
            process.stdin.unpipe();

            if (code != undefined) {
                process.stdout.write("\n");  
                terminal.notice("The app has exited with exit code " + code);
            }
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
        terminal.log("Restarting the app");
        process.stdout.write("\n");  
        
        killAppProcess();
        spawnAppProcess(); 
    }

    process.stdout.write("\n");  
    spawnAppProcess();

    if (appConfig.node.autoRestart) {
        const configWatch = chokidar.watch(path.join(appCLIRoot, appConfigLocation), {
            ignoreInitial: true
        });
    
        configWatch.on("all", () => {
            terminal.notice("The NitroJS config file was modified, please stop this app and start it again");
        });

        chokidar.watch(appCLIRoot, {
            ignoreInitial: true,
            ignored: [ "**/node_modules/**/*" ]
        }).on("all", (eventName, pathName) => {
            appRootWatcher();
        }); 
    }
}