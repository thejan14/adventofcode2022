const path = require("path");
const fs = require("fs");
let { performance } = require("perf_hooks");

const input = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");
const execStart = performance.now();

/* begin solution */

const directions = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
];

let end;
const heightMap = input.split("\n").map((line, x) =>
  line.split("").map((c, y) => {
    if (c === "S") {
      return 0;
    } else if (c === "E") {
      end = [x, y];
      return 25;
    } else {
      return c.charCodeAt() - 97;
    }
  })
);

let answer = Number.MAX_VALUE;
for (let x = 0; x < heightMap.length; x++) {
  for (let y = 0; y < heightMap.length; y++) {
    if (heightMap[x][y] === 0) {
      const steps = findShortestPath([x, y], end);
      if (steps < answer) {
        answer = steps;
      }
    }
  }
}

function findShortestPath([startX, startY], [targetX, targetY]) {
  // tracks where we want to visit next, lowest priority first
  let frontier = [{ pos: [startX, startY], prio: 0 }];
  const enqueue = (pos, prio) => {
    const index = frontier.findIndex((i) => i.prio > prio);
    if (index !== -1) {
      frontier.splice(index, 0, { pos, prio });
    } else {
      frontier.push({ pos, prio });
    }
  };

  // tracks where we came from moving to the position (best choice)
  const visitedFrom = Array.from(Array(heightMap.length), () =>
    Array(heightMap[0].length)
  );

  // tracks movements made up to the position
  const costs = Array.from(Array(heightMap.length), () =>
    Array(heightMap[0].length)
  );

  let pathExists = false;
  costs[startX][startY] = 0;
  search: while (frontier.length > 0) {
    const current = frontier.shift();
    const [x, y] = current.pos;
    for (const [i, j] of directions) {
      const a = x + i;
      const b = y + j;
      if (heightMap[a] !== undefined && heightMap[a][b] !== undefined) {
        const nextHeight = heightMap[a][b];
        const prevHeight = heightMap[x][y];
        const heightDiff = nextHeight - prevHeight;
        const prevCosts = costs[x][y];
        const nextCosts = prevCosts + 1;
        if (
          heightDiff < 2 &&
          (costs[a][b] === undefined || nextCosts < prevCosts)
        ) {
          if (a === targetX && b === targetY) {
            visitedFrom[a][b] = [x, y];
            pathExists = true;
            break search;
          } else {
            const priority = Math.abs(targetX - a) + Math.abs(targetY - a); // manhattan distance
            enqueue([a, b], priority);
            visitedFrom[a][b] = [x, y];
            costs[a][b] = nextCosts;
          }
        }
      }
    }
  }

  if (pathExists) {
    let steps = 0;
    let currentX = targetX;
    let currentY = targetY;
    do {
      [currentX, currentY] = visitedFrom[currentX][currentY];
      steps += 1;
    } while (currentX !== startX || currentY !== startY);

    return steps;
  } else {
    Number.MAX_VALUE;
  }
}

/* end solution */

const execEnd = performance.now();
const micros = (execEnd - execStart) * 1000;
console.log(`${answer} (${micros.toFixed(2)} µs)`);
