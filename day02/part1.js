const path = require("path");
const fs = require("fs");
let { performance } = require("perf_hooks");

const input = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");
const execStart = performance.now();

/* begin solution */

const answer = input
  .split("\n")
  .map((line) => {
    switch (line) {
      case "A X": // rock/rock
        return 1 + 3;
      case "A Y": // rock/paper
        return 2 + 6;
      case "A Z": // rock/scissor
        return 3 + 0;
      case "B X": // paper/rock
        return 1 + 0;
      case "B Y": // paper/paper
        return 2 + 3;
      case "B Z": // paper/scissor
        return 3 + 6;
      case "C X": // scissor/rock
        return 1 + 6;
      case "C Y": // scissor/paper
        return 2 + 0;
      case "C Z": // scissor/scissor
        return 3 + 3;
    }
  })
  .reduce((acc, score) => acc + score, 0);

/* end solution */

const execEnd = performance.now();
const micros = (execEnd - execStart) * 1000;
console.log(`${answer} (${micros.toFixed(2)} µs)`);
