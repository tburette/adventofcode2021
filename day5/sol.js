"use strict";
const fs = require('fs')

process.chdir(__dirname); // works when launched from any directory
let data = fs.readFileSync('input', 'utf8');
data = data.trim().split("\n");

data = data.map((line)=>line.match(/(-?\d)+/g)); // lines have multiple numbers. Get : [num1, num2]
// data = data.map((line)=>line.match(/(\d+)(u|d)(\d+)/).slice(1)) // extract groups from regex. Get : [group1, group2]
data = data.map((elems) => elems.map(Number));

// flyweight : same x, y will return same point object (=== true)
// allows use as key of map and in set
// big negative : memory leak
class Point {
    static #values = new Map();
    constructor(x, y) {
        if(x == undefined || y == undefined) {
            throw new TypeError(`Argument to Point is missing : Point(${x}, ${y})`);
        }
        let key = `${x},${y}`;
        let cachedPoint = Point.#values.get(key);
        if(! cachedPoint) {
            // only way I saw to make an object with read-only fields
            // that are visible when the object is debugged
            this.x = x;
            Object.defineProperty(this, "x", {writable: false})
            this.y = y;
            Object.defineProperty(this, "y", {writable: false})
            Point.#values.set(key, this);
        }
        return Point.#values.get(key);
    }
}

function* pointsBetween(x1, y1, x2, y2) {
    if(x1 == x2) {
        let [yFrom, yTo] = y1<y2 ? [y1, y2] : [y2, y1];
        for(let i = yFrom; i <= yTo;i++) {
            yield new Point(x1, i);
        }
    } else if( y1 == y2) {
        let [xFrom, xTo] = x1<x2 ? [x1, x2] : [x2, x1];
        for(let i = xFrom;i<=xTo;i++) {
            yield new Point(i, y1);
        }
    } else { // both x and y change
        let xDirection = x1<x2? 1: -1;
        let yDirection = y1<y2? 1: -1;
        let xi = x1 - xDirection;
        let yi = y1 - yDirection;
        do {
            xi += xDirection;
            yi += yDirection;
            yield new Point(xi, yi);
        }while(xi != x2 && yi != y2);
    }
}

function isHorizontalOrVertical(x1, y1, x2, y2) {
    return x1 == x2 || y1 == y2;
}

function* pointsInHorOrVertLines(data) {
    // coord is [x1, y1, x2, y2]
    for(let coord of data) {
        if(!isHorizontalOrVertical(...coord)) continue;
        for(let point of pointsBetween(...coord)) {
            yield point;
        }
    }
}

function numberOfDuplicatePoints(pointsIterable) {
    // position seen at least once
    let seen = new Set();
    // position seen multiple times
    let overlapping = new Set();

    for(let point of pointsIterable) {
        if(seen.has(point)) {
            overlapping.add(point);
        }
        else seen.add(point);
    }
    return overlapping.size;
}

console.log(numberOfDuplicatePoints(pointsInHorOrVertLines(data)));

function* pointsInLines(data) {
    for(let coord of data) {
        for(let point of pointsBetween(...coord)) {
            yield point;
        }
    }
}

console.log(numberOfDuplicatePoints(pointsInLines(data)));