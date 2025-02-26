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
let myList = [watchList, watching, completed];

const prompt = require("prompt-sync")();
const clear = require("console-clear");
function main() {
  while (active === true) {
    let userInput: string | null = prompt(
      "Please choose alternative:\n 1. Add show \n2. My List \n 3. Quit \nOption: "
    );
    clear();
    if (userInput === "1") {
      // Add show
      let newShow = prompt("seach for show/movie: ");
      //search show in api
      let foundShow: media | undefined = searchShow(newShow);
      if (foundShow) {
        foundShow.counter = Number(prompt("Episodes watched: "));
        foundShow.status = statusShow(foundShow);
        sortShow(foundShow);
      } else {
        console.log("show not found");
      }
      }else if (userInput === "2") {
        yourList();
  
      // choice: change show
    } else if (userInput === "3") {
      // Quit
      active = false;
    } else {
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
    result = "watchList";
  } else if (counter === episodes) {
    result = "completed";
  } else {
    result = "watching";
  }
  return result;
}

function sortShow(show: media): void {
  // KOLLA DUBLETTER
  let status = show.status;
  if (status === "watchlist") {
    enqueue(show, watchList);
  } else if (status === "completed") {
    enqueue(show, completed);
  } else if (status === "watching") {
    watching.push(show);
  }
}

function yourList(){
    let whichList = prompt(
        "Choose list:\n1. Watching \n2. Completed, \n3. Watchlist");
    if (whichList === "1") {
        for (let i = 0; i < watching.length; i++) {
          console.log(watching[i].title);
        }
    } else if (whichList === "2") {
        for (let i = 0; i < completed[2].length; i++){
            process.stderr.write((completed[2])[i].title + ", ");
        }
    } else if (whichList === "3") {
        for (let i = 0; i < watchList[2].length; i++){
            process.stderr.write((watchList[2])[i].title + ", ");
        }        
    }
    console.log("\n");
}

main();
