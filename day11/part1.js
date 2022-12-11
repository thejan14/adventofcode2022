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

const monkeys = input.split("\n\n").map((notes) => {
  const lines = notes.split("\n");
  return {
    monkeyNr: Number(lines[0].match(/\d+/)),
    items: lines[1].match(/\d+/g).map((i) => Number(i)),
    operation: parseOperationFunc(lines[2]),
    test: parseTestFunc(lines[3], lines[4], lines[5]),
    inspects: 0,
  };
});

const rounds = 20;
for (let i = 0; i < rounds; i++) {
  for (const monkey of monkeys) {
    for (const item of monkey.items) {
      monkey.inspects += 1;
      const newWorryLevel = Math.floor(monkey.operation(item) / 3);
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

function parseTestFunc(testLine, ifTrueLine, ifFalseLine) {
  const divisor = Number(testLine.match(/\d+/));
  const ifTrue = Number(ifTrueLine.match(/\d+/));
  const ifFalse = Number(ifFalseLine.match(/\d+/));
  return (current) => (current % divisor === 0 ? ifTrue : ifFalse);
}

/* end solution */

const execEnd = performance.now();
const micros = (execEnd - execStart) * 1000;
console.log(`${answer} (${micros.toFixed(2)} µs)`);
