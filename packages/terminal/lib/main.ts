import chalk from "chalk";

let animationLoop: NodeJS.Timer;
let animationRunning = false;
let animationFrame = 0;
const animationInterval = 100;
const animationFrames = [ "|", "/", "-", "\\" ];

/**
 * Create and print a formatted message in the terminal
 * @param text Text message
 * @param hexColor Hex color for prefix bullet
 * @returns Nothing
 */
function logFormatted(text: string, hexColor: string) {
    if (animationRunning) {
        return;
    }

    console.log(` ${chalk.hex(hexColor)("•")} ${text}`);
}

export function log(text: string) {
    logFormatted(text, "#555555");
}

export function success(text: string) {
    logFormatted(text, "#50ffab")
}

export function warning(text: string){
    logFormatted(text, "#FFAB00");
}

export function error(text: string) {
    logFormatted(text, "#FF5555")
}

export function stopAnimation() {
    clearInterval(animationLoop);
    animationRunning = false;
}

export function animate(text: string) {
    animationRunning = true;

    animationLoop = setInterval(() => {
        animationFrame++;
        
        if (animationFrame == animationFrames.length) {
            animationFrame = 0;
        }

        process.stdout.write(`\r ${animationFrames[animationFrame]}`);
    }, animationInterval);
}
