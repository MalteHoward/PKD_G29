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

// type 
type Movie = String;
type MovieList<T>=Pair<T, List<Movie>>;
type Active = boolean;
const Active = true;
while(Active === true){
    

}