import terminal, { State } from "@skylixgh/nitrojs-terminal";

terminal.animate("UWUUU");
setTimeout(() => {
    terminal.stopAnimation(State.warning, "No kittens found :(");
}, 1000);
