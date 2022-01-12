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
        const max = 500;

        let loop = setInterval(() => {
            ticks++;

            if (ticks == max) {
                clearInterval(loop);
                terminal.stopAnimation(AnimationState.success, "Finished loading your configuration (500)");
                return;
            }

            terminal.updateAnimation(`Loading your configuration (${ticks})`)
        }, 10);
    });
}