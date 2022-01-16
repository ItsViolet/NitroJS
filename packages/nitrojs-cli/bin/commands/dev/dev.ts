import fs from "fs-extra";
import cliBuilder, { FlagType } from "@skylixgh/nitrojs-cli-builder";
import terminal from "@skylixgh/nitrojs-terminal";
import path from "path";
import { UserConfigType } from "../../../lib/main";
import readConfig from "../../utils/readConfig";
import node from "./node/node";
import objectTools, { ObjectType } from "../../../../nitrojs-cli-builder/node_modules/@skylixgh/nitrojs-object-tools/lib/main";

let appCLIRoot = process.cwd();
let appPackage = {} as ObjectType;

export default function dev() {
    cliBuilder.registerNew(
        "dev",
        {
            flags: {
                config: {
                    type: FlagType.string
                }
            }
        },
        async (args, flags) => {
            readConfig(flags.config, (config) => {
                if (args[0]) {
                    appCLIRoot = path.join(process.cwd(), args[0]);
                }

                if (!fs.existsSync(appCLIRoot)) {
                    terminal.error("Failed to start app in development because the app directory doesn't seem to be valid");
                    terminal.error("Possible Reason:");
                    terminal.error(" - You are in a directory that doesn't exist anymore");
                    terminal.error(" - You provided a directory that doesn't exist");

                    return;
                }

                if (!fs.lstatSync(appCLIRoot).isDirectory()) {
                    terminal.error("Failed to start app in development because the app path you provided is a file");
                    return;
                }

                if (!fs.existsSync(path.join(appCLIRoot, "./package.json"))) {
                    terminal.error("Failed to start app because the application's package file doesn't exist");
                    terminal.error("Possible Reasons:");
                    terminal.error(" - You provided a directory path that does not route to the root of the project");
                    terminal.error(" - The file \"package.json\" doesn't exist or was deleted");

                    return;
                } else {
                    objectTools.jsonParse<ObjectType>(fs.readFileSync(path.join(appCLIRoot, "./package.json")).toString()).then((packageJSON) => {
                        appPackage = packageJSON;
                 
                        if (config.type == UserConfigType.node) {
                            node(config);
                        } else {
                            terminal.error("Failed to start the development server");
                            terminal.error("Possible Reason:");
                            terminal.error("  -> Because your CLI service version is not up-to-date");
                            terminal.error("  -> NitroJS currently isn't done implementing this version");
                            terminal.error("  -> You didn't set the app type correctly");    
                        }
                    });
                }
            });
        }
    );
}

export { appCLIRoot, appPackage };
