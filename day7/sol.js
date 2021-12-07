"use strict";
const fs = require('fs')
process.chdir(__dirname); // work when launched from any current directory
let data = fs.readFileSync('input', 'utf8');
data = data.trim().split("\n");
data = data.map((line)=>line.match(/(-?\d)+/g))[0]; // lines have multiple numbers. Get : [num1, num2]
data = data.map(Number)
// data = data.map((line)=>line.match(/(\d+)(u|d)(\d+)/).slice(1)) // extract groups from regex. Get : [group1, group2]
// data
// console.log(data);

function totalDistanceTo(pos, data) {
    let distances = data.map(p => Math.abs(pos - p));
    return distances.reduce((a, b) => a+b);
}

function findLeastFuel(data, totalDistanceComputation) {
    let minPosition = data.reduce((a,b) => a<b? a : b)
    let maxPosition = data.reduce((a,b) => a<b? b : a)
    // console.log(minPosition, maxPosition);
    let bestDistance = Infinity;
    let bestPosition;
    for(let candidatePos = minPosition;candidatePos<=maxPosition;candidatePos++) {
        let candidateDistance = totalDistanceComputation(candidatePos, data);
        if(candidateDistance < bestDistance) {
            bestDistance = candidateDistance;
            bestPosition = candidatePos;
        }
    }
    return [bestDistance, bestPosition];
}
// console.log("part 1", findLeastFuel(data, totalDistanceTo));

function totalDistanceToPart2(pos, data) {
    let distances = data.map(p => {
        let dist = Math.abs(pos - p);
        return dist*(dist+1)/2;
    });
    return distances.reduce((a, b) => a+b);
}

console.log("part 2", findLeastFuel(data, totalDistanceToPart2));

// console.log(totalDistanceToPart2(0, [1]))

/*
Learned:
- to get the min of a list of number.
  Instead of:
  data.reduce((a,b) => a<b? a : b)
  Can do:
  Math.min(data)
- to print the value of multiple variables for debugging purpose:
  use property value shorthand
  console.log({a, b}); // { a: 2, b: 3 }
*/