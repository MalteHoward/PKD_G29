//(spara i textfil?????), 
import {
searchTitleByName,
} from 'movier';
export const prompt = require("prompt-sync")();

export const clear = require("console-clear");

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

export let library: Array<media> = [];

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
                    const showID = firstResult.source.sourceId;
                    const showyear = firstResult.titleYear;
                    const showtype = firstResult.titleType;
                    const showTitle = firstResult.name;
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

export async function main() {
  while (active === true) {
    let userInput: string | null = prompt(
      "Please choose alternative:\n1. Add show \n2. My List \n3. Quit \nOption: ");
    clear();
    if (userInput === "1") {
      clear();
      let newShow = prompt("Search for show/movie: ");  
      let foundShow = await fetchShowID(newShow);
      
      if (foundShow) {
        let dupe: boolean = false
        let to: media;
        for(let i = 0; i < library.length; i++){
          if(library[i].showID === foundShow.showID){
            dupe = true
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
    console.log("You entered a number higher than the number of episodes that exists. Show added to completed.")
    show.counter = show.episodes
    return show.status = "completed"
  }
  
}

export function yourList(){
  clear();
  let whichList = prompt(
      "Choose list:\n1. Watching \n2. Completed \n3. Watchlist\n4. Add episodes to show\n5. Remove show ");
      clear();
  if (whichList === "1") {
    console.log("Watching:\n");
    for (let show of library) {
      if (show.status === "watching") {
        console.log(show.showTitle + " (" , show.showyear , ")" + " - " , show.counter , "/" , show.episodes , "episodes watched");
      }
    }
  } else if (whichList === "2") {
    console.log("Completed:\n");
    for (let show of library) {
      if (show.status === "completed") {
        console.log(show.showTitle + " (" , show.showyear , ")" + " - " , show.counter , "/" , show.episodes , "episodes watched");
      }
    }
  } else if (whichList === "3") {
    console.log("Watchlist:\n");
    for (let show of library) {
      if (show.status === "watchlist") {
        console.log(show.showTitle + " (" , show.showyear , ")" + " - " , show.counter , "/" , show.episodes , "episodes watched");
      }
    }

  }
  else if (whichList === "4"){
    let searchedtitle = prompt("Search for the show you want to edit: ");
    for (let i = 0; i < library.length; i++) {
      if (library[i].showTitle === searchedtitle) {
        library[i].counter = library[i].counter! + parseInt(prompt("New episodes watched: "));
        statusShow(library[i])
        console.log("You have now watched", library[i].counter, "out of",library[i].episodes, "avalible");
      }
    }
  }
}

main();