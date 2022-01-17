import terminal from "@skylixgh/nitrojs-terminal";

terminal.askString("Name", null, (name) => {
    console.log(name);
});
