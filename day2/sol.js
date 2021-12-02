"use strict";
const fs = require('fs')

let data = fs.readFileSync('input', 'utf8');
data = data.trim().split("\n");
// data = data.map(Number)
// data = data.map((line)=>line.match(/(-?\d)+/g)); // lines have multiple numbers. Get : [num1, num2]
data = data.map((line)=>line.match(/(\w+) (\d+)/).slice(1)) // extract groups from regex. Get : [group1, group2]
data = data.map(([a, b])=>[a, Number(b)])
let h = 0;
let d = 0;
// console.log(data);
for(let [move, amount] of data) {
    if(move == 'forward') {
        h+=amount;
    }else if(move == 'up') {
        d-=amount;
    }else { //down
        d+=amount;
    }
}
console.log(h*d); // part 1

let aim = 0;
h = 0;
d = 0;
for(let [move, amount] of data) {
    if(move == 'forward') {
        h += amount;
        d += aim * amount;
    }else if(move == 'up') {
        aim -= amount;
    }else { //down
        aim += amount;
    }
}
console.log(h*d);

/*
      --------Part 1--------   --------Part 2--------
Day       Time   Rank  Score       Time   Rank  Score
  2   01:18:01  17101      0   01:24:42  16365      0

I couldn't wake up at 6 to start today's challenge as it started.
Mistakes: 
- for..in instead of using for..of on an array
for(let [move, amount] in data) {   //error
for(let [move, amount] of data) {   //fix

- in the part 2, instead of increasing the depth by aim* amount, I replaced the depth
  d = aim * amount;     //error
  d += aim * amount;    //fix

*/