"use strict";
const fs = require('fs')
process.chdir(__dirname); // work when launched from any current directory
let data = fs.readFileSync('input', 'utf8');
let [template, insertions] = data.trim().split("\n\n");
// data = data.map(Number)
insertions = insertions.split("\n").map((line)=>line.match(/(\w)+/g)); // lines have multiple numbers. Get : [num1, num2]
insertions = new Map(insertions);
// data = data.map((line)=>line.match(/(\d+)(u|d)(\d+)/).slice(1)) // extract groups from regex. Get : [group1, group2]
// data
// console.log(insertions.get("xNN"));


function *pairwiseString(string){
    let string2 = string.slice(1);
    for(let i = 0;i<string2.length;i++){
        yield [string[i], string2[i]];
    }
}


function step(polymer) {
    let result = polymer[0];
    for(let [a, b] of pairwiseString(polymer)) {
        result += (insertions.get(a+b) ?? "") + b;
        // if(!insertions.has(a+b)) {
        //     result += b;
        // }else {
        //     // result+=
        // }
        // console.log(a, b);
    }
    return result;
}

function steps(polymer, count) {
    for(let i = 0;i<count;i++){
        polymer = step(polymer);
    }
    return polymer;
}

function countCharOccurence(string){
    let occurences = {};
    for(let c of string){
        occurences[c] = occurences[c] ? occurences[c]+1 : 1;
    }
    return occurences;
}

// let after10Steps = steps(template, 10);
// let count = countCharOccurence(after10Steps)

// console.log(Math.max(...Object.values(count)) - Math.min(...Object.values(count)));


//part 2


function countPairs(string){
    let pairs = {};
    for(let pair of pairwiseString(string)){
        let pairString = pair.join("");
        pairs[pairString] = pairs[pairString]? pairs[pairString]+1 : 1;
    }
    return pairs;
}

// function steps(polymer, count) {
//     for(let i = 0;i<count;i++){
//         polymer = step(polymer);
//         let count = countCharOccurence(polymer);
//         let max = Math.max(...Object.values(count))
//         let min = Math.min(...Object.values(count))
//         let pairs = countPairs(polymer);
//         // console.log("step", i+1, max, '\t', min)
//         // console.log("step", 
//         //     i+1,
//         //     polymer.length,
//         //     '\t',
//         //     pairs,
//         //     Object.keys(pairs).length,
//         //     count);
//     }
//     return polymer;
// }

// will get the solution to part 2 by
// 1) computing the polymer as in part 1. Do this until the polymer becomes (too) big
// 2) using the number of pairs in the polymer
//    compute the amount of pairs after the next step
// 3) after the last step. Generate the amount of elements from the pairs

// 1)
let computedSteps = 15;
let computedPolymer = steps(template, computedSteps);
let computedPairs = countPairs(computedPolymer);
let computedCount = countCharOccurence(computedPolymer);

function countElementCountFromPairs(pairs) {
    let occurences = {};
    for(let [pair, count] of Object.entries(pairs)){
        for(let c of pair){
            occurences[c] = occurences[c] ? occurences[c]+count : count;
        }
    }

    // remove over-count
    // over counted because : ABC => B counted twice (once for AB and once for BC
    for(let c in occurences){
        // Math.ceil for the first/last element which is only counted once
        // (because it is on the side)
        occurences[c] = Math.ceil(occurences[c]/2);
    }

    return occurences;
}

// compute the set of pairs that will exist after the next step
function stepPairs(pairs) {
    let newPairs = {};
    for(let [pair, pairCount] of Object.entries(pairs)){
        let charToInsert = insertions.get(pair);
        if(!charToInsert){
            newPairs[pair] = newPairs[pair]? newPairs[pair]+pairCount : pairCount;
        }else{
            let pairOne = pair[0]+charToInsert;
            newPairs[pairOne] = newPairs[pairOne]? newPairs[pairOne]+pairCount: pairCount;
            let pairTwo = charToInsert+pair[1];
            newPairs[pairTwo] = newPairs[pairTwo]? newPairs[pairTwo]+pairCount: pairCount;
        }
    }
    return newPairs;
}

// 2)
let pairs = computedPairs;
let stepsStillToPerform = 40 - computedSteps;
for(let i = 0;i<stepsStillToPerform;i++){
    pairs = stepPairs(pairs);
}

// console.log(countElementCountFromPairs(computedPairs));
// console.log(computedPairs, computedCount);

// 3)
let count = countElementCountFromPairs(pairs);
// console.log(count);
console.log(Math.max(...Object.values(count)) - Math.min(...Object.values(count)));

//bad attempt : it's not the size of the polymer that interests us but the size
// of quantity of moste/least common element
// attempt at guessing numerically the size of the polymer
// let val = 20; // for input 
// val = 7; //for test
// for(let i = 2; i<=40;i++){
//     val = val*2-1;
// }
// //too high 10445360463873
// console.log(val);



/**
 * - What is a good way of counting occurences of each elements in a list?
 *   I rolled my own implementation (countCharOccurence)
 *   but I feel there has got to be a better way
 * - How to get the equivalent of Python's itertools.pairwise?
 *   Rolled my own : pairwiseString
 * - bug in countCharOccurence. Couldn't understand why the occurences object
 *   wouldn't contain anything.
 *   Silly error:
 *   occurences[c] == occurences[c] ? occurences[c]+1 : 1;
 *   instead of
 *   occurences[c] = occurences[c] ? occurences[c]+1 : 1;
 * - stuck at part 2. Cannot compute the actual string (would be way too big)
 *   attempted to analyze by how much the min/max element grows by hoping
 *   there would be some formula (like newMax = a*oldMax + b)
 *   Ended up finding a solution : instead of computing the polymer
 *   compute the amount of pairs and 
 *   in the end get the amount of each elements via the known pairs
 */