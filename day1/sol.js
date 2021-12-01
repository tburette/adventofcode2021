"use strict";
const fs = require('fs')
//for terminal (node) and VS code (quokka) compatibility
// in VS Code (and Quokka), cwd is not the directory of this script but the root project
process.chdir(__dirname);
// fs.readFile('input', 'utf8', (err, data) => {    
//     console.log(err, data);
// });
let data = fs.readFileSync('input', 'utf8');
data = data.trim().split("\n");
data = data.map(Number)
// data = data.map((line)=>line.match(/(-?\d)+/g)); // lines have multiple numbers. Get : [num1, num2]
// data = data.map((line)=>line.match(/(\d+)(u|d)(\d+)/).slice(1)) // extract groups from regex. Get : [group1, group2]
let data2 = Array.from(data);
data2.shift();
let increased = 0;
for(let i = 0;i< data2.length;i++) if(data2[i] > data[i]) increased++; // *A
console.log(increased);

let data3 = Array.from(data);
data3.shift();
data3.shift();
console.log(data3);
let threeSum = [];
console.log(data3.length);
for(let i = 0;i< data3.length;i++) {
    threeSum.push(data[i] + data2[i] + data3[i]); // *B
}

let threeSumShifted = Array.from(threeSum);
threeSumShifted.shift();
let increased2 = 0;

for(let i = 0;i< threeSumShifted.length;i++) if(threeSumShifted[i] > threeSum[i]) increased2++;
console.log(increased2);

/*
      -------Part 1--------   -------Part 2--------
Day       Time  Rank  Score       Time  Rank  Score
  1   00:03:37  1874      0   00:13:20  3449      0

To compare a measurement with the previous measurement I wanted to use zip()
but I didn't know if it existed in js. Instead I resorted to do a manual loop
which I knew would work (*A).

For the second part and the computation of a window of 3 I used to the same technique but with a third array. Two errors slowed me down.
1) In the loop that computed the three-measurement sliding window sums I didn't write the result to anything...
2) I did change the loop that computed the sliding window sum to write into an array...but I wrote to the wrong array. 
Instead of writing in the intended result array (threeSum) it wrote in one of the input array (data2).  Since I both looped over that array (data2.lebgth) and added elements to it => it created an infinite loop.
The similarily named variables (data, data2, data3) was a factor in the mistake I thing. 
It took me a while to find the bug because I didn't check that the loop worked and the result (threeSum) was right. 
Instead I finished the code. When I noticed the final result was wrong (the program crashed due to the infinite loop...) it took me a while to backtrack back to that loop which I thought was correct because I has fixed it earlier.

Lessons : 
- distinctive variable names, even when speed-coding.
- check fixes actually are correct.
- check intermediary steps before writing the rest of the algorithm.

*/