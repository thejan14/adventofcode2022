const path = require("path");
const fs = require("fs");
let { performance } = require("perf_hooks");

const input = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");
const execStart = performance.now();

/* begin solution */

const pairs = input
  .split("\n\n")
  .map((block) => block.split("\n").map((line) => JSON.parse(line)));

let answer = 0;
let i = 1;
for (const [left, right] of pairs) {
  if (compare(left, right)) {
    answer += i;
  }

  i += 1;
}

function compare(left, right) {
  if (Number.isInteger(left) && Number.isInteger(right)) {
    if (left !== right) {
      return left < right;
    } else {
      return undefined;
    }
  }

  if (Array.isArray(left) && Array.isArray(right)) {
    const minLength = Math.min(left.length, right.length);
    for (let i = 0; i < minLength; i++) {
      const result = compare(left[i], right[i]);
      if (result !== undefined) {
        return result;
      }
    }

    if (left.length !== right.length) {
      // left or right ran out of items:
      return left.length < right.length;
    }
  }

  if (Number.isInteger(left) && Array.isArray(right)) {
    return compare([left], right);
  }

  if (Array.isArray(left) && Number.isInteger(right)) {
    return compare(left, [right]);
  }

  return undefined;
}

/* end solution */

const execEnd = performance.now();
const micros = (execEnd - execStart) * 1000;
console.log(`${answer} (${micros.toFixed(2)} µs)`);
