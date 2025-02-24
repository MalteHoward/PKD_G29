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
// Data Structures
type tv_serie = {

    episodes: Number,
    title: String,
    counter: Number,
    status: String,

}; 

let active = true;
type userInput = string;
while(active === true){
    let userInput = prompt('Please choose altarnative: 1. Add show \n2. My List\n 3. Quit');
    if(userInput === "1"){
        userInput = prompt("Bee")
        if(userInput === "1"){

        }
        else if(userInput === "2"){

        }
    }
    else if(userInput === "2"){
        
    }
    else if (userInput === "3"){
        active = false;
    }
}