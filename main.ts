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

let Active = false;
type userInput = string;
while(Active === true){
    var userInput = prompt('Please chose altarnative: 1. Ding dong \n2. Leave');
    if(userInput === "1"){

    }
    else if (userInput === "2"){
        Active = true
    }
}