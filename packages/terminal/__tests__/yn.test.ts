import terminal, { askQNA } from './../lib/main';


askQNA("Are you a programmer?", true, (answer) => {
    terminal.log("Your answer: " + (answer ? "Yes" : "No"));
    process.exit();
});
