import terminal from "@skylixgh/nitrojs-terminal";

terminal.log("Welcome to your NitroJS starter app");
terminal.log("About This APP:");
terminal.log("  Type: Node");
terminal.log("  Module: CommonJS");
terminal.log("  Using TypeScript: True");
terminal.log("Get started by reading the documentation! https://docs.skylix.net/docs");

terminal.askString("Your name", null, (name) => {
    terminal.success("We got your name! Its: " + name);
    process.exit();
});
    