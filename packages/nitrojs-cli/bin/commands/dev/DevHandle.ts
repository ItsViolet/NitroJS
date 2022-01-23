import Terminal, { TerminalAnimation } from "@skylixgh/nitrojs-terminal";
import { program } from "commander";
import path from "path";

/**
 * Command handler for the universal dev server
 */
export default class DevHandle {
    /**
     * Dev server main
     */
    public constructor() {
        program
            .command("dev [projectRoot]")
            .option("--config", "The configuration path", "nitrojs.config")
            .action((projectRoot, options) => {
                const projectRootDir = path.join(process.cwd(), projectRoot ?? "./");
                
                Terminal.log("Start a development server");
            });
    }
}