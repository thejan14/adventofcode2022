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

const relevantValves = Object.entries(valveInfos)
  .filter(([, info]) => info.rate > 0)
  .map(([valve]) => valve);

for (const info of Object.values(valveInfos)) {
  for (const [next, costs] of Object.entries(info.targets)) {
    preCalcBestPaths(valveInfos[next].targets, costs, info.targets);
  }
}

let answer = 0;
exploreCombinations(26, 0, 0, "AA", "AA", [], 0);

function exploreCombinations(
  remainingTime,
  timeToNextSanta,
  timeToNextElephant,
  nextSanta,
  nextElephant,
  open,
  total
) {
  if (timeToNextSanta === 0) {
    const release = remainingTime * valveInfos[nextSanta].rate;
    total += release;

    for (const valve of relevantValves.filter((v) => !open.includes(v))) {
      const costs = valveInfos[nextSanta].targets[valve] + 1;
      exploreCombinations(
        remainingTime,
        costs,
        timeToNextElephant,
        valve,
        nextElephant,
        [...open, valve],
        total
      );
    }
    timeToNextSanta = -1;
  }

  if (timeToNextElephant === 0) {
    const release = remainingTime * valveInfos[nextElephant].rate;
    total += release;
    for (const valve of relevantValves.filter((v) => !open.includes(v))) {
      const costs = valveInfos[nextElephant].targets[valve] + 1;
      exploreCombinations(
        remainingTime,
        timeToNextSanta,
        costs,
        nextSanta,
        valve,
        [...open, valve],
        total
      );
    }
    timeToNextElephant = -1;
  }

  if (remainingTime > 0) {
    return exploreCombinations(
      remainingTime - 1,
      timeToNextSanta - 1,
      timeToNextElephant - 1,
      nextSanta,
      nextElephant,
      open,
      total
    );
  }

  if (total > answer) {
    answer = total;
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
