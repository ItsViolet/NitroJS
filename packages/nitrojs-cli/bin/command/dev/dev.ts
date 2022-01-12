import cliBuilder, { FlagType } from "@skylixgh/nitrojs-cli-builder";
import terminal, { State as AnimationState } from "@skylixgh/nitrojs-terminal";

Error.stackTraceLimit = Infinity;

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
        const max = Infinity;

        while (true) {
            ticks++;

            if (ticks == max) {
                terminal.stopAnimation(AnimationState.success, "Finished loading your configuration (500)");
                return;
            }

            terminal.updateAnimation(`Loading your configuration (${ticks})`);
        }
    });
}