//Irfan gillar pojkar
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
import {
  getTitleDetailsByName as Name,
  getPersonDetailsByIMDBId,
  getPersonDetailsByName,
  getPersonDetailsByUrl,
  getTitleDetailsByFoundedTitleDetails,
  getTitleDetailsByIMDBId,
  getTitleDetailsByUrl,
  EpisodeCreditsDetails,
  searchTitleByName as Nameu,
} from "movier"; // Import the function directly
const prompt = require("prompt-sync")();
const clear = require("console-clear");

//Funkar får ID:t men endast när programmet stängs av, vet ej hut man fixar
async function fetchShowID(title: string) {
  try {
      clear(); 
      const results = await Nameu(title); 

      if (results.length > 0) {
          const firstResult = results[0]; 

          if (firstResult.source) {
              var showID = firstResult.source.sourceId
              var showyear = firstResult.titleYear
              var showtype = firstResult.titleType
              var name = firstResult.name
              console.log(showyear)
              console.log(showtype)
              console.log(showID)
              return {showID, showyear, showtype, name};
            } else {
              console.log("No source found for the first entry.");
          }
      } else {
          console.log("No results found.");
      }
      
  } catch (error) {
      console.error("Error fetching show details:", error);
  
}
}


type media = {
  showtype: string | null;
  showyear: number | null;
  showID: string | null;
  title: string | null;
  episodes: number | null;
  counter: number | null;
  status: string | null;
};
//Data examples

let active: boolean = true;
let watchList: Queue<media> = empty();
let watching: Array<media> = [];
let completed: Queue<media> = empty();
let library: Array<media> = [];
function main() {
  while (active === true) {
    let userInput: string | null = prompt(
      "Please choose alternative:\n1. Add show \n2. My List \n3. Quit \nOption: "
    );
    clear();
    if (userInput === "1") {
      clear();
  
      let newShow = prompt("Search for show/movie: ");
  
      let foundShowPromise = fetchShowID(newShow);
  
      foundShowPromise
          .then((foundShow) => {
              if (foundShow) {
                if(foundShow.showtype === "movie") {
                  let count = prompt()
                  let movie1: media = {
                    title: foundShow.name,
                    showyear: foundShow.showyear,
                    showID: foundShow.showID,
                    episodes: 1,
                    counter: count,
                    status: statusShow(foundShow),
                  }
                }
              } else {
                  console.log("Show not found.");
              }
          })
          .catch((error) => {
              console.error("Error while fetching show:", error);
          });
  
  
      }else if (userInput === "2") {
        yourList();
      // choice: change show
    } else if (userInput === "3") {
      // Quit
      clear();

      active = false;
      console.log("Shutting down...");
    } else {
      clear();

      console.log("Invalid Command");
    }
  }
}

function statusShow(show: media): string {
  let episodes = show.episodes;
  let counter = show.counter;
  let result: string;

  if (counter === 0) {
    result = "watchlist";
  } else if (counter === episodes) {
    result = "completed";
  } else if (counter && episodes && counter <= episodes) {
    result = "watching";
  } else {
    console.log(
      "You entered a number higher than the number of episodes that exists. Show added to completed."
    );
    result = "completed";
  }
  return result;
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
  let prom = prompt(""); // Så att den inte clearas direkt innan man hinner läsa vad som har gjorts
  clear();
}

function yourList() {
  clear();
  let whichList = prompt(
    "Choose list:\n1. Watching \n2. Completed \n3. Watchlist\n"
  );
  clear();
  if (whichList === "1") {
    console.log("\nWatching:");
    for (let show of library) {
      if (show.status === "watching") {
        console.log(
          show.title +
            " - " +
            show.counter +
            "/" +
            show.episodes +
            " episodes watched"
        );
      }
    }
  } else if (whichList === "2") {
    console.log("\nCompleted:");
    for (let show of library) {
      if (show.status === "completed") {
        console.log(
          show.title +
            " - " +
            show.counter +
            "/" +
            show.episodes +
            " episodes watched"
        );
      }
    }
  } else if (whichList === "3") {
    for (let show of library) {
      if (show.status === "watchlist") {
        console.log(
          show.title +
            " - " +
            show.counter +
            "/" +
            show.episodes +
            " episodes watched"
        );
      }
    }
  }
  console.log("\n");
}

main();
