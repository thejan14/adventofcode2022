const path = require("path");
const fs = require("fs");
let { performance } = require("perf_hooks");

const input = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");
const execStart = performance.now();

/* begin solution */

const treemap = input
  .split("\n")
  .map((line) => [...line].map((n) => ({ height: Number(n), score: 0 })));

for (let i = 0; i < treemap.length; i++) {
  for (let j = 0; j < treemap.length; j++) {
    treemap[i][j].score = calcTreeScore(j, i);
  }
}

const answer = Math.max(...treemap.flatMap((row) => row).map((t) => t.score));

// x is horizontal and y is vertical. (0,0) is top left.
function calcTreeScore(x, y) {
  const right = treemap[y].filter((_, i) => i > x);
  const down = treemap.map((row) => row[x]).filter((_, j) => j > y);
  const left = treemap[y].filter((_, i) => i < x).reverse();
  const up = treemap
    .map((row) => row[x])
    .filter((_, j) => j < y)
    .reverse();
  return (
    countTreesInView(x, y, up) *
    countTreesInView(x, y, right) *
    countTreesInView(x, y, down) *
    countTreesInView(x, y, left)
  );
}

function countTreesInView(x, y, treeLine) {
  const origin = treemap[y][x];
  const blocker = treeLine.findIndex((t) => t.height >= origin.height);
  if (blocker === -1) {
    return treeLine.length;
  } else {
    return blocker + 1;
  }
}

/* end solution */

const execEnd = performance.now();
const micros = (execEnd - execStart) * 1000;
console.log(`${answer} (${micros.toFixed(2)} µs)`);
