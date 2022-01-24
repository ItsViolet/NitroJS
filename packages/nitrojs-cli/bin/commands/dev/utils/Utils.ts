import AppConfig from "../../../interfaces/AppConfig";
import ConfigTools from "@skylixgh/nitrojs-config-tools";
import { Binary } from "../../../Binary";
import path from "path";

/**
 * Utility methods
 */
export default class Utils {
    /**
     * Read a user config
     * @param configPath The configuration path relative to current CWD
     * @param callback The callback for when the config is processes
     */
    public static readConfig(configPath: string, callback: (config: AppConfig) => void) {
        ConfigTools.read(path.join(process.cwd(), configPath)).then(config => {
            callback(config)
        }).catch((error) => {
            Binary.renderErrorException(error);
        });
    }
}