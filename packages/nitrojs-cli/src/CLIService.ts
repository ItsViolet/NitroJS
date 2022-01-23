import "source-map-support/register";
import AppConfig from "../bin/interfaces/AppConfig";
import AppConfigType from "../bin/interfaces/AppConfigType";
import { PartialDeep } from "type-fest";

/**
 * Add IDE typings to your config
 * @param config Your config
 * @returns Your config
 */
export function typeConfig(config: PartialDeep<AppConfig>): PartialDeep<AppConfig> {
	return config;
}

export { AppConfig, AppConfigType };
