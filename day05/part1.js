const path = require("path");
const fs = require("fs");
let { performance } = require("perf_hooks");

const input = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");
const execStart = performance.now();

/* begin solution */

const [stackInput, instructionInput] = input.split("\n\n");

// parse stack drawing
const stacks = Array.from({ length: 9 }, () => []);
stackInput
  .split("\n")
  .slice(0, -1) // skip stack label line (last line)
  .forEach((line) => {
    // take every 4th character, starting at 1
    for (let i = 1; i < line.length; i += 4) {
      // whitespace figures empty space for given stack in the stack layer
      if (line[i] !== " ") {
        stacks[(i - 1) / 4].unshift(line[i]);
      }
    }
  });

// parse and apply instructions
for (const instruction of instructionInput.split("\n")) {
  const match = instruction.match(/move (\d+) from (\d+) to (\d+)/);
  const move = Number(match[1]);
  const from = Number(match[2]) - 1; // adjust for array index
  const to = Number(match[3]) - 1; // adjust for array index
  for (let n = 0; n < move; n++) {
    stacks[to].push(stacks[from].pop());
  }
}

const answer = stacks.map((s) => s.at(-1)).join("");

/* end solution */

const execEnd = performance.now();
const micros = (execEnd - execStart) * 1000;
console.log(`${answer} (${micros.toFixed(2)} µs)`);
