"use strict";
const fs = require('fs')
process.chdir(__dirname); // work when launched from any current directory
let data = fs.readFileSync('input', 'utf8');
data = data.trim().split("\n");
// data = data.map(Number)
// data = data.map((line)=>line.match(/(-?\d)+/g)); // lines have multiple numbers. Get : [num1, num2]
// data = data.map((line)=>line.match(/(\d+)(u|d)(\d+)/).slice(1)) // extract groups from regex. Get : [group1, group2]
data = data.map(line=>{
    return line.split("").map(Number);
});
// data

function* lowPoints(data) {
    //data[y][x], (0,0) in top-left
    for(let y=0;y<data.length;y++){
        for(let x=0;x<data[0].length;x++){
            let value = data[y][x];
            if(y>0 && data[y-1][x]<=value) continue;
            if(y<data.length-1 && data[y+1][x]<=value) continue;
            if(x>0 && data[y][x-1]<=value) continue;
            if(x<data[0].length-1 && data[y][x+1]<=value) continue;
            yield [y, x];
        }
    }
}

function* lowPointsValues(data, points) {
    for(let [y, x] of points) {
        yield data[y][x]+1;
    }
}

let lowPointsIterable = lowPoints(data);
let lowPointsHeights = lowPointsValues(data, lowPointsIterable);
// part 1
console.log(Array.from(lowPointsHeights).reduce((x, y)=>x+y, 0));

// part 2
// for each low point use a BFS/DFS algorithm to find all points part of the basin
// => expand from the low point (until only 9s remain)
function getBasin(data, lowPoint) {
    function* neighborsPositions([y, x]) {
        if(y>0) yield [y-1, x];
        if(x<data[0].length-1) yield [y, x+1];
        if(y<data.length-1) yield [y+1, x];
        if(x>0) yield [y, x-1];
    }
    function* filterBasinPositions(iterator) {
        for(let [y, x] of iterator) {
            if(data[y][x]<9) yield [y, x];
        }
    }

    let visited = new Set(); // contains string representation of positions
    function addToVisited(position) {
        visited.add(String(position[0] + "," + position[1]));
    }
    function positionIsVisited(position) {
        return visited.has(String(position[0] + "," + position[1]));
    }
    function* filterNonVistedPosition(positions) {
        for(let position of positions) {
            if(!positionIsVisited(position)) yield position;
        }
    }
    let toVisit = [lowPoint];
    let basinSize = 0;

    while(toVisit.length>0){
        let currentPos = toVisit.shift();
        //should split into multiple lines
        for(let pos of filterNonVistedPosition(filterBasinPositions(neighborsPositions(currentPos)))) {
            addToVisited(pos);
            basinSize++;
            toVisit.push(pos);
        }
    }

    return basinSize;
}
let basins = Array.from(lowPoints(data)).map(point=>getBasin(data, point));
basins = basins.sort((a, b)=>b-a);
console.log(basins.slice(0, 3).reduce((x, y)=>x*y));
//310 too low

/*
Learned:

*/