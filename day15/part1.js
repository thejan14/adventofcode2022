const path = require("path");
const fs = require("fs");
let { performance } = require("perf_hooks");

const input = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");
const execStart = performance.now();

/* begin solution */

const targetY = 2000000;
const reports = input
  .split("\n")
  .map((line) => line.match(/-?\d+/g))
  .map(([sx, sy, bx, by]) => [Number(sx), Number(sy), Number(bx), Number(by)])
  .map(([sx, sy, bx, by]) => {
    const distance = getManhattanDistance(sx, sy, bx, by);
    const dy = Math.abs(targetY - sy); // distance to the target row
    const report = {
      sensor: [sx, sy],
      beacon: [bx, by],
      distance: distance,
    };

    if (Math.abs(dy) <= distance) {
      report.minX = sx - (distance - dy); // min x covered by scanner on target row
      report.maxX = sx + (distance - dy); // max x covered by scanner on target row
    }

    return report;
  });

const relevantReports = reports.filter((r) => r.minX);
const targetMinX = Math.min(...relevantReports.map((r) => r.minX));
const targetMaxX = Math.max(...relevantReports.map((r) => r.maxX));

const range = targetMaxX - targetMinX + 1;
const targetRow = Array(range).fill(false); // false for unoccupied
for (const report of relevantReports) {
  const [sx, sy] = report.sensor;
  if (sy === targetY) {
    targetRow[sx - targetMinX] = true;
  }

  const [bx, by] = report.beacon;
  if (by === targetY) {
    targetRow[bx - targetMinX] = true;
  }
}

const answer = targetRow.filter((occupied) => !occupied).length;

function getManhattanDistance(x1, y1, x2, y2) {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

/* end solution */

const execEnd = performance.now();
const micros = (execEnd - execStart) * 1000;
console.log(`${answer} (${micros.toFixed(2)} µs)`);
