const path = require("path");
const fs = require("fs");
let { performance } = require("perf_hooks");

const input = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");
const execStart = performance.now();

/* begin solution */

const instructions = input.split("\n").map((line) => line.split(" "));

const screenPixels = Array.from({ length: 6 }, () =>
  Array.from({ length: 40 }, () => " ")
);

let cycles = 0;
let register = 1;
for (const [command, argument] of instructions) {
  let loops = 0;
  let registerDelta = 0;
  if (command === "noop") {
    loops = 1;
  } else {
    loops = 2;
    registerDelta = Number(argument);
  }

  for (let i = 0; i < loops; i++) {
    const screenCol = cycles % 40;
    const screenRow = Math.floor((cycles / 40) % 6);
    // check if sprite is at currently drawn pixel
    if (screenCol >= register - 1 && screenCol <= register + 1) {
      screenPixels[screenRow][screenCol] = "#";
    }

    cycles += 1;
  }

  register += registerDelta;
}

const screenStr = screenPixels.map((row) => row.join("")).join("\n");
const answer = `read:\n${screenStr}`;

/* end solution */

const execEnd = performance.now();
const micros = (execEnd - execStart) * 1000;
console.log(`${answer} (${micros.toFixed(2)} µs)`);
