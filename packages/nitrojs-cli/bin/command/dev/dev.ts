import cliBuilder, { FlagType } from "@skylixgh/nitrojs-cli-builder";

export default function dev() {
    cliBuilder.registerNew("dev", {
        flags: {
            config: {
                type: FlagType.string
            }
        }
    }, (args, flags) => {
        console.log(args, flags);
    });
}