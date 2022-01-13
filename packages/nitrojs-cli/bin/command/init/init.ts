import cliBuilder from "@skylixgh/nitrojs-cli-builder";
import terminal from "@skylixgh/nitrojs-terminal";
import { parse as packageNameParse } from "@pobedit/package-name-parser";

export default function init() {
    cliBuilder.registerNew("init", {}, (args, flags) => {
        terminal.log("Initialize a new project");

        terminal.askString("Project Name", "unnamed", (packageName) => {
            terminal.askString("Project Display Name", packageName, (packageDisplayName) => {
                terminal.askString("Project Version", "1.0.0-dev", (packageVersion) => {
                    terminal.askString("Project Description", null, (packageDescription) => {
                        terminal.askString("Project Author", "Unknown", (packageAuthor) => {
                            terminal.askYN("Use NitroJS UI System", true, (packageUseNitroUI) => {
                                const projectPackageFile = {
                                    name: packageName,
                                    version: packageVersion,
                                    author: packageAuthor,
                                    description: packageDescription,
                                    productName: packageDisplayName
                                };
                            });
                        });
                    });
                });
            });
        }, (answer) => {
            try {
                const parsed = packageNameParse(answer);

                if (parsed.version) {
                    return "A version is not needed";
                }
            } catch {
                return "Please enter a valid package name"
            }
        });
    });
}