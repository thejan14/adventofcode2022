const path = require("path");
const fs = require("fs");
let { performance } = require("perf_hooks");

const input = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");
const execStart = performance.now();

/* begin solution */

// https://jsbench.me/tblb7rvolp/1
const answer = input
  .match(/\w+\n\w+\n\w+/g)
  .map((group) => group.match(/(?<item>\w).*\n.*\k<item>.*\n.*\k<item>/)) // matches a character appearing in all three lines
  .map((match) => match.groups["item"])
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
