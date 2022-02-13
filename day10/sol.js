"use strict";
const fs = require('fs')
process.chdir(__dirname); // work when launched from any current directory
let data = fs.readFileSync('input', 'utf8');
data = data.trim().split("\n");
// data = data.map(Number)
// data = data.map((line)=>line.match(/(-?\d)+/g)); // lines have multiple numbers. Get : [num1, num2]
// data = data.map((line)=>line.match(/(\d+)(u|d)(\d+)/).slice(1)) // extract groups from regex. Get : [group1, group2]
// data
// console.log(data);

/**
 * Validate.
 * 
 * Does not check if chunk starts with an opening symbol.
 * 
 * @returns [erroneousSymbolOrNull, remainingSymbolsOrNull]
 */
function validate(line){
    const openingSymbols = "([{<";
    const closingSymbols = ")]}>";
    function mapClosingToOpening(c){
        return openingSymbols[closingSymbols.indexOf(c)];
    }
    function mapOpeningToClosing(c){
        return closingSymbols[openingSymbols.indexOf(c)];
    }
    const stack = [];
    for(let c of line){
        if(openingSymbols.includes(c)) stack.push(c);
        else if(closingSymbols.includes(c)){
            if(stack.pop() != mapClosingToOpening(c)) return [c, null];
        }else {
            throw new Error("Unexpected symbol " + c);
        }
    }
    return [null, stack.map(mapOpeningToClosing).reverse().join('')];
}

function part1(data){
    let score = 0;
    const scoring = {
        ")": 3,
        "]": 57,
        "}": 1197,
        ">":25137
    }

    for(let line of data){
        let [error,] = validate(line);
        if(error){
            score += scoring[error];
        }
    }
    console.log(score);
}
part1(data);

function part2(lines){
    let incompletes = lines.filter((line)=>validate(line)[0] == null);
    incompletes = incompletes.map((line)=>validate(line)[1]);

    function scoreIncomplete(incomplete){
        const scoring = {
            ")": 1,
            "]": 2,
            "}": 3,
            ">":4
        }
        let incompleteScore = 0;
        for(let c of incomplete){
            incompleteScore *= 5;
            incompleteScore += scoring[c];
        }
        return incompleteScore;
    }

    let score = incompletes.map(scoreIncomplete);
    score = score.sort((a, b)=>a-b);
    console.log(score[Math.floor(score.length/2)]);
}
part2(data);

/* Learned:
- can iterate on strings easily (for..of)
- lost time because I mixed-up charAt and indexOf
 */