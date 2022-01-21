import Terminal from "@skylixgh/nitrojs-terminal/src/Terminal";
import pkg from "../package.json";

/**
 * The CLI service entry point
 */
new class Binary {
    /**
     * Application main method
     */
    public constructor() {
        Terminal.log("NitroJS CLI - " + pkg.version);
    }
}
