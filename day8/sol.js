"use strict";
const fs = require('fs')
process.chdir(__dirname); // work when launched from any current directory
let data = fs.readFileSync('input', 'utf8');
data = data.trim().split("\n");
// data = data.map(Number)
// data = data.map((line)=>line.match(/(-?\d)+/g)); // lines have multiple numbers. Get : [num1, num2]
// data = data.map((line)=>line.match(/(\d+)(u|d)(\d+)/).slice(1)) // extract groups from regex. Get : [group1, group2]
data = data.map((line) => line.split('|'));
data = data.map((line) => line.map((group)=>group.match(/\w+/g)));

let outputs = data.reduce((arr, line)=>arr.concat(line[1]), []);
let searchedLengths = new Set([2, 4, 3, 7]);
let result = outputs.filter(value => searchedLengths.has(value.length)).length;
console.log(result);


function difference(setB) {
    let _difference = new Set(this)
    for (let elem of setB) {
        _difference.delete(elem)
    }
    return _difference;
}
Set.prototype.difference = difference;

function intersection(setB) {
    let _intersection = new Set()
    for (let elem of setB) {
        if (this.has(elem)) {
            _intersection.add(elem)
        }
    }
    return _intersection
}
Set.prototype.intersection = intersection;

Set.prototype.any = function() {return this.values().next().value};

/**
 * Convert a list of segments into a segment Map.
 * 
 * Segment map : {2: [Set()], ..., 5: [Set(), Set(), Set()],...}
 * key : number of segments
 * value: list of Set of letters
 * 
 * @param {Array} list of segments represented as string
 * @returns {Object} a segment map
 */
function segmentsToMap(segments) {
    let segmentMap = {};
    for(let segment of segments) {
        if(!(segment.length in segmentMap)) segmentMap[segment.length] = [];
        segmentMap[segment.length].push(new Set(segment));
    }
    return segmentMap;
}

let displays = data.map(([input, output]) => [segmentsToMap(input), output]);
let sum = 0;
for(let [input, output] of displays) {
    let a = input[3][0].difference(input[2][0]).any();
    let abfg = input[6].reduce((a, b)=>a.intersection(b));
    let c = input[2][0].difference(abfg).any();
    
    let f = input[2][0].difference(new Set([c])).any();
    
    let d = input[4][0].difference(new Set([c])).difference(abfg).any();
    
    let b = input[4][0].difference(new Set([c, d, f])).any();
    
    let adg = input[5].reduce((a, b)=>a.intersection(b));
    let g =  adg.difference(new Set([a, d])).any();
    
    let e = input[7][0].difference(new Set([a, b, c, d, f, g])).any();
    const zip = (a, b) => a.map((k, i) => [k, b[i]]);
    //a, b, c, d, e, f, g
    function decoder_maker(...values){
        let map = {};
        for(let [wireLetter, letter] of zip(values, "abcdefg".split(""))) {
            map[wireLetter] = letter;
        }
        function decoder(coded) {
            return Array.from(coded).map(char=>map[char]).join("");
        }
        return decoder;
    }

    function segmentsToNumber(segments) {
        return ["abcefg", "cf", "acdeg", "acdfg", "bcdf", "abdfg", "abdefg", "acf", "abcdefg", "abcdfg"].indexOf(segments.split("").sort().join(""));
    }
    
    let decoder = decoder_maker(a, b, c, d, e, f, g);
    console.log(output)
    let value = +output.map(decoder).map(segmentsToNumber).map(String).join("");
    console.log(value);
    sum+=value;
}
console.log(sum);



//unique nb of segments:
// 1 2 seg OK
// 7 3 seg OK
// 4 4 seg  OK
// 8 7 seg

// 2 5 seg
// 3 5 seg
// 5 5 seg

// 0 6 seg
// 6 6 seg
// 9 6 seg


//a = 7-1
//c = 1-f
//f = 1-(0&6&9)
//d = 4-c-abfg
//b = 4-cdf
//g = adg-ad

/*
Learned:
- js has no built-in set operations : intersection, difference,...
- The fact that set iterate in the insertion order is useful
  list => set => list : elements keep their order!
- I focused on finding a way to decode each segment individually
  would have been faster to figure out what a number is by comparing with others
  (1 is contained in 7, 5 is contained in 6,..)
*/