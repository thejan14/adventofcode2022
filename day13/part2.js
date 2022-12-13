const path = require("path");
const fs = require("fs");
let { performance } = require("perf_hooks");

const input = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");
const execStart = performance.now();

/* begin solution */

const packets = input
  .split("\n\n")
  .flatMap((block) => block.split("\n").map((line) => JSON.parse(line)))
  .concat([[[2]], [[6]]]);

packets.sort((a, b) => (compare(a, b) ? -1 : 1));

const divider1 = packets.findIndex((p) => isDivider(p, 2)) + 1;
const divider2 = packets.findIndex((p) => isDivider(p, 6)) + 1;
const answer = divider1 * divider2;

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

function isDivider(packet, value) {
  if (Array.isArray(packet) && packet.length === 1) {
    if (Array.isArray(packet[0]) && packet[0].length === 1) {
      return packet[0][0] === value;
    }
  }
}

/* end solution */

const execEnd = performance.now();
const micros = (execEnd - execStart) * 1000;
console.log(`${answer} (${micros.toFixed(2)} µs)`);
