import terminal, { askQNA } from './../lib/main';


askQNA("Are you a programmer?", (answer) => {
    terminal.log("Your answer: " + (answer ? "Yes" : "No"));
});
