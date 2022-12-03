const path = require("path");
const fs = require("fs");
let { performance } = require("perf_hooks");

const input = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");
const execStart = performance.now();

/* begin solution */

const answer = input
  .split("\n")
  .map((line) => [
    line.substring(0, line.length / 2),
    line.substring(line.length / 2, line.length),
  ])
  .map(
    ([compartmentA, compartmentB]) =>
      [...compartmentA].filter((item) => compartmentB.includes(item))[0]
  )
  .map((item) =>
    item === item.toUpperCase()
      ? item.charCodeAt(0) - 65 + 27
      : item.charCodeAt(0) - 97 + 1
  )
  .reduce((acc, priority) => acc + priority, 0);

/* end solution */

const execEnd = performance.now();
const micros = (execEnd - execStart) * 1000;
console.log(`${answer} (${micros.toFixed(2)} µs)`);
