import path from "path";
import configTools from "../../../nitrojs-config-tools/lib/main";
import ConfigAppType from "../enums/ConfigAppType";
import ConfigType from "../interfaces/ConfigType";

/**
 * Read the NitroJS app config
 * @param path The path to the config
 */
export default function readConfig(configPath = "nitrojs.config.ts", callBack: (config: ConfigType) => void) {
    configTools.read<ConfigType>(path.join(process.cwd(), configPath), {
        type: ConfigAppType.desktop
    }, {
        supportedTypes: {
            yaml: false,
            json: false
        }
    }).then(config => {
        callBack(config);
    });
}