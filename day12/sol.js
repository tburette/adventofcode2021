"use strict";
const fs = require('fs')
process.chdir(__dirname); // work when launched from any current directory
let data = fs.readFileSync('input', 'utf8');
data = data.trim().split("\n");
// data = data.map(Number)
// data = data.map((line)=>line.match(/(-?\d)+/g)); // lines have multiple numbers. Get : [num1, num2]
data = data.map((line)=>line.match(/(\w+)-(\w+)/).slice(1)) // extract groups from regex. Get : [group1, group2]
// data

let graph = new Map();
function addToGraph(key, value){
    if(!graph.has(key)){
        graph.set(key, new Set())
    }
    graph.get(key).add(value);
}
for(let[cave1, cave2] of data){
    addToGraph(cave1, cave2);
    addToGraph(cave2, cave1);
}

function isSmallCave(cave){
    return cave[0] == cave[0].toLowerCase();
}

//BFS?
function findAllPaths(){
    let paths = new Set();

    let visited = new Set();
    function addToVisited(path){
        visited.add(path.join());
    }
    function hasBeenVisited(path){
        return visited.has(path.join());
    }


    let potentialPaths = [["start"]];
    visited.add(potentialPaths[0]);

    while(potentialPaths.length){
        let potentialPath = potentialPaths.shift();
        let neighbors = graph.get(potentialPath.at(-1));
        for (let neighbor of neighbors) {
            //check if neighbor is an already visited small cave
            if(isSmallCave(neighbor) && potentialPath.includes(neighbor)){
                continue;
            }

            let newPath = potentialPath.concat([neighbor]);
            // console.log(newPath);
            if(neighbor == 'end'){
                paths.add(newPath);
            }else if(!hasBeenVisited(newPath)){
                potentialPaths.push(newPath);
            }
        }
    }

    return paths;
}

// let result = findAllPaths();
// console.log(result, result.size);


// part 2

function hasVisitedSmallCaveTwice(path){
    let lowerPath = path.filter(e=>e == e.toLowerCase());
    return lowerPath.length != new Set(lowerPath).size;
}

//copy-pasted part 1
function findAllPaths2(){
    let paths = new Set();

    let visited = new Set();
    function addToVisited(path){
        visited.add(path.join());
    }
    function hasBeenVisited(path){
        return visited.has(path.join());
    }


    let potentialPaths = [["start"]];
    visited.add(potentialPaths[0]);

    while(potentialPaths.length){
        //shift means we use BFS
        //using pop() instead would have meant we used DFS
        //using pop is much faster!
        let potentialPath = potentialPaths.shift();
        let neighbors = graph.get(potentialPath.at(-1));
        for (let neighbor of neighbors) {
            if (neighbor == 'start'){
                //can never visit start twice
                continue;
            }
            //check if about to visit a small cave twice
            if(isSmallCave(neighbor) && 
            potentialPath.includes(neighbor) 
            ){
                //can only visit two times a save cave once
                //allow visiting a small cave twice if :
                if(hasVisitedSmallCaveTwice(potentialPath))
                    //already visited a small cave twice, cannot do it again
                    continue;
            }

            let newPath = potentialPath.concat([neighbor]);
            // console.log(newPath);
            if(neighbor == 'end'){
                paths.add(newPath);
                if(paths.size % 100 == 0)console.log(paths.size, visited.size);
                // if(paths.size % 5000 == 0)
                //     debugger;
            }else if(!hasBeenVisited(newPath)){
                // addToVisited(newPath);
                potentialPaths.push(newPath);
            }
        }
    }

    return paths;
}

let result2 = findAllPaths2();
console.log(result2.size);

/**
 * - mix up shift() and unshift()
 * - how to add an element to an array resulting in a new array without modifying the existing one? => array.concat(otherArray)
 * - vs code debugger : variables are grouped by block : multiple groups for a single function
 * - I mistook the long running time with a bug : 
 *      the big example input just slightly smaller in size to the actual input
 *      took much less time
 *      => problem with exponential growth or example problem simpler?
 * - I added a visited set to store the paths already visited
 *   to prevent infinite loop.
 *   It turned out to be not needed
 *   never actually added elements to it in part 1!
 *   Not sure why
 * - Using DFS instead instead of BFS (see potentialPaths.shift()) has
 *   a much better running time
 */