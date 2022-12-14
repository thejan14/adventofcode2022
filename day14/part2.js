const path = require("path");
const fs = require("fs");
let { performance } = require("perf_hooks");

const input = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");
const execStart = performance.now();

/* begin solution */

const sandOriginX = 500;
const sandOriginY = 0;
const paths = input
  .split("\n")
  .map((line) =>
    line.split(" -> ").map((pos) => pos.split(",").map((n) => Number(n)))
  );

let minX = sandOriginX;
let maxX = sandOriginX;
let minY = sandOriginY;
let maxY = sandOriginY;
paths
  .flatMap((p) => p)
  .forEach(([x, y]) => {
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  });

// at maxY + 2 there is the virtual bottom,
// does not need to be accounted for in the writable array
maxY += 1;

// sand pile cannot get wider than its high
minX = Math.min(sandOriginX - maxY, minX);
maxX = Math.max(sandOriginX + maxY, maxX);

const width = maxX - minX + 1;
const height = maxY - minY + 1;

// map of the cave - false is non blocking (air) and true is blocking (rock/sand)
// note that map[y][x] (as y is down and x is right)
const map = Array.from({ length: height }, () =>
  Array.from({ length: width }, () => false)
);

// construct rock paths on map
for (const path of paths) {
  const [px, py] = path[0];
  let [lastX, lastY] = [px - minX, py - minY];
  for (let i = 1; i < path.length; i++) {
    const [pnx, pny] = path[i];
    const [nextX, nextY] = [pnx - minX, pny - minY];
    const stepX = Math.sign(nextX - lastX);
    const stepY = Math.sign(nextY - lastY);

    for (let x = lastX; x !== nextX + stepX; x += stepX) {
      map[lastY][x] = true;
    }

    for (let y = lastY; y !== nextY + stepY; y += stepY) {
      map[y][lastX] = true;
    }

    [lastX, lastY] = [nextX, nextY];
  }
}

let answer = 0; // number of sands that came to rest
const adjSandOrigin = [sandOriginX - minX, sandOriginY - minY];

// simulate sand pouring
let final = false;
const posDeltas = [
  [0, 1], // down
  [-1, 1], // down left
  [1, 1], // down right
];
while (!final) {
  [sandX, sandY] = adjSandOrigin;
  let resting = false;
  while (!resting) {
    let i = 0;
    let moved = false;
    let next = posDeltas[i];
    while (next) {
      const [dx, dy] = next;
      const [newX, newY] = [sandX + dx, sandY + dy];
      const blocking = checkBlocking(newX, newY);
      if (blocking) {
        next = posDeltas[++i];
      } else {
        sandX = newX;
        sandY = newY;
        moved = true;
        next = undefined;
      }
    }

    if (!moved && !final) {
      if (map[sandY][sandX]) {
        final = true;
      } else {
        answer += 1;
        map[sandY][sandX] = true;
      }

      resting = true;
    }
  }
}

function checkBlocking(x, y) {
  if (y === height) {
    return true;
  } else {
    return map[y][x];
  }
}

/* end solution */

const execEnd = performance.now();
const micros = (execEnd - execStart) * 1000;
console.log(`${answer} (${micros.toFixed(2)} µs)`);
