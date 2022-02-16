"use strict";
const fs = require('fs')
process.chdir(__dirname); // work when launched from any current directory
let data = fs.readFileSync('input', 'utf8');
data = data.trim().split("\n");
// data = data.map(Number)
// data = data.map((line)=>line.match(/(-?\d)+/g)); // lines have multiple numbers. Get : [num1, num2]
// data = data.map((line)=>line.match(/(\d+)(u|d)(\d+)/).slice(1)) // extract groups from regex. Get : [group1, group2]
data = data.map((line)=>line.match(/\d/g).map(Number));
data
// console.log(data);


/**
 * look for all octopus that just flashed : increase neighbor
 * 
 * @returns [flashes, newData] newData is a modification of the input!
 */
function handleJustFlashedOctopus(data) {
    let flashes = 0;
    let ROW_COUNT = data.length;
    let COLUMN_COUNT = data[0].length; //assumes non empty
    let flashedList = new Set();
    function addToFlashed(row, column){
        flashedList.add(`${row},${column}`);
    }
    function alreadyFlashed(row, column){
        return flashedList.has(`${row},${column}`);
    }
    do{
        //detect octopus that just flashed
        let justFlashed = [];
        for(let row = 0; row<ROW_COUNT;row++){
            for(let column = 0; column < COLUMN_COUNT;column++){
                if(data[row][column]>9 && !alreadyFlashed(row, column)){
                    justFlashed.push([row, column]);
                } 
            }
        }
        //var so that the variable is accessible in the loop condition
        var flashedThisLoop = justFlashed.length;
        flashes += flashedThisLoop;
        while(justFlashed.length) {
            let [row, column] = justFlashed.shift();
            addToFlashed(row, column);
            // increase energy level of adjacants
            //previous row:
            if(row>0){
                if(column>0)data[row-1][column-1]++;
                data[row-1][column]++;
                if(column<COLUMN_COUNT-1)data[row-1][column+1]++;
            }
            //current row:
            if(column>0) data[row][column-1]++;
            if(column<COLUMN_COUNT-1)data[row][column+1]++;
            //next row:
            if(row<ROW_COUNT-1){
                if(column>0) data[row+1][column-1]++;
                data[row+1][column]++;
                if(column<COLUMN_COUNT-1)data[row+1][column+1]++;
            }
            // increase the current octopus even though it is not 
            // in the algorithm : prevents flashing multiple times
            data[row][column]++;
        }
    }while(flashedThisLoop);
    return [flashes, data];
}

/**
 * 
 * @param {*} data 
 * @returns [flashes, newData]
 */
function step(data) {
    let flashes = 0;
    // increase energy level of each octopus by 1
    data = data.map(line=>{
        return line.map(octopus=>{
            // if(octopus==9) flashes++;
            return octopus+1;
        });
    });

    //check if flashes occured and increase neighbors
    // do {
        var [newFlashes, data] = handleJustFlashedOctopus(data);
        flashes += newFlashes
    // } while(newFlashes>0);

    // set level 0 for all octopus that flashed
    data = data.map(line=>{
        return line.map(octopus=>octopus>9?0:octopus);
    });

    return [flashes, data];
}

function simulate(data, steps=100) {
    let flashes = 0;
    for(var i = 1;i<=steps;i++) {
        var [stepFlashes, data] = step(data);
        flashes += stepFlashes;
    }
    return flashes;
}

// step 1
// console.log(simulate(data))

function allFlashed(data) {
    return data.every(line=>{
        return line.every(octopus=>octopus==0);
    })
}

function whenDoesItSynchronize(data) {
    let step = 0;
    do{
        var [_, data] = step(data);
        step++;
        console.log(data);
    }while(!allFlashed(data));
    return step;
}
//step 2
console.log(whenDoesItSynchronize(data));


/**
 * Learned:
 * - step 1 : my initial algorithm didn't account properly for the possibility
 *   that an octopus can increase bu multiple value in one step because
 *   multiple neighbors flashed. 
 *   It took me quite a while to find the bug using the debugger.
 *   45 minutes (minus ~10 minutes of goofing-off) !
 *   Fixed by using a flashed set instead of looking for octopus with value==10
 * - step 2 : smooth sailing. Just a small bug :
 *   used the variable step twice : once for iteration count the other for
 *   the function name.
 */