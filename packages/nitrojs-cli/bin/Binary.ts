import pkg from "../package.json";
import { program } from "commander";
import InitHandle from "./commands/init/InitHandle";

/**
 * The CLI service entry point
 */
new class Binary {
    /**
     * Application main method
     */
    public constructor() {
        program.version(pkg.version);
        program.name("NitroJS")

        new InitHandle();

        program.parse();
    }
}
