const path = require("path");
const fs = require("fs");
let { performance } = require("perf_hooks");

const input = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");
const execStart = performance.now();

/* begin solution */

const instructions = input.split("\n").map((line) => line.split(" "));

let signalStrengths = 0;
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
    cycles += 1;
    if ((cycles - 20) % 40 === 0) {
      signalStrengths += cycles * register;
    }
  }

  register += registerDelta;
}

const answer = signalStrengths;

/* end solution */

const execEnd = performance.now();
const micros = (execEnd - execStart) * 1000;
console.log(`${answer} (${micros.toFixed(2)} µs)`);
