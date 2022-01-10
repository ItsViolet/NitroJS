import chalk from "chalk";

let animationLoop: NodeJS.Timer;
let animationRunning = false;
let animationFrame = 0;
let animationText = "";
let animationEndHex = "#555";
let animationFullStopped = true;
let animationRenderFunction: () => void;
const animationInterval = 100;
const animationFrames = [ "|", "/", "-", "\\" ];

export enum State {
    info,
    success,
    warning,
    error
}

/**
 * Create and print a formatted message in the terminal
 * @param text Text message
 * @param hexColor Hex color for prefix bullet
 * @returns Nothing
 */
function logFormatted(text: string, hexColor: string) {
    if (animationRunning || !animationFullStopped) {
        return;
    }

    console.log(` ${chalk.hex(hexColor)("•")} ${text}`);
}

/**
 * Log an info message into the terminal
 * @param text The text to log
 */
export function log(text: string) {
    logFormatted(text, "#555555");
}

/**
 * Log a success message into the terminal
 * @param text Text to log
 */
export function success(text: string) {
    logFormatted(text, "#50ffab");
}

/**
 *  Log a warning message into the terminal
 * @param text Text to log
 */
export function warning(text: string){
    logFormatted(text, "#FFAB00");
}

/**
 * Log an error message into the terminal
 * @param text The text to log
 */
export function error(text: string) {
    logFormatted(text, "#FF5555");
}

/**
 * Stop a running animation
 * @param animationState The state of your animation
 * @param newAnimationMessage The new text for the animation
 * @returns Nothing
 */
export function stopAnimation(animationState: State, newAnimationMessage?: string) {
    if (!animationRunning || animationFullStopped) {
        return;
    }
    
    if (newAnimationMessage) animationText = newAnimationMessage;
    animationRunning = false;

    switch (animationState) {
        case State.info:
            animationEndHex = "#555555";
            break;

        case State.warning:
            animationEndHex = "#FFAB00";
            break;

        case State.success:
            animationEndHex = "#50FFAB";
            break;

        case State.error: 
            animationEndHex = "#FF5555";
            break;
    }

    if (animationRenderFunction) animationRenderFunction();
    clearInterval(animationLoop);

    process.stdout.write("\n");
    animationFullStopped = true;
}

/**
 * Update the text of a currently running animation
 * @param newAnimationMessage The new text for the animation
 * @returns Nothing 
 */
export function updateAnimation(newAnimationMessage: string) {
    if (!animationRunning || animationFullStopped) {
        return;
    }
    
    animationText = newAnimationMessage;
    animationRenderFunction();
}

/**
 * Create an animated terminal message
 * @param text Text to write the animations message
 */
export function animate(text: string) {
    (() => {
        animationText = text;
        animationRunning = true;
        animationFullStopped = false;
    
        animationRenderFunction = () => {
            animationFrame++;
            let writableText = animationText;
            
            if (animationFrame == animationFrames.length) {
                animationFrame = 0;
            }

            const prefixLength = 3;
            const textLength = writableText.length;
            const totalOutputLength = prefixLength + textLength;

            if (totalOutputLength > process.stdout.columns) {
                let chopOffLength = totalOutputLength + 3 - process.stdout.columns;
                if (chopOffLength < 0) chopOffLength = 0;

                writableText = writableText.slice(0, -chopOffLength) + "...";
            } else {
                let trailLength = process.stdout.columns - totalOutputLength;
                writableText += " ".repeat(trailLength);
            }
    
            if (animationRunning) {
                process.stdout.write(`\r ${animationFrames[animationFrame]} ${writableText}`);
                return;
            }
    
            process.stdout.write(`\r ${chalk.hex(animationEndHex)("•")} ${writableText}`);
        }

        animationLoop = setInterval(animationRenderFunction, animationInterval);    
    })();
}

export default {
    log,
    success,
    warning,
    error,
    animate,
    updateAnimation,
    stopAnimation
};
