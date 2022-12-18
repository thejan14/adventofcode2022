const path = require("path");
const fs = require("fs");
let { performance } = require("perf_hooks");

const input = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");
const execStart = performance.now();

/* begin solution */

const reportRegex =
  /Valve ([A-Z]+) has flow rate=(\d+); tunnels? leads? to valves? (.*)/g;
const valveInfos = {};
for (const [, valve, rate, targetsLine] of input.matchAll(reportRegex)) {
  valveInfos[valve] = {
    rate: Number(rate),
    targets: Object.fromEntries(targetsLine.split(", ").map((v) => [v, 1])),
  };
}

for (const info of Object.values(valveInfos)) {
  for (const [next, costs] of Object.entries(info.targets)) {
    preCalcBestPaths(valveInfos[next].targets, costs, info.targets);
  }
}

const answer = calcBestTotalReleaseFrom("AA", 30, []);

function calcBestTotalReleaseFrom(current, time, open) {
  const possibleTargets = Object.entries(valveInfos[current].targets).filter(
    ([valve, costs]) =>
      !open.includes(valve) && costs < 29 && valveInfos[valve].rate > 0
  );

  let maxPressureReleased = 0;
  for (const [valve, costs] of possibleTargets) {
    const remainingTime = time - costs - 1; // one more minute (-1) for opening the valve
    if (remainingTime > 0) {
      let pressureReleased = remainingTime * valveInfos[valve].rate;
      pressureReleased += calcBestTotalReleaseFrom(
        valve,
        remainingTime,
        [...open, valve],
        pressureReleased
      );
      if (!maxPressureReleased || maxPressureReleased < pressureReleased) {
        maxPressureReleased = pressureReleased;
      }
    }
  }

  if (maxPressureReleased) {
    return maxPressureReleased;
  } else {
    return 0;
  }
}

function preCalcBestPaths(targets, currentCosts, origin) {
  for (const [next, nextCosts] of Object.entries(targets)) {
    const costs = currentCosts + nextCosts;
    if (!origin[next] || costs < origin[next]) {
      origin[next] = costs;
      preCalcBestPaths(valveInfos[next].targets, origin[next], origin);
    }
  }
}

/* end solution */

const execEnd = performance.now();
const micros = (execEnd - execStart) * 1000;
console.log(`${answer} (${micros.toFixed(2)} µs)`);
