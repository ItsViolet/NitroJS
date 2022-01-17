#!/usr/bin/env node

require("ts-node").register({ transpileOnly: true, compilerOptions: { module: "CommonJS" } });
require("./main.ts");
 