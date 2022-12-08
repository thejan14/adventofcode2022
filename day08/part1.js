const path = require("path");
const fs = require("fs");
let { performance } = require("perf_hooks");

const input = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");
const execStart = performance.now();

/* begin solution */

const treemap = input
  .split("\n")
  .map((line) => [...line].map((n) => ({ height: Number(n), visible: false })));

for (let row of treemap) {
  calcTreeVisibility(row);
  calcTreeVisibility([...row].reverse()); // make a shallow copy for .reverse()
}

for (let i = 1; i < treemap[0].length - 1; i++) {
  const column = treemap.map((row) => row[i]);
  calcTreeVisibility(column);
  calcTreeVisibility(column.reverse());
}

const answer = treemap.flatMap((row) => row).filter((t) => t.visible).length;

function calcTreeVisibility(treeLine) {
  treeLine[0].visible = true;
  let current = treeLine[0].height;
  for (let i = 1; i < treeLine.length - 1; i++) {
    if (treeLine[i].height > current) {
      treeLine[i].visible = true;
      current = treeLine[i].height;
    }
  }
}

/* end solution */

const execEnd = performance.now();
const micros = (execEnd - execStart) * 1000;
console.log(`${answer} (${micros.toFixed(2)} µs)`);
