"use strict";
const fs = require('fs')
process.chdir(__dirname); // work when launched from any current directory
let data = fs.readFileSync('input', 'utf8');
data = data.trim().split("\n\n");
let dots = data[0];
let folds = data[1]
// data = data.map(Number)
dots = dots.split("\n").map((line)=>line.match(/(-?\d)+/g).map(Number)); // lines have multiple numbers. Get : [num1, num2]
// data = data.map((line)=>line.match(/(\d+)(u|d)(\d+)/).slice(1)) // extract groups from regex. Get : [group1, group2]
// data
folds = folds.split("\n").map(line=>line.match(/\w+/g).slice(-2));
folds = folds.map(([axis, value])=>[axis, Number(value)]);


/**
 * Returns a function that tells wheter the given dot is in dots
 */
function buildDotSetDetector(dots){
    let set = new Set();
    for(let dot of dots){
        set.add(dot.join());
    }

    return function(dot){
        return set.has(dot.join())
    }
}


function foldHorizontally(dots, foldPosition){
    let detector = buildDotSetDetector(dots);
    // y = y - (2*distnce from line)
    return dots.map(([x, y])=>{
        // what if dot ON the line??
        if(y == foldPosition) debugger;

        if(y<foldPosition) return [x, y]
        let foldedDot = [x, y - (2*(y-foldPosition))]
        if(!detector(foldedDot)) return foldedDot;
        return undefined;
    }).filter(Boolean);
}

// could probably merge foldHorizontally and foldVertically
function foldVertically(dots, foldPosition){
    let detector = buildDotSetDetector(dots);
    // y = y - (2*distnce from line)
    return dots.map(([x, y])=>{
        // what if dot ON the line??
        if(x == foldPosition) debugger;

        if(x<foldPosition) return [x, y]
        let foldedDot = [x - 2*(x-foldPosition), y]
        if(!detector(foldedDot)) return foldedDot;
        return undefined;
    }).filter(Boolean);
}


function fold(dots, direction, position){
    if(direction == "y") return foldHorizontally(dots, position);
    return foldVertically(dots, position);
}

function sortDots(dots){
    return dots.sort(([x1, y1], [x2, y2])=>{
        if(x1 == x2) return y1-y2;
        return x1-x2
    });
}

function sortDots(dots){
    return Array.from(dots).sort(([x1, y1], [x2, y2])=>{
        if(y1 == y2) return x1-x2;
        return y1-y2;
    });
}

let dotsAfterFirstFold = fold(dots, ...folds[0]);
let dotsAfterSecondFold = fold(dotsAfterFirstFold, ...folds[1]);

// console.log(dotsAfterFirstFold.length);
//866 too high

//part2
let folded = folds.reduce((dots, foldInstruction)=>{
    return fold(dots, ...foldInstruction);
}, dots);


function groupByRows(dots){
    let sortedDots = sortDots(dots)
    let maxX = Math.max(...sortedDots.map(([x, y])=>x));
    // console.log(sortedDots);
    // for in on rows will be in numeric order
    let rows = {};
    for(let [x, y] of sortedDots){
        if(!(y in rows)) rows[y] = new Array(maxX+1).fill(' ');
        rows[y][x] = "x";
    }

    return rows;
}

function printDots(dots) {
    let groupedDots = groupByRows(dots);
    // console.log(groupedDots);
    for(let row in groupedDots){
        console.log(groupedDots[row].join(""));
    }
}

printDots(folded);


/**
 * - Math error in fold computation : foldPosition-x instead of x-foldPosition
 * - wanted a sorted copy of an array.
 *   Used array.sort instead of Array.from(array).sort
 * - used for..in instead of for..off
 */