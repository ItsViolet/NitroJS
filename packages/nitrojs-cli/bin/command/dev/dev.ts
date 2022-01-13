import cliBuilder, { FlagType } from "@skylixgh/nitrojs-cli-builder";
import terminal from "@skylixgh/nitrojs-terminal";
import readConfig from "../../utils/readConfig";

Error.stackTraceLimit = Infinity;

export default function dev() {
    cliBuilder.registerNew("dev", {
        flags: {
            config: {
                type: FlagType.string
            }
        }
    }, async (args, flags) => {
        readConfig(flags.config, (config) => {
            console.log(config);
        })
    });
}