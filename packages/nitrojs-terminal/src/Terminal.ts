import chalk from "chalk";

/**
 * Create powerful interactive terminal experiences
 */
export default class Terminal { 
    /**
     * If the logger should use time stamps
     */
    private static useTimeStamps = false;
    
    /**
     * Log a simple message into the terminal
     * @param text The text to log
     */
    public static log(text: string) {

    }

    private static logBaseFormat(text: string, hexColor: string, prefix: string) {
        const prefixes = [] as string[];
        
        if (this.useTimeStamps) {
            prefixes.push(
                // TODO: Implement
                chalk.hex("#999999")(`[ ${"UNIMPLEMENTED"} ]`)
            );
        }

        prefixes.push(
            chalk.hex("#999999")("[ ") +
            chalk.hex(hexColor)(prefix) +
            chalk.hex("#999999")(" ]")
        );
    }
}