import cliBuilder, { FlagType } from "@skylixgh/nitrojs-cli-builder";

export default function dev() {
    cliBuilder.registerNew("dev", {
        flags: {
            uwu: {
                type: FlagType.boolean,
                required: true
            },
            kittens: {
                type: FlagType.arrayBoolean
            }
        }
    }, (args, flags) => {
        console.log(args, flags);
    });
}