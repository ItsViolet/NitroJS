import chalk from "chalk";
import readline from "readline";
import stripANSI from "strip-ansi";

let animationLoop: NodeJS.Timer | number;
let animationRunning = false;
let animationFrame = 0;
let animationText = "";
let animationEndHex = "#999999";
let animationFullStopped = true;
let questionRunning = false;
let animationRenderFunction: (updateFrame: boolean) => void;
const animationInterval = 100;
const animationFrames = ["|", "/", "-", "\\"];

export enum State {
    info,
    success,
    warning,
    error
}

/**
 * Set the directory for storing debug logs
 * @param logDir The directory to store the log files in
 * @returns A promise for if the directory was set
 */
export function setDebugLocation(logDir: string): Promise<void> {
    return new Promise((resolve, reject) => {

    });
}

/**
 * Colorize some text with hex
 * @param text The text to colorize
 * @param hexColor The hex color for the text
 * @returns The colorized text
 */
export function hexColorize(text: string, hexColor: string): string {
    return chalk.hex(hexColor)(text);
}

/**
 * Store some text in the debug log
 * @param text The debug text
 */
function storeInDebug(text: string) {
    console.log(text);
}

type LogFormattedHexColor = "#999999" | "#50ffab" | "#FFAB00" | "#FF5555";

/**
 * Create and print a formatted message in the terminal
 * @param text Text message
 * @param hexColor Hex color for prefix bullet
 * @param debug Send this message only to the debug log
 * @returns Nothing
 */
function logFormatted(text: string, hexColor: LogFormattedHexColor, debug = false) {
    if (!animationFullStopped || questionRunning) {
        return;
    }

    if (debug) {
        let prefix = "";

        switch (hexColor) {
            case "#50ffab":
                prefix = " [ Success ]";
                break;

            case "#999999":
                prefix = " [ Info ]";
                break;

            case "#FF5555":
                prefix = " [ Error ]";
                break;

            case "#FFAB00":
                let strippedText = stripANSI(text);

                if (strippedText == text) {
                    prefix = " [ Warning ]";
                } else {
                    prefix = " [ Notice ]";
                }
                break;
        }

        storeInDebug(`${prefix} ${stripANSI(text)}`);
        return;
    }

    console.log(` ${chalk.hex(hexColor)("•")} ${text}`);
}

/**
 * Log an info message into the terminal
 * @param text The text to log
 * @param debug Send this message only to the debug log
 */
export function log(text: string, debug = false) {
    logFormatted(text, "#999999", debug);
}

/**
 * Log a success message into the terminal
 * @param text Text to log
 * @param debug Send this message only to the debug log
 */
export function success(text: string, debug = false) {
    logFormatted(text, "#50ffab", debug);
}

/**
 *  Log a warning message into the terminal
 * @param text Text to log
 * @param debug Send this message only to the debug log
 */
export function warning(text: string, debug = false) {
    logFormatted(text, "#FFAB00", debug);
}

/**
 * Log an error message into the terminal
 * @param text The text to log
 * @param debug Send this message only to the debug log
 */
export function error(text: string, debug = false) {
    logFormatted(text, "#FF5555", debug);
}

/**
 * Log a notice message into the terminal
 * @param text The text to log
 * @param debug Send this message only to the debug log
 */
export function notice(text: string, debug = false) {
    logFormatted(chalk.hex("#FFAB00")(text), "#FFAB00", debug);
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
            animationEndHex = "#999999";
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

    if (animationRenderFunction) animationRenderFunction(true);
    clearInterval(animationLoop as number);

    process.stdout.write("\n");
    animationFullStopped = true;
}

/**
 * Update the text of a currently running animation
 * @param newAnimationMessage The new text for the animation
 * @returns Nothing
 */
export function updateAnimation(newAnimationMessage: string) {
    if (!animationRunning || animationFullStopped || questionRunning) {
        return;
    }

    animationText = newAnimationMessage;
    animationRenderFunction(false);
}

/**
 * Create an animated terminal message
 * @param text Text to write the animations message
 */
export function animate(text: string) {
    (async () => {
        animationText = text;
        animationRunning = true;
        animationFullStopped = false;

        animationRenderFunction = (updateFrame = true) => {
            if (updateFrame) animationFrame++;

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
        };

        animationLoop = setInterval(animationRenderFunction, animationInterval);
    })();
}

/**
 * Ask a yes or no question
 * @param question The question
 * @param defaultAnswer The default answer
 * @param callBack The answer callback
 */
export function askYN(question: string, defaultAnswer: boolean, callBack: (answer: boolean) => void) {
    askString(
        question + " (Y/n)",
        defaultAnswer ? "Y" : "n",
        (answer) => {
            callBack(answer.toLocaleLowerCase() == "y");
        },
        (answer) => {
            if (answer.toLowerCase() != "y" && answer.toLowerCase() != "n") {
                return `Please specify "Y" or "n"`;
            }
        }
    );
}

/**
 * Ask a question that can receive a string answer
 * @param question The question to ask
 * @param defaultAnswer The default question answer
 * @param callBack The answer call back
 * @param validator The input validation call back, return a string to render an error
 * @returns Nothing
 */
export function askString(
    question: string,
    defaultAnswer: string | null,
    callBack: (answer: string) => void,
    validator?: (answer: string) => string | void
) {
    if (!animationFullStopped || questionRunning) {
        return;
    }

    questionRunning = true;

    const ask = () => {
        const rl = readline.createInterface({
            output: process.stdout,
            input: process.stdin
        });

        rl.question(
            ` ${chalk.hex("#999999")(">")} ${question}${defaultAnswer ? chalk.hex("#999999")(" [ " + defaultAnswer + " ]") : ""}: `,
            (answer) => {
                const validated = validator ? validator(answer.length > 0 ? answer : defaultAnswer ?? "") : null;

                if (validated) {
                    questionRunning = false;
                    error(validated);
                    questionRunning = true;
                    rl.close();

                    ask();
                    return;
                }

                rl.close();
                questionRunning = false;

                callBack(answer.length > 0 ? answer : defaultAnswer ?? "");
            }
        );
    };

    ask();
}

const terminal = {
    log,
    success,
    warning,
    error,
    animate,
    updateAnimation,
    stopAnimation,
    askString,
    askYN,
    hexColorize,
    notice,
    setDebugLocation
};

export default terminal;
