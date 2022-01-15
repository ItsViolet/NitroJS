import cliBuilder from "@skylixgh/nitrojs-cli-builder";
import terminal, { State as TerminalState } from "@skylixgh/nitrojs-terminal";
import { parse as packageNameParse } from "@pobedit/package-name-parser";
import https from "https";
import dns from "dns";
import semver from "semver";
import fs from "fs-extra";
import path from "path";

/**
 * Write a file for the project
 * @param pathName The path to the file
 * @param data The file contents to write
 * @returns A promise for when the resource was written
 */
function writeProjectResource(pathName: string, data: string): Promise<void> {
    return new Promise((resolve, reject) => {
        fs.writeFile(pathName, data).then(() => {
            resolve();
        }).catch(error => {
            reject(error);
        });
    });
}

/**
 * Render an error from a catch statement formatted for NitroJS and exit the app
 * @param error The error from the catch statement
 */
function quitFromErrorInstance(error: Error | any) {
    terminal.error("Failed to initialize project");

    error.message.split("\n").forEach((line: string) => {
        terminal.error("  " + line);
    });

    terminal.error("Error has been printed above");
    process.exit();
}

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
        
        /**
         * Write a project resource relative to the project path
         * @param pathName The path to the resource
         * @param contents The file contents to write
         * @returns Promise for when the file was written
         */
        function writeResourceFile(pathName: string, contents: string): ReturnType<typeof writeProjectResource> {
            if (!fs.existsSync(path.dirname(pathName))) {
                fs.mkdirSync(path.dirname(pathName), {
                    recursive: true
                });
            }

            return writeProjectResource(path.join(initToPath, pathName), contents);
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
                                    terminal.askString("What type of project is this (Node/Desktop/Mobile/Web)", "node", (packageProjectType) => {
                                        terminal.askYN("Use TypeScript", true, (installTS) => {
                                            if (packageProjectType == "mobile") {
                                                terminal.error("You cannot create a mobile project at this time :(");
                                                terminal.error("Possible Reasons:");
                                                terminal.error("  Your NitroJS CLI service is not up-to-date");
                                                terminal.error("  This type of project is still under development");
                                                
                                                terminal.log("We apiologies deeply for the inconvenience 😢");
                                                return;
                                            }

                                            const projectPackageFile = {
                                                name: packageName,
                                                version: packageVersion,
                                                author: packageAuthor,
                                                description: packageDescription,
                                                productName: packageDisplayName,
                                                scripts: {
                                                    "start": "nitrojs dev" + (!installTS ? "--config nitrojs.config.js" : "")
                                                },
                                                dependencies: {}
                                            };

                                            terminal.log("Generating your project");

                                            const initFinished = () => {
                                                terminal.success("Successfully initialized new NitroJS project!");
                                                
                                                if (path.join(process.cwd()) != initToPath) {
                                                    terminal.notice("The project was not created in the current directory, be sure to CD into the project directory ;)");
                                                }

                                                terminal.log("Get Started:");
                                                terminal.log(`  Run "npm install" to install all dependencies`);
                                                terminal.log(`  Run "npm start" or "npx nitrojs dev" to start your project in development`);
                                            }

                                            const placePackageInProject = () => {
                                                terminal.animate("Generating package file");

                                                writeResourceFile("package.json", JSON.stringify(projectPackageFile, null, 4) + "\n").then(() => {
                                                    terminal.stopAnimation(TerminalState.success, "Package file has been generated successfully");

                                                    const afterTSConfig = () => {
                                                        initFinished();
                                                    }

                                                    if (installTS) {
                                                        terminal.animate("Creating TypeScript configuration");
                                                        const templateTSConfig = fs.readFileSync(path.join(__dirname, "./templateResources/node/tsconfig.json.txt")).toString();

                                                        writeProjectResource("tsconfig.json", templateTSConfig).then(() => {
                                                            terminal.stopAnimation(TerminalState.success, "Successfully created TypeScript configuration");
                                                            afterTSConfig();
                                                        }).catch((error) => {
                                                            terminal.stopAnimation(TerminalState.error, "Failed to create TypeScript configuration");
                                                            quitFromErrorInstance(error);
                                                        });
                                                    } else {
                                                        afterTSConfig();
                                                    }
                                                }).catch(error => {
                                                    terminal.stopAnimation(TerminalState.error, "Failed to generate package file");
                                                    quitFromErrorInstance(error);
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
                                                        "@skylixgh/nitrojs-cli": nitroJSTags[0].name.replace("v", "")
                                                    };

                                                    if (packageProjectType == "desktop" || packageProjectType == "web") {
                                                        if (packageProjectType == "desktop") {
                                                            projectPackageFile.dependencies = {
                                                                ...projectPackageFile.dependencies,
                                                                "@skylixgh/nitrojs-electron-back": nitroJSTags[0].name.replace("v", "")
                                                            }
                                                        }

                                                        projectPackageFile.dependencies = {
                                                            ...projectPackageFile.dependencies,
                                                            "@skylixgh/nitrojs-web-pc-uix": nitroJSTags[0].name.replace("v", "")
                                                        }
                                                    }
                                                    
                                                    const afterTSTasks = () => {
                                                        terminal.animate("Generating project structure");

                                                        const stopGenerationFromErrorAndQuit = (error: Error | any) => {
                                                            terminal.stopAnimation(TerminalState.error, "Failed to generate project structure");
                                                            quitFromErrorInstance(error);
                                                        }

                                                        const generationIsFinished = () => {
                                                            terminal.stopAnimation(TerminalState.success, "Project structure generated successfully");
                                                            placePackageInProject();
                                                        }

                                                        if (packageProjectType == "node") {
                                                            const afterNitroJSConfigGenerated = () => {
                                                                generationIsFinished();
                                                            }

                                                            const afterMainFileGenerated = () => {
                                                                if (installTS) {
                                                                    writeResourceFile(
                                                                        "nitrojs.config.ts",
                                                                        fs.readFileSync(
                                                                            path.join(__dirname, "./templateResources/node/nitrojs.config.ts.txt")
                                                                        ).toString()
                                                                    ).then(() => {
                                                                        afterNitroJSConfigGenerated();
                                                                    }).catch((error) => {
                                                                        stopGenerationFromErrorAndQuit(error);
                                                                    });
                                                                } else {
                                                                    writeResourceFile(
                                                                        "nitrojs.config.js",
                                                                        fs.readFileSync(
                                                                            path.join(__dirname, "./templateResources/node/nitrojs.config.js.txt")
                                                                        ).toString()
                                                                    ).then(() => {
                                                                        afterNitroJSConfigGenerated();
                                                                    }).catch((error) => {
                                                                        stopGenerationFromErrorAndQuit(error);
                                                                    });
                                                                }
                                                            }
                                                            
                                                            if (installTS) {
                                                                writeResourceFile("src/main.ts", fs.readFileSync(path.join(__dirname, "./templateResources/node/structure/src/main.ts.txt")).toString())
                                                                    .then(() => {
                                                                        afterMainFileGenerated();
                                                                    }).catch((error) => {
                                                                        stopGenerationFromErrorAndQuit(error);
                                                                    });
                                                            } else {
                                                                writeResourceFile("src/main.js", fs.readFileSync(path.join(__dirname, "./templateResources/node/structure/src/main.js.txt")).toString())
                                                                    .then(() => {
                                                                        afterMainFileGenerated();
                                                                    }).catch((error) => {
                                                                        stopGenerationFromErrorAndQuit(error);
                                                                    });
                                                            }
                                                        } else {
                                                            terminal.stopAnimation(TerminalState.error, "Failed to generate project structure because generation for this type of app is not supported");
                                                            process.exit();
                                                        }
                                                    }
                                                    
                                                    let tsTagsRaw = "";
                                                    
                                                    if (installTS) {
                                                        terminal.animate("Fetching dependency information for TypeScript");

                                                        https.request({
                                                            hostname: "api.github.com",
                                                            path: "/repos/microsoft/typescript/tags",
                                                            method: "GET",
                                                            headers: {
                                                                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36"
                                                            }
                                                        }, (requestTS) => {
                                                            requestTS.on("data", (chunk) => {
                                                                tsTagsRaw += chunk.toString();
                                                            });
    
                                                            requestTS.on("close", () => {
                                                                const tsTags = (JSON.parse(tsTagsRaw) as any[]);
                                                                
                                                                projectPackageFile.dependencies = {
                                                                    ...projectPackageFile.dependencies,
                                                                    "typescript": tsTags[0].name.replace("v", "")
                                                                };
    
                                                                terminal.stopAnimation(TerminalState.success, "Successfully fetched dependency information for TypeScript");
                                                                afterTSTasks();
                                                            });
                                                        }).on("error", () => {
                                                            terminal.stopAnimation(TerminalState.error, "Failed to fetch dependency information for TypeScript");
                                                        }).end();
                                                    } else {
                                                        afterTSTasks();
                                                    }
                                                });
                                            }).on("error", (error) => {
                                                terminal.stopAnimation(TerminalState.error, "Failed to fetch dependency information for NitroJS UI");
                                            }).end();
                                        });
                                    }, (answer) => {
                                        const lowerAnswer = answer.toLowerCase();

                                        if (lowerAnswer != "node" && lowerAnswer != "desktop" && lowerAnswer != "mobile" && lowerAnswer != "web") {
                                            return "Please provide a valid project type";
                                        }
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

        terminal.notice(`The project files will be generated in this current directory, please create a sub directory if needed via "mkdir <dirname>" in your system`);
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
