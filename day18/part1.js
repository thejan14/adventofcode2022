const path = require("path");
const fs = require("fs");
let { performance } = require("perf_hooks");

const input = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");
const execStart = performance.now();

/* begin solution */

let data = input
  .split("\n")
  .map((line) => line.split(",").map((n) => Number(n)));

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
const scan = Array.from({ length: maxX + 1 }, () =>
  Array.from({ length: maxY + 1 }, () => Array(maxZ + 1).fill(false))
);

for (const [x, y, z] of data) {
  scan[x][y][z] = true;
}

let totalSurface = 0;
for (const pos of data) {
  let exposed = 6;
  for (const blocking of getAdjacent(scan, pos)) {
    if (blocking) {
      exposed -= 1;
    }
  }

  totalSurface += exposed;
}

const answer = totalSurface;

function* getAdjacent(scan, [x, y, z]) {
  if (x - 1 > -1) {
    yield scan[x - 1][y][z];
  }
  if (x + 1 < scan.length) {
    yield scan[x + 1][y][z];
  }
  if (y - 1 > -1) {
    yield scan[x][y - 1][z];
  }
  if (y + 1 < scan[x].length) {
    yield scan[x][y + 1][z];
  }
  if (z - 1 > -1) {
    yield scan[x][y][z - 1];
  }
  if (z + 1 < scan[x][y].length) {
    yield scan[x][y][z + 1];
  }
}

/* end solution */

const execEnd = performance.now();
const micros = (execEnd - execStart) * 1000;
console.log(`${answer} (${micros.toFixed(2)} µs)`);
