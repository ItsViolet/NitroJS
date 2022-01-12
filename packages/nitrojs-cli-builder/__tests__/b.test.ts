import cliBuilder, { FlagType } from "../lib/main";
import objectTools from '@skylixgh/nitrojs-object-tools';

cliBuilder.registerNew("hello", {
    flags: {
        name: {
            type: FlagType.boolean
        }
    }
}, (args, flags) => {
    objectTools.dump(args);
    objectTools.dump(flags);
});

cliBuilder.execute([ "", "", "hello", "world", "--cute", "true" ]);
