#!/usr/bin/env node

const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

if (!fs.existsSync(path.join(__dirname, "../Binary.js"))) {
	console.error(
		"Uh oh... Seems like NitroJS's CLI service wasn't compiled :( Please bug the developers about this mistake"
	);
	console.error("Why did this happen?");
	console.error(
		"  Mistakes always happen :D the person who published this build may have forgotten to run the build script when publishing"
	);

	process.exit(0);
}

spawn(
    "node",
    ["--no-warnings", "--experimental-specifier-resolution=node", path.join(__dirname, "../Binary.js"), process.argv.splice(2)],
    {
        cwd: process.cwd(),
        stdio: [process.stdin, process.stdout, process.stderr],
    }
).on("exit", (code) => process.exit(code));
