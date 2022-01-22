import pkg from "../package.json";
import { Command } from "commander";
import InitHandle from "./commands/init/InitHandle";

let options = {} as any;
const program = new Command();

/**
 * The CLI service entry point
 */
new class Binary {
    /**
     * Application main method
     */
    public constructor() {
        program.version(pkg.version);

        new InitHandle();

        program.parse();
        options = program.opts();
    }
}

export { options, program };
