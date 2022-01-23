import Terminal from "../../src/Terminal";
import readline from "readline";
import chalk from "chalk";

Terminal.log("This is an info message");
Terminal.success("This is a success message");
Terminal.warn("This is a warning message");
Terminal.error("This is an error message\n");

Terminal.setTimeStampsMode(true);
Terminal.log("Now rendering with time stamps \n");

Terminal.log("This is an info message");
Terminal.success("This is a success message");
Terminal.warn("This is a warning message");
Terminal.error("This is an error message");
