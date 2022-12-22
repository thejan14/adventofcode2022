const path = require("path");
const fs = require("fs");
let { performance } = require("perf_hooks");

const input = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");
const execStart = performance.now();

/* begin solution */

const dictionary = {};
input.split("\n").forEach((line) => {
  const [ape, yell] = line.split(": ");
  let result;
  if (isNaN(yell)) {
    const [, a, instruction, b] = yell.match(/(\w+) ([+\-*\/]) (\w+)/);
    switch (instruction) {
      case "+":
        result = (dict) => dict[a](dict) + dict[b](dict);
        break;
      case "-":
        result = (dict) => dict[a](dict) - dict[b](dict);
        break;
      case "*":
        result = (dict) => dict[a](dict) * dict[b](dict);
        break;
      case "/":
        result = (dict) => dict[a](dict) / dict[b](dict);
        break;
      default:
        throw "unknown instruction";
    }
  } else {
    result = () => Number(yell);
  }

  dictionary[ape] = result;
});

const answer = dictionary["root"](dictionary);

/* end solution */

const execEnd = performance.now();
const micros = (execEnd - execStart) * 1000;
console.log(`${answer} (${micros.toFixed(2)} µs)`);
