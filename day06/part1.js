const path = require("path");
const fs = require("fs");
let { performance } = require("perf_hooks");

const input = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");
const execStart = performance.now();

/* begin solution */

// https://jsbench.me/lllbdo9l4y/1
let answer = 0;
const markerSize = 4;
for (let i = markerSize; i < input.length; i++) {
  const buffer = input.substring(i - markerSize, i);
  if (allCharsUnique(buffer)) {
    answer = i;
    break;
  }
}

function allCharsUnique(str) {
  for (let i = 0; i < str.length; i++) {
    if (str.indexOf(str[i]) !== i) {
      return false;
    }
  }

  return true;
}

/* end solution */

const execEnd = performance.now();
const micros = (execEnd - execStart) * 1000;
console.log(`${answer} (${micros.toFixed(2)} µs)`);
