import cliBuilder, { FlagType } from "@skylixgh/nitrojs-cli-builder";
import terminal from "@skylixgh/nitrojs-terminal";
import fs from "fs";
import path from "path";

interface CommandFlags {
    /**
     * The type of application being converted
     */
    type?: "node" | "desktop" | "mobile" | "web" | string;
}

cliBuilder.registerNew(
    "convert-to-dev-mode",
    {
        flags: {
            type: {
                type: FlagType.string,
                required: true
            }
        }
    },
    (args, flags: CommandFlags) => {
        const requestPackage = JSON.parse(fs.readFileSync(path.join(process.cwd(), "package.json")).toString());
        const dependencies = requestPackage["dependencies"];

        if (flags.type == "node") {
            for (const dependencyName in dependencies) {
                if (dependencyName.startsWith("@skylixgh/nitrojs-")) {
                    const nitroModuleName = dependencyName.substring(10);
                    dependencies[dependencyName] = "file:../../packages/" + nitroModuleName;
                }
            }

            fs.writeFileSync(path.join(process.cwd(), "package.json"), JSON.stringify(requestPackage, null, 4));
        } else {
            terminal.error("This app cannot be converted");
        }
    }
);
