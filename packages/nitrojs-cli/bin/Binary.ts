#!/usr/bin/env node --no-warnings --experimental-specifier-resolution=node

import pkg from "../package.json";
import { program } from "commander";
import InitHandle from "./commands/init/InitHandle";
import Terminal from "@skylixgh/nitrojs-terminal";
import path from "path";
import { fileURLToPath } from "url";
import AddHandle from "./commands/add/AddHandle";

/**
 * The CLI service entry point
 */
export class Binary {
	/**
	 * Application main method
	 */
	public constructor() {
		program.version(pkg.version);
		program.name("NitroJS");

        new InitHandle();
        new AddHandle();

		program.parse();
	}

	/**
	 * Render an error formatted
	 * @param error Error exception
	 */
	public static renderErrorException(error: any) {
		error.message.split("\n").forEach((line: string) => {
			Terminal.error(line);
		});

		error.stack.split("\n").forEach((line: string) => {
			Terminal.error(line);
		});
	}
}

new Binary();

export function dirname(metaURL: string) {
    return path.dirname(fileURLToPath(metaURL));
}
