import Terminal, { TerminalAnimation } from "@skylixgh/nitrojs-terminal";
import { program } from "commander";
import path from "path";
import AppConfigType from "../../interfaces/AppConfigType";
import CommandFlags from "./CommandFlags";
import Utils from "./utils/Utils";
import Node from "./node/Node";

/**
 * Command handler for the universal dev server
 */
export default class DevHandle {
	/**
	 * Dev server main
	 */
	public constructor() {
		program
			.command("dev [projectRoot]")
			.option("--config", "The configuration path", "nitrojs.config")
            .action((projectRoot, options: CommandFlags) => {
				Utils.readConfig(path.join(process.cwd(), projectRoot ?? "./", options.config ?? "nitrojs.config"), (config) => {
					if (config.type == AppConfigType.node) {
						new Node(options, path.join(process.cwd(), projectRoot ?? "./"));
                    } else {
                        Terminal.notice("This dev server cannot execute your app because this type of app isn't supported yet");
                    }
				});
			});
	}
}
