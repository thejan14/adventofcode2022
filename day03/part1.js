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
  .map((item) => getItemPriority(item))
  .reduce((acc, priority) => acc + priority, 0);

function getItemPriority(item) {
  if (item === item.toUpperCase()) {
    return item.charCodeAt(0) - 65 + 27;
  } else {
    return item.charCodeAt(0) - 97 + 1;
  }
}

/* end solution */

const execEnd = performance.now();
const micros = (execEnd - execStart) * 1000;
console.log(`${answer} (${micros.toFixed(2)} µs)`);
