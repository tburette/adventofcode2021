"use strict";
const fs = require('fs')
process.chdir(__dirname); // work when launched from any current directory
let data = fs.readFileSync('test', 'utf8');
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

function steps(polymer, count) {
    for(let i = 0;i<count;i++){
        polymer = step(polymer);
        let count = countCharOccurence(polymer);
        let max = Math.max(...Object.values(count))
        let min = Math.min(...Object.values(count))
        // console.log("step", i+1, max, '\t', min)
        console.log("step", i+1, polymer.length, '\t', count)
    }
    return polymer;
}

steps(template, 16);

let val = 20; // for input 
val = 7; //for test
for(let i = 2; i<=40;i++){
    val = val*2-1;
}
//too high 10445360463873
console.log(val);

// can't compute the string itself because it grows too much.
// Compute...something else each steps???


/**
 * - What is a good way of counting occurences of (repeating) elements in a list?
 *   I rolled my own implementation (countCharOccurence)
 *   but I feel there has got to be a better way
 * - bug in countCharOccurence. Couldn't understand why the occurences object
 *   wouldn't contain anything.
 *   Silly error:
 *   occurences[c] == occurences[c] ? occurences[c]+1 : 1;
 *   instead of
 *   occurences[c] = occurences[c] ? occurences[c]+1 : 1;
 * - stuck at part 2. Cannot compute the actual string (would be way too big)
 *   attempted to analyze by how much the min/max element grows by hoping
 *   there would be some formula (like newMax = a*oldMax + b)
 */