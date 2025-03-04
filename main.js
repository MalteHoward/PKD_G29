"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var queue_array_1 = require("../lib/queue_array");
//Data examples
var test1 = {
    title: "shrek",
    episodes: 3,
    counter: 0,
    status: "watchlist",
};
var test2 = {
    title: "family guy",
    episodes: 24,
    counter: 0,
    status: "watchlist",
};
var library = [test1, test2];
var active = true;
var watchList = (0, queue_array_1.empty)();
var watching = [];
var completed = (0, queue_array_1.empty)();
var prompt = require("prompt-sync")();
var clear = require("console-clear");
function main() {
    while (active === true) {
        var userInput = prompt("Please choose alternative:\n1. Add show \n2. My List \n3. Quit \nOption: ");
        clear();
        if (userInput === "1") {
            // Add show
            clear();
            var newShow = prompt("Search for show/movie: ");
            //search show in api
            var foundShow = searchShow(newShow);
            if (foundShow) {
                console.log("Available episodes: " + foundShow.episodes);
                foundShow.counter = Number(prompt("Episodes watched: "));
                foundShow.status = statusShow(foundShow);
                sortShow(foundShow);
            }
            else {
                console.log("Show not found");
            }
        }
        else if (userInput === "2") {
            yourList();
            // choice: change show
        }
        else if (userInput === "3") {
            // Quit
            clear();
            active = false;
            console.log("Shutting down...");
        }
        else {
            clear();
            console.log("Invalid Command");
        }
    }
}
function searchShow(show) {
    //search in api
    // found = found in api
    var found = false;
    for (var i = 0; i <= library.length; i++) {
        if (library[i].title === show) {
            found = false;
            return library[i];
        }
    }
    if (found === false) {
        console.log("Media not found");
    }
    //   let name: string | media  = found.title;
    //     name = {
    //         title = found. title,
    //         episodes = found.episodes,
    //         counter = 0,
    //         status = "Plan to watch";
    //     }
    //     return name;
}
function statusShow(show) {
    var episodes = show.episodes;
    var counter = show.counter;
    var result;
    if (counter === 0) {
        result = "watchlist";
    }
    else if (counter === episodes) {
        result = "completed";
    }
    else if (counter && episodes && counter <= episodes) {
        result = "watching";
    }
    else {
        console.log("You entered a number higher than the number of episodes that exists. Show added to completed.");
        result = "completed";
    }
    return result;
}
function sortShow(show) {
    // KOLLA DUBLETTER
    var status = show.status;
    if (status === "watchlist") {
        (0, queue_array_1.enqueue)(show, watchList);
        console.log("Show successfully added");
    }
    else if (status === "completed") {
        (0, queue_array_1.enqueue)(show, completed);
        console.log("Show successfully added");
    }
    else if (status === "watching") {
        watching.push(show);
        console.log("Show successfully added");
    }
    else {
        console.log("Show doesnt have valid status");
    }
    var prom = prompt(""); // Så att den inte clearas direkt innan man hinner läsa vad som har gjorts
    clear();
}
function yourList() {
    clear();
    var whichList = prompt("Choose list:\n1. Watching \n2. Completed \n3. Watchlist\n");
    clear();
    if (whichList === "1") {
        console.log("\nWatching:");
        for (var _i = 0, library_1 = library; _i < library_1.length; _i++) {
            var show = library_1[_i];
            if (show.status === "watching") {
                console.log(show.title + " - " + show.counter + "/" + show.episodes + " episodes watched");
            }
        }
    }
    else if (whichList === "2") {
        console.log("\nCompleted:");
        for (var _a = 0, library_2 = library; _a < library_2.length; _a++) {
            var show = library_2[_a];
            if (show.status === "completed") {
                console.log(show.title + " - " + show.counter + "/" + show.episodes + " episodes watched");
            }
        }
    }
    else if (whichList === "3") {
        for (var _b = 0, library_3 = library; _b < library_3.length; _b++) {
            var show = library_3[_b];
            if (show.status === "watchlist") {
                console.log(show.title + " - " + show.counter + "/" + show.episodes + " episodes watched");
            }
        }
    }
    console.log("\n");
}
main();
