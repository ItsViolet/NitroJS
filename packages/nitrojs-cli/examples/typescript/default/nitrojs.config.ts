import { AppConfigType, typeConfig } from "@skylixgh/nitrojs-cli";

export default typeConfig({
    type: AppConfigType.node,
    node: {
        program: {
            args: ["Hello", "World"]
        }
    }
});
