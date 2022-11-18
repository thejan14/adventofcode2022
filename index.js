const path = require("path");
const fs = require("fs");
const cp = require("child_process");

const dayFolderRegex = /day\d{2}/;
const solutionScriptRegex = /part[12]\.js/;

run();

async function run() {
  const solutions = fs
    .readdirSync(__dirname, { withFileTypes: true })
    .filter(
      (directory) =>
        directory.isDirectory() && dayFolderRegex.test(directory.name)
    )
    .flatMap((directory) =>
      fs
        .readdirSync(path.join(__dirname, directory.name), {
          withFileTypes: true,
        })
        .filter(
          (file) => !file.isDirectory() && solutionScriptRegex.test(file.name)
        )
        .map((file) => [directory.name, file.name])
    );

  for (const [dirName, fileName] of solutions) {
    console.log(await execute(dirName, fileName));
  }
}

function execute(dirName, fileName) {
  return new Promise((resolve) => {
    let output = "";
    const solution = cp.fork(path.join(__dirname, dirName, fileName), {
      stdio: "pipe",
    });
    solution.on("close", () =>
      resolve(`${dirName}/${fileName} => ${output.trim()}`)
    );
    solution.stdout.on("data", (d) => (output += d));
  });
}
