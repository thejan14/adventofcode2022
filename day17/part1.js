const path = require("path");
const fs = require("fs");
let { performance } = require("perf_hooks");

const input = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");
const execStart = performance.now();

/* begin solution */

const shapes = [
  [
    // "-" shape
    [0, 0],
    [1, 0],
    [2, 0],
    [3, 0],
  ],
  [
    // "+" shape
    [1, 0],
    [0, 1],
    [1, 1],
    [2, 1],
    [1, 2],
  ],
  [
    // "⅃" shape
    [2, 0],
    [2, 1],
    [0, 2],
    [1, 2],
    [2, 2],
  ],
  [
    // "|" shape
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
  ],
  [
    // "▄" shape
    [0, 0],
    [1, 0],
    [0, 1],
    [1, 1],
  ],
];

const jetPattern = input.split("").map((c) => (c === "<" ? -1 : 1));

// Chamber is a 2d boolean array where true is blocking and false is free
// (out of bounds is also blocking, i.e. wall). Initially the array contains
// nothing as new "space" is created when spawning rocks.
// Note that chamber[y][x] while y positive is up and x positive is right.
const width = 7;
const chamber = [];

let rocksAtRest = 0;
let jetTimer = 0;
while (rocksAtRest < 2022) {
  const rock = spawnRock(chamber, shapes[rocksAtRest % shapes.length]);
  let atRest = false;
  while (!atRest) {
    const push = jetPattern[jetTimer % jetPattern.length];

    if (
      rock.every(
        ([x, y]) => chamber[y][x + push] !== undefined && !chamber[y][x + push]
      )
    ) {
      moveRock(rock, push, 0);
    }

    if (rock.every(([x, y]) => y - 1 > -1 && !chamber[y - 1][x])) {
      moveRock(rock, 0, -1);
    } else {
      atRest = true;
    }

    jetTimer += 1;
  }

  for (const [x, y] of rock) {
    chamber[y][x] = true;
  }

  rocksAtRest++;
}

const answer = chamber.findIndex((row) => row.every((x) => !x));

function moveRock(rock, dx, dy) {
  for (const pos of rock) {
    pos[0] += dx;
    pos[1] += dy;
  }
}

function spawnRock(chamber, shape) {
  let highestSpot = chamber.findIndex((row) => row.every((x) => !x));
  if (highestSpot !== -1) {
    highestSpot -= 1;
  }

  const rockHeight = Math.max(...shape.map(([, y]) => y)) + 1;
  const spawnHeight = highestSpot + rockHeight + 3;
  const newRows = spawnHeight - chamber.length + 1;
  for (let i = 0; i < newRows; i++) {
    chamber.push(Array(width).fill(false));
  }

  return shape.map(([x, y]) => [x + 2, spawnHeight - y]);
}

/* end solution */

const execEnd = performance.now();
const micros = (execEnd - execStart) * 1000;
console.log(`${answer} (${micros.toFixed(2)} µs)`);
