const path = require("path");
const fs = require("fs");
let { performance } = require("perf_hooks");

const input = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");
const execStart = performance.now();

/* begin solution */

// many thanks to https://github.com/Mike-Bell
// inspiration taken from https://www.reddit.com/r/adventofcode/comments/zpihwi/comment/j0unhov/?utm_source=share&utm_medium=web2x&context=3

const ResourceType = {
  Ore: 0,
  Clay: 1,
  Obsidian: 2,
  Geode: 3,
};

const blueprintRegex =
  /Blueprint (\d+): Each ore robot costs (\d+) ore\. Each clay robot costs (\d+) ore\. Each obsidian robot costs (\d+) ore and (\d+) clay\. Each geode robot costs (\d+) ore and (\d+) obsidian\./;

const blueprints = input
  .split("\n")
  .slice(0, 3)
  .map((line) => line.match(blueprintRegex))
  .map(
    ([
      ,
      id,
      oreRobotOre,
      clayRobotOre,
      obsidianRobotOre,
      obsidianRobotClay,
      geodeRobotOre,
      geodeRobotObsidian,
    ]) => ({
      id: Number(id),
      [ResourceType.Ore]: [[ResourceType.Ore, Number(oreRobotOre)]],
      [ResourceType.Clay]: [[ResourceType.Ore, Number(clayRobotOre)]],
      [ResourceType.Obsidian]: [
        [ResourceType.Ore, Number(obsidianRobotOre)],
        [ResourceType.Clay, Number(obsidianRobotClay)],
      ],
      [ResourceType.Geode]: [
        [ResourceType.Ore, Number(geodeRobotOre)],
        [ResourceType.Obsidian, Number(geodeRobotObsidian)],
      ],
    })
  )
  .map((blueprint) => ({
    ...blueprint,
    max: Object.values(ResourceType).map((type) =>
      Math.max(
        ...Object.values(ResourceType)
          .flatMap((t) => blueprint[t])
          .filter(([resource]) => resource === type)
          .map(([, requirement]) => requirement)
      )
    ),
  }));

const answer = blueprints.reduce(
  (acc, b) => acc * exploreBlueprint(32, [1, 0, 0, 0], [0, 0, 0, 0], b),
  1
);

function exploreBlueprint(minutes, robots, resources, blueprint) {
  let bestResult = resources[ResourceType.Geode];
  if (minutes > 1) {
    for (const type of Object.values(ResourceType)) {
      const canBuild = blueprint[type].every(([t]) => robots[t] > 0); // consider building only if robots for the required resources exist
      const shouldBuild =
        type === ResourceType.Geode || robots[type] < blueprint.max[type]; // always build geode robots, but only build as much robots per recource as can be consumed per minute
      if (canBuild && shouldBuild) {
        const timeToResources = Math.max(
          ...blueprint[type].map(([resource, requirement]) =>
            Math.ceil((requirement - resources[resource]) / robots[resource])
          ),
          0
        );
        const timeToBuild = timeToResources + 1;
        const nextRobots = Object.values(ResourceType).map((t) =>
          t === type ? robots[t] + 1 : robots[t]
        );
        const nextResources = Object.values(ResourceType).map(
          (t) => resources[t] + robots[t] * timeToBuild
        );
        blueprint[type].forEach(
          ([resource, requirement]) => (nextResources[resource] -= requirement)
        );
        const nextTime = minutes - timeToBuild;
        if (nextTime > -1) {
          const nextResult = exploreBlueprint(
            nextTime,
            nextRobots,
            nextResources,
            blueprint
          );
          if (nextResult > bestResult) {
            bestResult = nextResult;
          }
        }
      }
    }

    return bestResult;
  } else {
    return resources[ResourceType.Geode] + minutes * robots[ResourceType.Geode];
  }
}

/* end solution */

const execEnd = performance.now();
const micros = (execEnd - execStart) * 1000;
console.log(`${answer} (${micros.toFixed(2)} µs)`);
