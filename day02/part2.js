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
      case "A X": // rock/lose => scissor
        return 3 + 0;
      case "A Y": // rock/draw => rock
        return 1 + 3;
      case "A Z": // rock/win => paper
        return 2 + 6;
      case "B X": // paper/lose => rock
        return 1 + 0;
      case "B Y": // paper/draw => paper
        return 2 + 3;
      case "B Z": // paper/win => scissor
        return 3 + 6;
      case "C X": // scissor/lose => paper
        return 2 + 0;
      case "C Y": // scissor/draw => scissor
        return 3 + 3;
      case "C Z": // scissor/win => rock
        return 1 + 6;
    }
  })
  .reduce((acc, score) => acc + score, 0);

/* end solution */

const execEnd = performance.now();
const micros = (execEnd - execStart) * 1000;
console.log(`${answer} (${micros.toFixed(2)} µs)`);
