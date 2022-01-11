import terminal from './../lib/main';

terminal.askString("What it you name", "XFaon", (answer) => {
    terminal.log("Nice to meet you, " + answer);
});
