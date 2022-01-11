import terminal from './../lib/main';

terminal.log("Welcome, let's get started");

terminal.askString("What's you name?", null, (name) => {
    terminal.askString("How old are you?", null, (age) => {
        terminal.askYN("Have a website?", false, (wb) => {
            terminal.log("Results:");
            terminal.log("  Name: " + name);
            terminal.log("   Age: " + age);
            terminal.log("   Web: " + wb);
        });
    });
});
