import cliBuilder, { FlagType } from "@skylixgh/nitrojs-cli-builder";
import terminal, { State as AnimationState } from "@skylixgh/nitrojs-terminal";

export default function dev() {
    cliBuilder.registerNew("dev", {
        flags: {
            config: {
                type: FlagType.string
            }
        }
    }, (args, flags) => {
        terminal.animate("Loading your configuration");

        let ticks = 0;
        const max = 5;

        setInterval(() => {
            ticks++;

            if (ticks == max) {
                terminal.stopAnimation(AnimationState.success, "Finished loading your configuration");
                return;
            }

            terminal.updateAnimation(`Loading your configuration (${ticks})`)
        }, 1000);
    });
}