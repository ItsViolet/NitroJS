import cliBuilder, { FlagType } from "@skylixgh/nitrojs-cli-builder";
import terminal, { State as AnimationState } from "@skylixgh/nitrojs-terminal";
import { dump } from './../../../../nitrojs-object-tools/lib/main';
import configTools from './../../../../nitrojs-config-tools/lib/main';
import path from "path";

Error.stackTraceLimit = Infinity;

export default function dev() {
    cliBuilder.registerNew("dev", {
        flags: {
            config: {
                type: FlagType.string
            }
        }
    }, async (args, flags) => {
        const configObj = await configTools.read(path.join(__dirname, "./test.config.ts"), {});
        console.log(configObj);
    });
}