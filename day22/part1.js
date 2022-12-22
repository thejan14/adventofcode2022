const path = require("path");
const fs = require("fs");
let { performance } = require("perf_hooks");

const input = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");
const execStart = performance.now();

/* begin solution */

const [mapInput, [instructions]] = input
  .split("\n\n")
  .map((block) => block.split("\n"));

const mapWidth = Math.max(...mapInput.map((line) => line.length));
const mapHeight = mapInput.length;
const map = Array.from({ length: mapHeight }, () => Array(mapWidth).fill());
for (let i = 0; i < map.length; i++) {
  const line = mapInput[i];
  for (let j = 0; j < line.length; j++) {
    if (line[j] !== " ") {
      map[i][j] = line[j] === "#";
    }
  }
}

let facing = 0; // 0 right, 1 down, 2 left, 3 up
let player = [0, map[0].indexOf(false)];
for (const instruction of instructions.match(/\d+|[RL]/g)) {
  if (instruction === "R") {
    facing = mod(facing + 1, 4);
  } else if (instruction === "L") {
    facing = mod(facing - 1, 4);
  } else {
    move(player, Number(instruction), facing);
  }
}

const rowScore = (player[0] + 1) * 1000;
const columnScore = (player[1] + 1) * 4;
const answer = rowScore + columnScore + facing;

function move(player, amount, facing) {
  const steps = [[...player]];
  if (facing === 0 || facing === 2) {
    let step = facing === 0 ? 1 : -1;
    let [playerY, currentX] = player;
    const rightEdge = map[playerY].findLastIndex((tile) => tile !== undefined);
    const leftEdge = map[playerY].findIndex((tile) => tile !== undefined);
    for (let i = 0; i < amount; i++) {
      let nextX = currentX + step;

      // wrap
      if (nextX > rightEdge) {
        nextX = leftEdge;
      } else if (nextX < leftEdge) {
        nextX = rightEdge;
      }

      // check
      if (map[playerY][nextX]) {
        break;
      }

      currentX = nextX;
      steps.push([playerY, currentX]);
    }

    player[1] = currentX;
    steps.push([playerY, currentX]);
  } else {
    let step = facing === 3 ? -1 : 1;
    let [currentY, playerX] = player;
    const upperEdge = map
      .map((row) => row[playerX])
      .findIndex((tile) => tile !== undefined);
    const lowerEdge = map
      .map((row) => row[playerX])
      .findLastIndex((tile) => tile !== undefined);
    for (let i = 0; i < amount; i++) {
      let nextY = currentY + step;

      // wrap
      if (nextY > lowerEdge) {
        nextY = upperEdge;
      } else if (nextY < upperEdge) {
        nextY = lowerEdge;
      }

      // check
      if (map[nextY][playerX]) {
        break;
      }

      currentY = nextY;
      steps.push([currentY, playerX]);
    }

    player[0] = currentY;
    steps.push([currentY, playerX]);
  }

  return steps;
}

function mod(n, m) {
  return ((n % m) + m) % m;
}

/* end solution */

const execEnd = performance.now();
const micros = (execEnd - execStart) * 1000;
console.log(`${answer} (${micros.toFixed(2)} µs)`);
