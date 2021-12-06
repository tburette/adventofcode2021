"use strict";
const fs = require('fs')
process.chdir(__dirname); // work when launched from any current directory
let data = fs.readFileSync('input', 'utf8');
data = data.trim().split("\n");
// data = data.map(Number)
data = data.map((line)=>line.match(/(-?\d)+/g))[0]; // lines have multiple numbers. Get : [num1, num2]
// data = data.map((line)=>line.match(/(\d+)(u|d)(\d+)/).slice(1)) // extract groups from regex. Get : [group1, group2]
data
console.log(data);

function simulate(data, days) {
    data = Array.from(data);
    for(let i=0;i<days;i++) {
        // could have written:
        // toCreate = data.filter(e => e).length
        // data = data.map(i => i? i-1 : 6);
        let toCreate = 0;
        data = data.map(i =>{
            if(i == 0) {
                toCreate++;
                return 6
            }
            return i-1;
        });
        data = data.concat(Array(toCreate).fill(8));
        // console.log("after", i+1, "th day", data)
    }
    return data;
}

let r = simulate(data, 80);
console.log("part 1", r.length)

// change the data structure holding the fishes
// 'fish count' data structure:
// array with indexes between : [0, 8] each index contains the number of fishes
// which will create a new fish after 'index' amount of days
function simulateFast(data, days) {
    for(let i=0;i<days;i++) {
        let zeroCount = data.shift();
        // 8
        data.push(zeroCount);
        //6
        data[6] += zeroCount;
    }
    return data;
}

function convertDataToCount(data) {
    let fishCount = Array(9).fill(0);
    for(let v of data) {
        fishCount[v]++;
    }   
    return fishCount; 
}

console.log(convertDataToCount(data))
let r2 = simulateFast(convertDataToCount(data), 256);

console.log(r2.reduce((a, b)=>a+b));

/*
Learned:
- instead of fileData.split("\n").map(..regexp..)[0]
  could have done : fileData.split(",").map(Number)
  It's ok since I already had the complex version available at hand.
- some operations (map, find,..) do not work (no iterations) 
  with sparse arrays (Array(9))
- Node's API for reading file can get complicated/limited quite quickly
  (eg. just want to read file line by line)
*/