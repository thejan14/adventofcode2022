const path = require("path");
const fs = require("fs");
let { performance } = require("perf_hooks");

const input = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");
const execStart = performance.now();

/* begin solution */

const sumPerElf = input.split("\n\n").map((group) =>
  group
    .split("\n")
    .map((line) => Number(line))
    .reduce((acc, calories) => acc + calories, 0)
);

const answer = Math.max(...sumPerElf);

/* end solution */

const execEnd = performance.now();
const micros = (execEnd - execStart) * 1000;
console.log(`${answer} (${micros.toFixed(2)} µs)`);
