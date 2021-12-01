"use strict";
const fs = require('fs')
// in VS Code, cwd is not the directory of this script but a parent directory.
process.chdir(__dirname);
// fs.readFile('input', 'utf8', (err, data) => {    
//     console.log(err, data);
// });
let data = fs.readFileSync('input', 'utf8');
data = data.trim().split("\n");
data = data.map(Number)

function fuelRequired(mass) {
    return Math.max(0, Math.floor(mass/3) - 2);
}

let fuelPerModule = data.map(fuelRequired)
let result = fuelPerModule.reduce((a, b)=> a+b)

console.log(result);

function fuelRequiredTotal(mass){
    let fuelNeeded = fuelRequired(mass);
    if(fuelNeeded == 0) return fuelNeeded;
    return fuelNeeded + fuelRequiredTotal(fuelNeeded);
}

let fuelPerModuleTotal = data.map(fuelRequiredTotal);
let resultTotal = fuelPerModuleTotal.reduce((a, b)=> a+b)
console.log(resultTotal);