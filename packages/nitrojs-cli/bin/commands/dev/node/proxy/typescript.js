////////////////////////////////////////////////
//   Process ARGV Key                         //
//   x[2] - File location                     //
//   x[3] - App root directory                //
////////////////////////////////////////////////

const path = require("path");
const tsNode = require("ts-node");

tsNode.register({
    transpileOnly: true,
    project: path.join(process.argv[3], "tsconfig.json")
});

require(path.join(process.argv[2]));
