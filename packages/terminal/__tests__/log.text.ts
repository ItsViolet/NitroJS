import { log, success, warning, error, State } from "..";
import { animate, stopAnimation } from './../lib/main';

log("Hello, world");
success("Hello, world");
warning("Hello, world");
error("Hello, world");

animate("Hello, world");
setTimeout(() => {
    stopAnimation(State.success);
    animate("Hello, world e--ejejjdasdhsdabshddddddddddddddddddddddddddddddddddddddddddddddddddddddddbasdhasdasbhdasdhbsadhbsadasbhdsadbhasdbhsadsabhdas");

    setTimeout(() => {
        stopAnimation(State.success, "New hello, world");
    }, 1000);
}, 3200);
