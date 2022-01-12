import cliBuilder, { FlagType } from "..";
import objectTools from '@skylixgh/nitrojs-object-tools';
import pkg from "../package.json";

cliBuilder.registerNew("hello", {
    flags: {
        name: {
            type: FlagType.arrayBoolean
        }
    }
}, (args, flags) => {
    objectTools.dump(args);
    objectTools.dump(flags);
});

cliBuilder.setVersion("1.0.0-dev");
cliBuilder.setName("B Test TypeScript");

cliBuilder.execute(cliBuilder.getArgv());
