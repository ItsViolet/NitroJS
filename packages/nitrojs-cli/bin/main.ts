#!/usr/bin/env node

import cliBuilder from "@skylixgh/nitrojs-cli-builder";
import pkg from "../package.json";
import dev from './command/dev/dev';

cliBuilder.setVersion(pkg.version);
cliBuilder.setAuthor(pkg.author);
cliBuilder.setName("NitroJS CLI");

dev();

cliBuilder.execute(cliBuilder.getArgv());
