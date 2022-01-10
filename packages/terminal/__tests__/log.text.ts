import { log, success, warning, error, State } from "..";
import { animate, stopAnimation, updateAnimation } from './../lib/main';

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
        animate("New phase");

        setTimeout(() => {
            updateAnimation("New animation text");

            setTimeout(() => {
                updateAnimation("Very very very very very very very very very very very very very very very very very very very long text");
            }, 1000);
        }, 1000);
    }, 1000);
}, 3200);
