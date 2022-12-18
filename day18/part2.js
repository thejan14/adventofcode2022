const path = require("path");
const fs = require("fs");
let { performance } = require("perf_hooks");

const input = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");
const execStart = performance.now();

/* begin solution */

// make sure that the data points are at least one away
// from the array bounds so that the flood fill algorithm
// can go all around, see *
let data = input
  .split("\n")
  .map((line) => line.split(",").map((n) => Number(n) + 1)); // (*)

const max = data.reduce(
  (max, curr) => {
    const [maxX, maxY, maxZ] = max;
    const [curX, curY, curZ] = curr;
    if (maxX < curX) {
      max[0] = curr[0];
    }
    if (maxY < curY) {
      max[1] = curr[1];
    }
    if (maxZ < curZ) {
      max[2] = curr[2];
    }
    return max;
  },
  [0, 0, 0]
);

const [maxX, maxY, maxZ] = max;
const scan = Array.from({ length: maxX + 2 }, () =>
  Array.from({ length: maxY + 2 }, () => Array(maxZ + 2).fill(undefined))
); // (*)

for (const [x, y, z] of data) {
  scan[x][y][z] = true;
}

// flood fill the space arount the droplet and count the surface hit
let totalSurface = 0;
const queue = [[0, 0, 0]];
while (queue.length > 0) {
  const [cx, cy, cz] = queue.pop();
  for (const [ax, ay, az] of getAdjacent(cx, cy, cz)) {
    if (isInBounds(scan, ax, ay, az)) {
      const state = scan[ax][ay][az];
      if (state === undefined) {
        scan[ax][ay][az] = false;
        queue.push([ax, ay, az]);
      } else if (state === true) {
        totalSurface += 1;
      }
      // state === false => already visited;
    }
  }
}

const answer = totalSurface;

function isInBounds(scan, x, y, z) {
  return (
    x > -1 &&
    x < scan.length &&
    y > -1 &&
    y < scan[x].length &&
    z > -1 &&
    z < scan[x][y].length
  );
}

function* getAdjacent(x, y, z) {
  yield [x - 1, y, z];
  yield [x + 1, y, z];
  yield [x, y - 1, z];
  yield [x, y + 1, z];
  yield [x, y, z - 1];
  yield [x, y, z + 1];
}

/* end solution */

const execEnd = performance.now();
const micros = (execEnd - execStart) * 1000;
console.log(`${answer} (${micros.toFixed(2)} µs)`);
