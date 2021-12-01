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
// data = data.map(Number)
// data = data.map((line)=>line.match(/(-?\d)+/g)); // lines have multiple numbers. Get : [num1, num2]
// data = data.map((line)=>line.match(/(\d+)(u|d)(\d+)/).slice(1)) // extract groups from regex. Get : [group1, group2]
data
console.log(data);