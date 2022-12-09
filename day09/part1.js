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
const head = [0, 0];
const tail = [0, 0];
for (const [_, direction, distance] of instructions) {
  let step;
  let axis;
  let goal;
  if (direction === "U" || direction === "D") {
    step = direction === "U" ? 1 : -1;
    axis = 1; // x
    goal = head[axis] + Number(distance) * step;
  } else {
    step = direction === "R" ? 1 : -1;
    axis = 0; // y
    goal = head[axis] + Number(distance) * step;
  }

  while (head[axis] !== goal) {
    head[axis] += step;
    movetail(head, tail, axis);
    visited.add(`${tail}`);
  }
}

function movetail(head, tail, axis) {
  if (head[axis] > tail[axis] + 1) {
    tail[(axis + 1) % 2] = head[(axis + 1) % 2];
    tail[axis] = head[axis] - 1;
  }
  if (head[axis] < tail[axis] - 1) {
    tail[(axis + 1) % 2] = head[(axis + 1) % 2];
    tail[axis] = head[axis] + 1;
  }
}

const answer = visited.size;

/* end solution */

const execEnd = performance.now();
const micros = (execEnd - execStart) * 1000;
console.log(`${answer} (${micros.toFixed(2)} µs)`);
