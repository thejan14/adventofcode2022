const path = require("path");
const fs = require("fs");
let { performance } = require("perf_hooks");

const input = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");
const execStart = performance.now();

/* begin solution */

const instructions = input
  .split("\n")
  .map((line) => line.match(/([URDL]) (\d+)/));

const visited = new Set();
const rope = Array.from({ length: 10 }, () => [0, 0]); // rope[0] is head
for (const [, direction, distance] of instructions) {
  let step;
  let axis;
  let goal;
  if (direction === "U" || direction === "D") {
    step = direction === "U" ? 1 : -1;
    axis = 1; // x
    goal = rope[0][axis] + Number(distance) * step;
  } else {
    step = direction === "R" ? 1 : -1;
    axis = 0; // y
    goal = rope[0][axis] + Number(distance) * step;
  }

  while (rope[0][axis] !== goal) {
    rope[0][axis] += step;
    for (let i = 1; i < rope.length; i++) {
      moveTail(rope[i - 1], rope[i]);
    }
    visited.add(`${rope.at(-1)}`);
  }
}

const answer = visited.size;

function moveTail(head, tail) {
  const delta = [head[0] - tail[0], head[1] - tail[1]];
  if (Math.abs(delta[0]) < 2 && Math.abs(delta[1]) < 2) {
    return;
  } else {
    tail[0] += Math.sign(delta[0]);
    tail[1] += Math.sign(delta[1]);
  }
}

/* end solution */

const execEnd = performance.now();
const micros = (execEnd - execStart) * 1000;
console.log(`${answer} (${micros.toFixed(2)} µs)`);
