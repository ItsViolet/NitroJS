import Terminal from "@skylixgh/nitrojs-terminal/src/Terminal";
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

        new InitHandle();

        program.parse();
    }
}
