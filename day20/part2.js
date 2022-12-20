const path = require("path");
const fs = require("fs");
let { performance } = require("perf_hooks");

const input = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");
const execStart = performance.now();

/* begin solution */

const file = input
  .split("\n")
  .map((n, i) => ({ value: Number(n) * 811589153, order: i }));

for (let mix = 0; mix < 10; mix++) {
  for (let i = 0; i < file.length; i++) {
    const pos = file.findIndex(({ order }) => order === i);
    const current = file[pos];
    const newPos = (pos + current.value) % (file.length - 1);
    file.splice(pos, 1);
    file.splice(newPos, 0, current);
  }
}

const index0 = file.findIndex(({ value }) => value === 0);
const a = (index0 + 1000) % file.length;
const b = (index0 + 2000) % file.length;
const c = (index0 + 3000) % file.length;

const answer = file[a].value + file[b].value + file[c].value;

/* end solution */

const execEnd = performance.now();
const micros = (execEnd - execStart) * 1000;
console.log(`${answer} (${micros.toFixed(2)} µs)`);
