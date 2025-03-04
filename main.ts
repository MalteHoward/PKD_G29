import {
  type Pair,
  pair,
  head,
  tail,
  list,
  List,
  is_null,
  for_each,
  filter,
  enum_list,
  member,
  map,
  accumulate,
} from "../lib/list";
import {
  type Queue,
  empty,
  is_empty,
  enqueue,
  dequeue,
  head as qhead,
} from "../lib/queue_array";
import {
  type ListGraph,
  lg_transpose,
  type MatrixGraph,
  lg_new,
} from "../lib/graphs";
import {
  hash_id,
  ph_empty,
  ph_insert,
  ph_lookup,
  ProbingHashtable,
} from "../lib/hashtables";

// Data Structures
type media = {
  title: string | null;
  episodes: number | null;
  counter: number | null;
  status: string | null;
};
//Data examples
let test1: media = {
  title: "shrek",
  episodes: 3,
  counter: 0,
  status: "watchlist",
};


let test2: media = {
  title: "family guy",
  episodes: 24,
  counter: 0,
  status: "watchlist",
};

let library = [test1, test2];

let active: boolean = true;
let watchList: Queue<media> = empty();
let watching: Array<media> = [];
let completed: Queue<media> = empty();

const prompt = require("prompt-sync")();
const clear = require("console-clear");
function main() {
  while (active === true) {
    let userInput: string | null = prompt(
      "Please choose alternative:\n1. Add show \n2. My List \n3. Quit \nOption: "
    );
    clear();
    if (userInput === "1") {
      // Add show
      clear();
      let newShow = prompt("Search for show/movie: ");
      //search show in api
      let foundShow: media | undefined = searchShow(newShow);
      if (foundShow) {
        console.log("Available episodes: " + foundShow.episodes)
        foundShow.counter = Number(prompt("Episodes watched: "));
        foundShow.status = statusShow(foundShow);
        sortShow(foundShow);
      } else {
        console.log("Show not found");
      }
      }else if (userInput === "2") {
        yourList();
      // choice: change show
    } else if (userInput === "3") {
      // Quit
      clear();

      active = false;
      console.log("Shutting down...")
    } else {
        clear();

      console.log("Invalid Command");
    }
  }
}

function searchShow(show: string): media | undefined {
  //search in api
  // found = found in api
  let found: boolean = false;
  for (let i = 0; i <= library.length; i++) {
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

function statusShow(show: media): string {
  let episodes = show.episodes;
  let counter = show.counter;
  let result: string;
  if (counter === 0) {
    result = "watchlist";
  } else if (counter === episodes) {
    result = "completed";
  } else if (counter && episodes && counter <= episodes){
    result = "watching";
  } else {
    console.log("You entered a number higher than the number of episodes that exists. Show added to completed.")
    result = "completed"
  }
  return result
}

function sortShow(show: media): void {
  // KOLLA DUBLETTER
  let status = show.status;
  if (status === "watchlist") {
    enqueue(show, watchList);
    console.log("Show successfully added");
  } else if (status === "completed") {
    enqueue(show, completed);
    console.log("Show successfully added");
  } else if (status === "watching") {
    watching.push(show);
    console.log("Show successfully added");
  } else {
    console.log("Show doesnt have valid status");
  }
  let prom = prompt("") // Så att den inte clearas direkt innan man hinner läsa vad som har gjorts
  clear();
}

function yourList(){
    clear();
    let whichList = prompt(
        "Choose list:\n1. Watching \n2. Completed \n3. Watchlist\n");
        clear();
    if (whichList === "1") {
        console.log("MyList:")
        for (let i = 0; i < watching.length; i++) {
          console.log(watching[i].title);
        }
    } else if (whichList === "2") {
        console.log("MyList:")
        for (let i = 0; i < completed[2].length; i++){
            process.stderr.write((completed[2])[i].title + ", ");
        }
    } else if (whichList === "3") {
        console.log("MyList:")
        for (let i = 0; i < watchList[2].length; i++){
            process.stderr.write((watchList[2])[i].title + ", ");
        }
        

    }
    console.log("\n");
}

main();
