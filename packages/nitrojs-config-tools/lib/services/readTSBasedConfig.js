require("ts-node").register();

import(process.argv[2]).then((module) => {
    console.log(JSON.stringify(module));
});
