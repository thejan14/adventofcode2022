const path = require("path");
const fs = require("fs");
let { performance } = require("perf_hooks");

const input = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");
const execStart = performance.now();

/* begin solution */

const linkedList = input
  .split("\n")
  .map((n) => ({ data: Number(n), next: undefined, prev: undefined }));

let entry0;
for (let i = 0; i < linkedList.length; i++) {
  linkedList[i].next = linkedList[mod(i + 1, linkedList.length)];
  linkedList[i].prev = linkedList[mod(i - 1, linkedList.length)];
  if (!entry0 && linkedList[i].data === 0) {
    entry0 = linkedList[i];
  }
}

for (const entry of linkedList) {
  if (entry.data !== 0) {
    for (let i = 0; i < Math.abs(entry.data); i++) {
      if (Math.sign(entry.data) > 0) {
        swap(entry, entry.next);
      } else {
        swap(entry.prev, entry);
      }
    }
  }
}

const a = getAfter(entry0, 1000);
const b = getAfter(entry0, 2000);
const c = getAfter(entry0, 3000);

const answer = a.data + b.data + c.data;

function getAfter(head, n) {
  let current = head;
  for (let i = 0; i < n; i++) {
    current = current.next;
  }

  return current;
}

function swap(x, y) {
  //       v-----v
  // a <-> b <-> c <-> d
  let a = x.prev;
  let b = x;
  let c = x.next;
  let d = y.next;
  a.next = c;
  b.prev = c;
  b.next = d;
  c.prev = a;
  c.next = b;
  d.prev = b;
}

function mod(n, m) {
  return ((n % m) + m) % m;
}

/* end solution */

const execEnd = performance.now();
const micros = (execEnd - execStart) * 1000;
console.log(`${answer} (${micros.toFixed(2)} µs)`);
