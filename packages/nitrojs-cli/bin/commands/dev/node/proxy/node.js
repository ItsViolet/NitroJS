////////////////////////////////////////////////
//   Process ARGV Key                         //
//   x[2] - File location                     //
////////////////////////////////////////////////

const { spawn } = require("child_process");

const proc = spawn("node", [ process.argv[2] ]);

proc.stdout.pipe(process.stdout);
proc.stderr.pipe(process.stderr);

process.stdin.pipe(proc.stdin);
process.stdin.resume();

proc.on("exit", (code) => {
    process.exit(code);
});
 