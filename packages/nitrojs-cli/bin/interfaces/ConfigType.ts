import ConfigAppType from "../enums/ConfigAppType";

export default interface ConfigType {
    /**
     * The type of app for deployment
     */
    type: ConfigAppType;

    /**
     * Configuration for a node based app
     */
    node: {
        /**
         * Automatically restart the application when files are changed
         */
        autoRestart: boolean;

        /**
         * Any other directories you project is getting resources from
         */
        resourceDirectories: string[];
    }
}
