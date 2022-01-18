import terminal from "@skylixgh/nitrojs-terminal";
import cliBuilder from "@skylixgh/nitrojs-cli-builder";

terminal.notice("This script will not have error handling, we expect your setup to be correct as you are looking directly at source code ;)");

cliBuilder.setVersion("0.0.0");
cliBuilder.setAuthor("Skylix");
cliBuilder.setName("Dev Tools for NitroJS Developers");

require("./nitrojs-cli/convert-to-dev-mode");

cliBuilder.execute(cliBuilder.getArgv());
