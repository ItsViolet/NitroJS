#!/usr/bin/env node

import cliBuilder from "@skylixgh/nitrojs-cli-builder";
import pkg from "../package.json";
import dev from './command/dev/dev';
import init from "./command/init/init";

cliBuilder.setVersion(pkg.version);
cliBuilder.setAuthor(pkg.author);
cliBuilder.setName("NitroJS CLI");

dev();
init();

cliBuilder.execute(cliBuilder.getArgv());
