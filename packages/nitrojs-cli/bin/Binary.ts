#!/usr/bin/env node --no-warnings --experimental-specifier-resolution=node

import "source-map-support/register";
import { program } from "commander";
import { fileURLToPath } from "url";
import InitHandle from "./commands/init/InitHandle";
import pkg from "../package.json";
import Terminal from "@skylixgh/nitrojs-terminal";
import path from "path";
import AddHandle from "./commands/add/AddHandle";
import DevHandle from "./commands/dev/DevHandle";
import skylixLogo from "./SkylixLogo";

/**
 * The CLI service entry point
 */
export class Binary {
	/**
	 * Application main method
	 */
	public constructor() {
		console.log(skylixLogo);
		program.version(pkg.version);
		program.name("NitroJS");

		new InitHandle();
        new AddHandle();
        new DevHandle();

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
