import {
    type Pair, pair, head, tail, list, List, is_null,
    for_each, filter, enum_list, member, map, accumulate
} from '../lib/list';
import {
    type Queue, empty, is_empty, enqueue, dequeue, head as qhead
} from '../lib/queue_array';
import {
    type ListGraph, lg_transpose, type MatrixGraph, lg_new
} from '../lib/graphs';
import { hash_id, ph_empty, ph_insert, ph_lookup, ProbingHashtable } 
from '../lib/hashtables';

// Data Structures
type media = {

    title: string | null,
    episodes: number | null,
    counter: number | null,
    status: string | null

}; 

let active: boolean = true;
let watchList: Queue<media> = empty();
let watching: Array<media> = [];
let watched: Queue<media> = empty();
let myList = [watchList, watching, watched];
while(active === true){
    let userInput: string | null = prompt('Please choose altarnative: 1. Add show \n2. My List\n 3. Quit');
    if(userInput === "1"){ // Add show
        let newShow = prompt("seach for show/movie");
        //search show in api
        let foundShow: media | boolean = searchShow(newShow);
        if(foundShow) {
            myList.push(foundShow);
        }
    }
    else if(userInput === "2"){ // My list
        // Print list
        // change show
    }
    else if (userInput === "3"){ // Quit
        active = false;
    }
}

function searchShow(show): media | boolean {

    return show;
}

function statusShow(show): string{
    return status;
} 