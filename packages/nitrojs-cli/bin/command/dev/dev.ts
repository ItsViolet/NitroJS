import cliBuilder, { FlagType } from "@skylixgh/nitrojs-cli-builder";
import terminal, { State as AnimationState } from "@skylixgh/nitrojs-terminal";
import { dump } from './../../../../nitrojs-object-tools/lib/main';

Error.stackTraceLimit = Infinity;

export default function dev() {
    cliBuilder.registerNew("dev", {
        flags: {
            config: {
                type: FlagType.string
            }
        }
    }, (args, flags) => {
        const configObj = {};
        console.log(configObj);
    });
}