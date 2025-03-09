import {
searchTitleByName as Nameu,
} from 'movier';
const prompt = require("prompt-sync")();
const clear = require("console-clear");

async function fetchShowID(title: string) {
  try {
      clear();
      const results = await Nameu(title);

      if (results.length > 0) {
          let firstResult = null; 

          for (let i = 0; i < results.length; i++) {
            if (results[i].name === title) {
                  firstResult = results[i]; 
              }
                
                if (firstResult && firstResult.source) {
                    const showID = firstResult.source.sourceId;
                    const showyear = firstResult.titleYear;
                    const showtype = firstResult.titleType;
                    const showTitle = firstResult.name;
                    const episodes: number = -1;
                    const counter: number = -1;
                    const status: string = "";
                    console.log(showtype);
                    return { showID, showyear, showtype, showTitle, episodes, counter, status };
                }
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
  showTitle: string | null;
  episodes: number | null;
  counter: number | null;
  status: string | null;
};
//Data examples

let active: boolean = true;
let library: Array<media> = [];

async function main() {
  while (active === true) {
    let userInput: string | null = prompt(
      "Please choose alternative:\n1. Add show \n2. My List \n3. Quit \nOption: "
    );
    clear();
    
    if (userInput === "1") {
      clear();
      let newShow = prompt("Search for show/movie: ");  
      let foundShow = await fetchShowID(newShow);
      
      if (foundShow) {
        let to: media;
        if (foundShow.showtype === "movie") {
          let count = parseInt(prompt("Have you watched this movie? y/1. n/0: "));
          foundShow.counter = count
          foundShow.episodes = 1
          to = {
            showtype: foundShow.showtype,
            showTitle: foundShow.showTitle,
            showyear: foundShow.showyear,
            showID: foundShow.showID,
            episodes: 1,
            counter: count,
            status: statusShow(foundShow),
          };
          library.push(to);
        } else if (foundShow.showtype === "series") {
          let epi = parseInt(prompt("How many episodes: "));
          let count = parseInt(prompt("Episodes watched: "));
          foundShow.episodes = epi
          foundShow.counter = count
          to = {
            showtype: foundShow.showtype,
            showTitle: foundShow.showTitle,
            showyear: foundShow.showyear,
            showID: foundShow.showID,
            episodes: epi,
            counter: count,
            status: statusShow(foundShow),
          };
          library.push(to);
        }
      } else {
        console.log("Show not found.");
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

function yourList(){
  clear();
  let whichList = prompt(
      "Choose list:\n1. Watching \n2. Completed \n3. Watchlist\n");
      clear();
  if (whichList === "1") {
    console.log("\nWatching:");
    for (let show of library) {
      if (show.status === "watching") {
        console.log(show.showTitle + " - " + show.counter + "/" + show.episodes + " episodes watched");
      }
    }
  } else if (whichList === "2") {
    console.log("\nCompleted:");
    for (let show of library) {
      if (show.status === "completed") {
        console.log(show.showTitle + " - " + show.counter + "/" + show.episodes + " episodes watched");
      }
    }
  } else if (whichList === "3") {
    for (let show of library) {
      if (show.status === "watchlist") {
        console.log(show.showTitle + " - " + show.counter + "/" + show.episodes + " episodes watched");
      }
    }

  }
  console.log("\n");
}

main();
