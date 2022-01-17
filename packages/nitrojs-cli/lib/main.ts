import { DeepPartial } from "../../nitrojs-cli-builder/node_modules/@skylixgh/nitrojs-object-tools/lib/main";
import ConfigAppType from "../bin/enums/ConfigAppType";
import ConfigType from "../bin/interfaces/ConfigType";

/**
 * Support IDE/editor auto complete support with this function
 * @param config Your application's configuration
 * @returns Your application's configuration
 */
export function defineConfig(config: DeepPartial<ConfigType>) {
    return config;
}

export { 
    ConfigType as UserConfig, 
    ConfigAppType as UserConfigType
};
