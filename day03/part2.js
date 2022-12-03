const path = require("path");
const fs = require("fs");
let { performance } = require("perf_hooks");

const input = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");
const execStart = performance.now();

/* begin solution */

const answer = input
  .match(/\w+\n\w+\n\w+/g)
  .map((group) => group.split("\n"))
  .map(
    (rucksacks) =>
      rucksacks
        .slice(1)
        .reduce(
          (commonItems, rucksackItems) =>
            [...rucksackItems].filter((item) => commonItems.includes(item)),
          rucksacks[0]
        )[0]
  )
  .map((item) =>
    item === item.toUpperCase()
      ? item.charCodeAt(0) - 65 + 27
      : item.charCodeAt(0) - 97 + 1
  )
  .reduce((acc, priority) => acc + priority, 0);

/* end solution */

const execEnd = performance.now();
const micros = (execEnd - execStart) * 1000;
console.log(`${answer} (${micros.toFixed(2)} µs)`);
