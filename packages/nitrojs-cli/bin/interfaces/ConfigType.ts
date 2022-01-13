import ConfigAppType from "../enums/ConfigAppType";

export default interface ConfigType {
    /**
     * The type of app for deployment
     */
    type: ConfigAppType;
}