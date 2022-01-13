import path from "path";
import configTools from "../../../nitrojs-config-tools/lib/main";
import ConfigAppType from "../enums/ConfigAppType";
import ConfigType from "../interfaces/ConfigType";
import { Errors as ConfigToolsErrors } from "@skylixgh/nitrojs-config-tools"; 
import terminal, { State as TerminalState } from "@skylixgh/nitrojs-terminal";

/**
 * Read the NitroJS app config
 * @param path The path to the config
 */
export default function readConfig(configPath = "nitrojs.config.ts", callBack: (config: ConfigType) => void) {
    terminal.animate("Loading your application's configuration");

    configTools.read<ConfigType>(path.join(process.cwd(), configPath), {
        type: ConfigAppType.desktop
    }, {
        supportedTypes: {
            yaml: false,
            json: false
        }
    }).then(config => {
        terminal.stopAnimation(TerminalState.success, "Successfully loaded your application's configuration");
        callBack(config);
    }).catch((errorCode) => {
        switch (errorCode) {
            case ConfigToolsErrors.fileContainsErrors:
                terminal.stopAnimation(TerminalState.error, "Failed to load the configuration because it contains errors, please use an IDE/editor to debug it");
                break;

            case ConfigToolsErrors.filePathWasDirectory:
                terminal.stopAnimation(TerminalState.error, "Failed to load the configuration because the file path provided was a directory");
                break;

            case ConfigToolsErrors.incorrectExportOrNone:
                terminal.stopAnimation(TerminalState.error, "Failed to load the configuration because either a config was not exported or was exported using the wrong name");
                break;
            
            case ConfigToolsErrors.invalidFilePath:
                terminal.stopAnimation(TerminalState.error, "Failed to load the configuration because the file path provided is invalid or the file doesn't exist in the current directory");
                break;

            case ConfigToolsErrors.unsupportedFileType:
                terminal.stopAnimation(TerminalState.error, "Failed to load the configuration because the file extension is unsupported for loading configurations in this app");
                break;
        }
    });
}