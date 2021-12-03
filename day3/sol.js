"use strict";
const fs = require('fs')

let data = fs.readFileSync('input', 'utf8');
data = data.trim().split("\n");
data = data.map((line) =>Array.from(line));
// data = data.map((line)=>line.match(/(-?\d)+/g)); // lines have multiple numbers. Get : [num1, num2]
// data = data.map((line)=>line.match(/(\d+)(u|d)(\d+)/).slice(1)) // extract groups from regex. Get : [group1, group2]
//part 1
// let bitCount = new Array(data[0].length).fill(0);
// // bitCount;
// for(let number of data){
//     number.forEach((item, index)=>{
//         bitCount[index]+= item == '1';
//     });
// }
// // bitCount;
// let gammaRateArray = bitCount.map((count)=>String(Number(count>(data.length/2))));
// let epsilonRateArray = gammaRateArray.map((bit) => bit == '0' ? '1' : '0');
// // gammaRateArray;
// // epsilonRateArray;
// let gammaRate = Number.parseInt(gammaRateArray.join(''), 2);
// // gammaRate;
// let epsilonRate = Number.parseInt(epsilonRateArray.join(''), 2);
// // epsilonRate

// console.log(gammaRate * epsilonRate); // part 1

//part 2
let oxygenData = data.slice(); //shallow copy
let oxigenArray = [];
let currentOxygenIndex = 0;
// oxigenData;
function mostCommonBit(array, index){
    return array.reduce((acc, line)=>{
        acc[Number(line[index]=='1')]++;
        return acc;
    }, [0, 0]);
}

function filterData(array, index, valueToRemove){
    return array.filter((value) => value[index] == valueToRemove)
}

while(oxygenData.length > 1){
    let [zeroesCount, onesCount] = mostCommonBit(oxygenData, currentOxygenIndex);
    let valueToRemove = zeroesCount > onesCount? '1': '0';
    oxygenData = filterData(oxygenData, currentOxygenIndex, valueToRemove);
    oxygenData;
    currentOxygenIndex++;
    // break;
}
let oxygenRating = Number.parseInt(oxygenData[0].join(''), 2);
oxygenRating;

//copy/paste from oxygen code
let co2Data = data.slice(); //shallow copy
let co2Array = [];
let currentCo2Index = 0;
while(co2Data.length > 1){
    let [zeroesCount, onesCount] = mostCommonBit(co2Data, currentCo2Index);
    let valueToRemove = zeroesCount > onesCount? '0': '1';
    co2Data = filterData(co2Data, currentCo2Index, valueToRemove);
    co2Data;
    currentCo2Index++;
    // break;
}
let co2Rating = Number.parseInt(co2Data[0].join(''), 2);
co2Rating;

console.log(oxygenRating * co2Rating);