import terminal, { askQNA } from "./../lib/main";

askQNA("Are you a programmer?", true, (isDev) => {
    askQNA("Are you 13 or older", true, (over13) => {
        askQNA("Are you going to school", true, (toSchool) => {
            terminal.log("Answers:");
            terminal.log("  A programmer " + isDev);
            terminal.log("  13 or older " + over13);
            terminal.log("  Going to school " + toSchool);

            process.exit();
        });
    });
});
