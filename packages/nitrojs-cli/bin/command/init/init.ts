import cliBuilder from "@skylixgh/nitrojs-cli-builder";
import terminal, { State as TerminalState } from "@skylixgh/nitrojs-terminal";
import { parse as packageNameParse } from "@pobedit/package-name-parser";
import https from "https";
import dns from "dns";
import semver from "semver";
import fs from "fs-extra";
import path from "path";

export default function init() {
    cliBuilder.registerNew("init", {}, (args, flags) => {
        let initToPath = process.cwd();

        if (args.length == 1) {
            initToPath = path.join(process.cwd(), args[0]);

            if (!fs.existsSync(initToPath)) {
                terminal.error("The path provided was invalid");
                return;
            }

            if (!fs.lstatSync(initToPath).isDirectory()) {
                terminal.error("The path expected is a directory but received a path to a file instead");
                return;
            }
        } else if (args.length > 1 ) {
            terminal.error(`0-1 arguments were expected, received ${args.length} instead`);
        }

        const logical = () => {
            terminal.log("Initialize a new project");

            terminal.askString(
                "Project Name",
                "unnamed",
                (packageName) => {
                    terminal.askString("Project Display Name", packageName, (packageDisplayName) => {
                        terminal.askString("Project Version", "1.0.0-dev", (packageVersion) => {
                            terminal.askString("Project Description", null, (packageDescription) => {
                                terminal.askString("Project Author", "Unknown", (packageAuthor) => {
                                    terminal.askYN("Use NitroJS JS UI System", true, (packageUseNitroUI) => {
                                        const projectPackageFile = {
                                            name: packageName,
                                            version: packageVersion,
                                            author: packageAuthor,
                                            description: packageDescription,
                                            productName: packageDisplayName,
                                            dependencies: {}
                                        };

                                        const initFinished = () => {
                                            terminal.success("Successfully initialized new NitroJS project!");
                                            terminal.log("Get Started:");
                                            terminal.log(`  Run "npm install" to install all dependencies`);
                                            terminal.log(`  Run "npx nitrojs dev" to start your project in development`);
                                        }

                                        const placePackageInProject = () => {
                                            terminal.animate("Generating package file");

                                            fs.writeFile(path.join(initToPath, "package.json"), JSON.stringify(projectPackageFile, null, 4) + "\n").then(() => {
                                                terminal.stopAnimation(TerminalState.success, "Package file has been generated successfully");

                                                initFinished();
                                            }).catch(error => {
                                                terminal.stopAnimation(TerminalState.error, "Failed to generate package file");
                                                terminal.error("Failed to initialize project");

                                                error.split("\n").forEach((line: string) => {
                                                    terminal.error("  " + line);
                                                });

                                                terminal.error("Error has been printed above");
                                            });
                                        };

                                        terminal.animate("Fetching NitroJS dependency information");

                                        https.request({
                                            hostname: "api.github.com",
                                            path: "/repos/skylixgh/nitrojs/tags",
                                            method: "GET",
                                            headers: {
                                                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36"
                                            }
                                        }, (request) => {
                                            let fullOut = "";

                                            request.on("data", (chunk) => {
                                                fullOut += chunk.toString();
                                            });

                                            request.on("close", () => {
                                                terminal.stopAnimation(TerminalState.success, "Successfully fetch dependency information for NitroJS");

                                                const nitroJSTags = (JSON.parse(fullOut) as any[]).sort((first, second) => semver.compare(second.name, first.name));

                                                projectPackageFile.dependencies = {
                                                    "@skylixgh/nitrojs-cli": nitroJSTags[0].name.replace("v", ""),
                                                    "@skylixgh/nitrojs-electron-back": nitroJSTags[0].name.replace("v", "")
                                                };

                                                if (packageUseNitroUI) {
                                                    projectPackageFile.dependencies = {
                                                        ...projectPackageFile.dependencies,
                                                        "@skylixgh/nitrojs-uix": nitroJSTags[0].name.replace("v", "")
                                                    }
                                                }

                                                placePackageInProject();
                                            });
                                        }).on("error", (error) => {
                                            terminal.stopAnimation(TerminalState.error, "Failed to fetch dependency information for NitroJS UI");
                                        }).end();
                                    });
                                });
                            });
                        });
                    });
                },
                (answer) => {
                    try {
                        const parsed = packageNameParse(answer);

                        if (parsed.version) {
                            return "A version is not needed";
                        }
                    } catch {
                        return "Please enter a valid package name";
                    }
                }
            );
        };

        terminal.animate("This task requires an internet connection, please wait while we test your connection");

        dns.resolve("npmjs.com", (error) => {
            if (error) {
                if (error.code == "ECONNREFUSED") {
                    terminal.stopAnimation(TerminalState.error, "Internet connection test failed, please try again when you have a working internet connection");
                    return;
                }
            }

            terminal.stopAnimation(TerminalState.success, "Internet connection test passed");
            logical();
        });
    });
}
