"use strict";
const fs = require('fs')

let data = fs.readFileSync('input', 'utf8');
data = data.trim().split("\n");
let numbers = data[0].split(',').map(Number);
// console.log(numbers);
// data = data.map(Number)
// data = data.map((line)=>line.match(/(-?\d)+/g)); // lines have multiple numbers. Get : [num1, num2]
// data = data.map((line)=>line.match(/(\d+)(u|d)(\d+)/).slice(1)) // extract groups from regex. Get : [group1, group2]
let boards = [];
data.shift();
data.shift();
function readBoard(data, boards){
    let board = [];
    for(let i = 0;i<5;i++){
        let line = data[0].match(/(-?\d)+/g);
        let lineNumber = line.map(Number);
        board.push(lineNumber);
        data.shift();
    }
    // console.log(board);
    return board;
}
while(data.length > 0){
    boards.push(readBoard(data, boards));
    data.shift();
}

function isWinningBoard(board, rowRemoved, columnRemoved){
    if(board[rowRemoved].every((item)=> item === null)){
        return true;
    }
    for(let rowCheck = 0 ; rowCheck < 5;rowCheck++){
        if(board[rowCheck][columnRemoved] !== null) return false;
    }
    return true;
}

outerLoop: for(var number of numbers){
    for(var board of boards){
        for(var row = 0; row < 5;row++){
            for(var column = 0; column < 5;column++){
                if(board[row][column] == number){
                    board[row][column] = null;
                    if(isWinningBoard(board, row, column)){
                        break outerLoop;
                    }
                    
                    
                }
            }
        }
    }
    console.log(numbers);
}
function sumBoard(board){
    let sum = 0;
    board.map((row) => {
        row.map((value) => {
            if(value !== null){
                sum+=value;
            }
        })
    })
    return sum;
}
console.log(board, sumBoard(board), sumBoard(board)*number)


let b = boards;
b;

/*
      --------Part 1--------   --------Part 2--------
Day       Time   Rank  Score       Time   Rank  Score
  4   00:44:32   4418      0   01:06:37   4942      0


*/