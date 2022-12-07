const path = require("path");
const fs = require("fs");
let { performance } = require("perf_hooks");

const input = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");
const execStart = performance.now();

/* begin solution */

const commandRegex = /\$ (?<command>cd|ls) ?(?<argument>(\w+|\/|\.\.)+)?/;
const fileSystem = { "/": {} };
let currentDir = fileSystem["/"];
let pathSegments = [];
for (const line of input.split("\n")) {
  const commandMatch = line.match(commandRegex);
  if (commandMatch) {
    if (commandMatch.groups["command"] === "cd") {
      if (commandMatch.groups["argument"] === "/") {
        pathSegments = [];
        currentDir = fileSystem["/"];
      } else if (commandMatch.groups["argument"] === "..") {
        pathSegments.pop();
        currentDir = getDirectoryFromPath(fileSystem, pathSegments);
      } else {
        pathSegments.push(commandMatch.groups["argument"]);
        currentDir = addDirectory(currentDir, commandMatch.groups["argument"]);
      }
    }
  } else {
    // parse ls output
    const [first, second] = line.split(" ");
    if (first === "dir") {
      addDirectory(currentDir, second);
    } else {
      currentDir[second] = Number(first);
    }
  }
}

const sizes = [];
const total = getSizes(fileSystem["/"], sizes);
const unused = 70000000 - total;
const minDirSize = 30000000 - unused;
const answer = Math.min(...sizes.filter((s) => s > minDirSize));

function addDirectory(currentDir, newDir) {
  if (!currentDir[newDir]) {
    currentDir[newDir] = {};
  }

  return currentDir[newDir];
}

function getDirectoryFromPath(fileSystem, pathSegments) {
  let dir = fileSystem["/"];
  for (const segment of pathSegments) {
    dir = dir[segment];
  }

  return dir;
}

function getSizes(directory, sizes) {
  let size = 0;
  for (const [key, value] of Object.entries(directory)) {
    if (Number.isInteger(value)) {
      size += value;
    } else {
      size += getSizes(directory[key], sizes);
    }
  }

  sizes.push(size);
  return size;
}

/* end solution */

const execEnd = performance.now();
const micros = (execEnd - execStart) * 1000;
console.log(`${answer} (${micros.toFixed(2)} µs)`);
