const path = require("path");
const fs = require("fs");
let { performance } = require("perf_hooks");

const input = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");
const execStart = performance.now();

/* begin solution */

let answer = 0;
const markerSize = 14;
for (let i = markerSize; i < input.length; i++) {
  const buffer = new Set(input.substring(i - markerSize, i));
  if (buffer.size === markerSize) {
    answer = i;
    break;
  }
}

/* end solution */

const execEnd = performance.now();
const micros = (execEnd - execStart) * 1000;
console.log(`${answer} (${micros.toFixed(2)} µs)`);
