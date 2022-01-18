import { defineConfig, ConfigAppType } from "@skylixgh/nitrojs-cli";

export default defineConfig({
    type: ConfigAppType.node,
    node: {
        resourceDirectories: [ "../../packages/nitrojs-rest-server" ]
    }
});
e