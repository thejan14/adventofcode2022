const path = require("path");
const fs = require("fs");
let { performance } = require("perf_hooks");

const input = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");
const execStart = performance.now();

/* begin solution */

let humnValue;
const dictionary = {};
input.split("\n").forEach((line) => {
  const [ape, yell] = line.split(": ");

  let result;
  if (isNaN(yell)) {
    const [, a, instruction, b] = yell.match(/(\w+) ([+\-*/]) (\w+)/);
    result = [a, instruction, b];
  } else {
    result = Number(yell);
  }

  if (ape === "humn") {
    humnValue = result;
    result = "x";
  }

  dictionary[ape] = result;
});

let [x, , y] = dictionary["root"];
x = compute(x, "x");
y = compute(y, humnValue);

while (Array.isArray(x)) {
  let [ape1, instruction, ape2] = x;

  // assume that "x" (the value "humn" should yell) is only
  // ever present in one side of the equation at a time
  const a = compute(ape1, "x");
  const b = compute(ape2, "x");

  if (instruction === "+") {
    if (isNaN(a)) {
      y -= b;
      x = a;
    } else {
      y -= a;
      x = b;
    }
  } else if (instruction === "-") {
    if (isNaN(a)) {
      y += b;
      x = a;
    } else {
      y = a - y;
      x = b;
    }
  } else if (instruction === "*") {
    if (isNaN(a)) {
      y /= b;
      x = a;
    } else {
      y /= a;
      x = b;
    }
  } else {
    if (isNaN(a)) {
      y *= b;
      x = a;
    } else {
      y = a / y;
      x = b;
    }
  }
}

const answer = y;

// compute will either evaluate the expression or return the next
// operation (e.g. ["abcd", "+", "opqr"]) if the unknown "x" is
// required for solving.
function compute(ape, humnValue) {
  const yell = dictionary[ape];
  if (ape === "humn") {
    return humnValue;
  }

  if (Array.isArray(yell)) {
    const [a, instruction, b] = yell;
    let x = compute(a, humnValue);
    let y = compute(b, humnValue);
    if (isNaN(x) || isNaN(y)) {
      return [a, instruction, b];
    } else {
      switch (instruction) {
        case "+":
          return x + y;
        case "-":
          return x - y;
        case "*":
          return x * y;
        case "/":
          return x / y;
        default:
          throw `unsupported instruction '${instruction}'`;
      }
    }
  } else {
    return yell;
  }
}

/* end solution */

const execEnd = performance.now();
const micros = (execEnd - execStart) * 1000;
console.log(`${answer} (${micros.toFixed(2)} µs)`);
