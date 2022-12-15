const path = require("path");
const fs = require("fs");
let { performance } = require("perf_hooks");

const input = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");
const execStart = performance.now();

/* begin solution */

const beaconMin = 0;
const beaconMax = 4000000;
const reports = input
  .split("\n")
  .map((line) => line.match(/-?\d+/g))
  .map(([sx, sy, bx, by]) => [Number(sx), Number(sy), Number(bx), Number(by)])
  .map(([sx, sy, bx, by]) => {
    const distance = getManhattanDistance(sx, sy, bx, by);
    const report = {
      sensor: [sx, sy],
      range: distance,
      minX: sx - distance,
      maxX: sx + distance,
      minY: sy - distance,
      maxY: sy + distance,
    };

    return report;
  });

// check all position exactly one unit away from any sensors reach (i.e. their outline)
// if the position is not covered by any sensor this must be the distress beacons pos
let answer = 0;
search: for (const report of reports) {
  for (const [x, y] of sensorOutline(report)) {
    if (
      x >= beaconMin &&
      x <= beaconMax &&
      y >= beaconMin &&
      y <= beaconMax &&
      !reports.some((r) => isCoveredBySensor(r, x, y))
    ) {
      answer = x * 4000000 + y;
      break search;
    }
  }
}

function* sensorOutline(report) {
  const [sx, sy] = report.sensor;
  yield [report.minX - 1, sy];
  yield [report.maxX + 1, sy];
  yield [sx, report.minY - 1];
  yield [sx, report.maxY + 1];
  for (let x = report.minX; x <= report.maxX; x++) {
    const d = report.range - Math.abs(x - sx) + 1;
    yield [x, sy - d];
    yield [x, sy + d];
  }
}

function isCoveredBySensor(report, x, y) {
  const [sx, sy] = report.sensor;
  return getManhattanDistance(sx, sy, x, y) <= report.range;
}

function getManhattanDistance(x1, y1, x2, y2) {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

/* end solution */

const execEnd = performance.now();
const micros = (execEnd - execStart) * 1000;
console.log(`${answer} (${micros.toFixed(2)} µs)`);
