#!/usr/bin/env node

import cliBuilder from "@skylixgh/nitrojs-cli-builder";
import pkg from "../package.json";
import dev from "./commands/dev/dev";
import init from "./commands/init/init";

cliBuilder.setVersion(pkg.version);
cliBuilder.setAuthor(pkg.author);
cliBuilder.setName("NitroJS CLI");

dev();
init();

cliBuilder.execute(cliBuilder.getArgv());
