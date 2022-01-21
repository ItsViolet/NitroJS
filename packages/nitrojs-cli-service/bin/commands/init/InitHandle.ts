import Terminal, { TerminalPrompt, TerminalPromptType } from "@skylixgh/nitrojs-terminal/src/Terminal";
import { program } from "commander"

/**
 * Init command handler
 */
export default class InitHandle {
    /**
     * Init command register
     */
    public constructor() {
        program
            .command("init [directory]")
            .option("--name", "Name of the project", "")
            .action((directory?: string) => {
                Terminal.log("Initialize a new project");

                TerminalPrompt
                    .prompt(
                        TerminalPromptType.string,
                        "Name of your project",
                        (projectName) => {
                            TerminalPrompt
                                .prompt(
                                    TerminalPromptType.string,
                                    "What type of project is this (Node / Web / Desktop / Mobile)",
                                    (projectType) => {
                                        TerminalPrompt
                                            .prompt(
                                                TerminalPromptType.boolean,
                                                "Should this project use TypeScript",
                                                (useTypeScript) => {

                                                }
                                            );
                                    }
                                );
                        }
                    );
            });
    }
}