const path = require("path");
const fs = require("fs");
let { performance } = require("perf_hooks");

const input = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");
const execStart = performance.now();

/* begin solution */

let answer = 0;
const assignementPairs = input.matchAll(/(\d+)-(\d+),(\d+)-(\d+)/g);
for (const [, fromA, toA, fromB, toB] of assignementPairs) {
  if (+fromA <= +fromB && +toA >= +toB) {
    answer += 1; // a contains b
  } else if (+fromB <= +fromA && +toB >= +toA) {
    answer += 1; // b contains a
  }
}

/* end solution */

const execEnd = performance.now();
const micros = (execEnd - execStart) * 1000;
console.log(`${answer} (${micros.toFixed(2)} µs)`);
