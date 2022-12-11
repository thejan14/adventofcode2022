const path = require("path");
const fs = require("fs");
let { performance } = require("perf_hooks");

const input = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");
const execStart = performance.now();

/* begin solution */

const operators = {
  "+": (a, b) => a + b,
  "*": (a, b) => a * b,
};

// idea: find a value n so that when we modulo the worry levels the operations
// (a+b)%n and (a*b)%n produce the same results as in the entire range of natural
// numbers. This property is given for the least common multiple of all "test".
// See https://en.wikipedia.org/wiki/Modular_arithmetic#Properties.

let lcm = 1;
const monkeys = input.split("\n\n").map((notes) => {
  const lines = notes.split("\n");
  const divisor = Number(lines[3].match(/\d+/));
  const ifTrue = Number(lines[4].match(/\d+/));
  const ifFalse = Number(lines[5].match(/\d+/));
  lcm = leastCommonMultiple(lcm, divisor);
  return {
    monkeyNr: Number(lines[0].match(/\d+/)),
    items: lines[1].match(/\d+/g).map((i) => Number(i)),
    operation: parseOperationFunc(lines[2]),
    test: (current) => (current % divisor === 0 ? ifTrue : ifFalse),
    inspects: 0,
  };
});

const rounds = 10000;
for (let i = 0; i < rounds; i++) {
  for (const monkey of monkeys) {
    for (const item of monkey.items) {
      monkey.inspects += 1;
      const newWorryLevel = monkey.operation(item) % lcm;
      const throwTo = monkey.test(newWorryLevel);
      monkeys[throwTo].items.push(newWorryLevel);
    }

    monkey.items = [];
  }
}

monkeys.sort((a, b) => b.inspects - a.inspects);
const answer = monkeys[0].inspects * monkeys[1].inspects;

function parseOperationFunc(line) {
  const match = line.match(/old ([+*]) (old|\d+)/);
  const operator = operators[match[1]];
  if (match[2] === "old") {
    return (old) => operator(old, old);
  } else {
    const number = Number(match[2]);
    return (old) => operator(old, number);
  }
}

function leastCommonMultiple(a, b) {
  return Math.abs(a * b) / greatestCommonDivisor(a, b);
}

function greatestCommonDivisor(a, b) {
  if (a === 0) {
    return b;
  } else {
    return greatestCommonDivisor(b % a, a);
  }
}

/* end solution */

const execEnd = performance.now();
const micros = (execEnd - execStart) * 1000;
console.log(`${answer} (${micros.toFixed(2)} µs)`);
