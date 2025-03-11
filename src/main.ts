import { searchTitleByName } from 'movier';
export const prompt = require("prompt-sync")();
const clear = require("console-clear");

export type media = {
  showtype: string | null;
  showyear: number | null;
  showID: string | null;
  showTitle: string | null;
  episodes: number | null;
  counter: number | null;
  status: string | null;
};

export let active: boolean = true;
export let testMode: boolean = false
export let library: Array<media> = [];

/**
 * finds info of requested show/movie in IMDb API
 * @example 
 * //fetchShowID("Shrek");
 * //returns {"tt120202", 2001, movie, "Shrek", -1, -1, ""}
 * @param {string} title - title of show/movie
 * @precondition 
 * @returns the requested show/movie in media format 
 */
export async function fetchShowID(title: string) {
  try {
      clear();
      const results = await searchTitleByName(title);
      if (results.length > 0) {
          let firstResult = null; 
          for (let i = 0; i < results.length; i++) {
            if (results[i].name === title) {
                  firstResult = results[i]; 
              } if (firstResult && firstResult.source) {
                    const showID: string = firstResult.source.sourceId;
                    const showyear: number = firstResult.titleYear;
                    const showtype: string = firstResult.titleType;
                    const showTitle: string = firstResult.name;
                    const episodes: number = -1;
                    const counter: number = -1;
                    const status: string = "";
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

/**
 * Provides an interactive menu that allows the user to manage their media library.
 * 
 * This function repeatedly prompts the user for input and performs actions accordingly, 
 * such as adding new shows to the library and displaying the user's watchlist.
 * It continues to run until the user chooses to quit.
 * 
 * @async
 * @returns {void}
 */

export async function main() {
  if (testMode) {
    console.log("Test mode enabled. Skipping main loop.");
    return; // Exit early in test mode
  }

  while (active === true) {
    console.log("Please choose alternative:\n1. Add show \n2. My List \n3. Quit ")
    let userInput:string | null = prompt("Option: ");
    clear();
    if (userInput === "1") {
      clear();
      let newShow: string = prompt("Search for show/movie: ");  
      let foundShow = await fetchShowID(newShow);
      
      if (foundShow) {
        let dupe: boolean = false;
        let to: media;
        for(let i = 0; i < library.length; i++){
          if(library[i].showID === foundShow.showID){
            dupe = true;
          }
        }
        if(dupe === false){
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
            let epi: number = parseInt(prompt("How many episodes: "));
            let count: number = parseInt(prompt("Episodes watched: "));
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
        } else if (dupe === true){
          console.log("Show already in library.")
        } 
        else {
          console.log("Show not found.");
        }
      }
  }else if (userInput === "2") {
        yourList();
      // choice: change show
  
    }  else if (userInput === "3") {
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

/**
 * Updates the shows status depending on users watched episodes
 * @example
 * statusShow("Breaking Bad");
 * returns "watchlist", "watching" or "completed" depending on if show.counter >=< show.episodes 
 * @param show 
 * @returns new status of show
 */

export function statusShow(show: media): string {
  let episodes = show.episodes;
  let counter = show.counter;
  let result: string;
  if (counter === 0) {
    return show.status = "watchlist";
  } else if (counter === episodes) {
    return show.status = "completed";
  } else if (counter && episodes && counter <= episodes){
   return show.status = "watching";
  } else {
    console.log("The number you entered was larger than ammount of episodes. Show added to completed.")
    show.counter = show.episodes
    return show.status = "completed"
  }
  
}
/**
 * prints the requested list from the users library
 * @returns {void}
 */
export function yourList(){
  clear();
  console.log("Choose list:\n1. Watching \n2. Completed \n3. Watchlist\n4. Edit show")
  let whichList: string = prompt(
      "Option: ");
    clear();
  if (whichList === "1") {
    console.log("Watching:\n");
    for (let show of library) {
      if (show.status === "watching") {
        console.log(show.showTitle + " (" , show.showyear , ")" + 
          " - " , show.counter , "/" , show.episodes , "episodes watched");
      }
    }
  } else if (whichList === "2") {
    console.log("Completed:\n");
    for (let show of library) {
      if (show.status === "completed") {
        console.log(show.showTitle + " (" , show.showyear , ")" + 
          " - " , show.counter , "/" , show.episodes , "episodes watched");
      }
    }
  } else if (whichList === "3") {
    console.log("Watchlist:\n");
    for (let show of library) {
      if (show.status === "watchlist") {
        console.log(show.showTitle + " (" , show.showyear , ")" + 
          " - " , show.counter , "/" , show.episodes , "episodes watched");
      }
    }

  }
  else if (whichList === "4"){
    let searchedtitle = prompt("Search for the show you want to edit: ");
    for (let i = 0; i < library.length; i++) {
      if (library[i].showTitle === searchedtitle) {
        let choice = prompt("1. Change amount of episodes 2. Remove show: ")
        if (choice === "1") {
          library[i].counter = library[i].counter! + parseInt(prompt("New episodes watched: "));
          statusShow(library[i])
          console.log("You have now watched", library[i].counter, 
            "out of",library[i].episodes, "available");
        }
        else if (choice === "2") {
          console.log("You have now removed", library[i].showTitle);
          library.splice(i , 1);
        } 
      }
    }
  }
}
main();