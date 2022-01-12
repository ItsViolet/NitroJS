import cliBuilder, { FlagType } from "@skylixgh/nitrojs-cli-builder";

export default function dev() {
    cliBuilder.registerNew("dev", {
        flags: {
            uwu: {
                type: FlagType.boolean
            }
        }
    }, (args, flags) => {
        console.log(args, flags);
    });
}