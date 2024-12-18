const fs = require('node:fs');
const path = require('node:path');

function parseInput() {
  const inputPath = path.join(__dirname, 'input.txt');
  const txt = fs.readFileSync(inputPath, 'utf8').trim();
  return txt.split('\n').map(line => line.trim().split(''));
}

const DIRS = {
  'N': [-1, 0],
  'S': [1, 0],
  'E': [0, 1],
  'W': [0, -1],
};

function getTurnCost(dir1, dir2) {
  if (!dir1 || !dir2 || dir1 === dir2) return 0;
  return 1000;
}

class GridPoint {
  constructor([x, y], value) {
    this.x = x;
    this.y = y;
    this.value = value;
    this.neighbors = [];
    this.bestPaths = new Map();
    this.prev = new Map();
  }

  updateNeighbors(grid) {
    for (const dir in DIRS) {
      const [dx, dy] = DIRS[dir];
      const nx = this.x + dx;
      const ny = this.y + dy;
      if (
        nx >= 0 &&
        ny >= 0 &&
        nx < grid.length &&
        ny < grid[0].length &&
        grid[nx][ny].value !== '#'
      ) {
        this.neighbors.push({
          node: grid[nx][ny],
          direction: dir
        });
      }
    }
  }
}

function findStartEnd(grid) {
  let start = null;
  let end = null;
  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid[x].length; y++) {
      const point = grid[x][y];
      if (point.value === 'S') start = grid[x][y];
      if (point.value === 'E') end = grid[x][y];
      if (start && end) break;
    }
  }
  return { start, end };
}

function findBestPaths(grid) {
  const gridPoints = Array.from({ length: grid.length }, (_, x) =>
    Array.from({ length: grid[0].length }, (_, y) =>
      new GridPoint([x, y], grid[x][y])
    )
  );

  for (const row of gridPoints) {
    for (const point of row) {
      point.updateNeighbors(gridPoints);
    }
  }

  const { start, end } = findStartEnd(gridPoints);
  if (!start || !end) {
    console.error("Couldn't find start or end point!");
    return { paths: [], cost: Infinity, steps: Infinity };
  }

  const queue = [{ node: start, cost: 0, steps: 0, direction: 'E' }];
  start.bestPaths.set('E', { cost: 0, steps: 0 });

  let bestEndCost = Infinity;
  let bestEndSteps = Infinity;

  while (queue.length > 0) {
    queue.sort((a, b) => {
      if (a.cost !== b.cost) return a.cost - b.cost;
      return a.steps - b.steps;
    });

    const current = queue.shift();
    const { node: currentNode, cost: currentCost, steps: currentSteps, direction: currentDir } = current;

    if (currentCost > bestEndCost) continue;

    if (currentNode === end) {
      if (currentCost < bestEndCost || (currentCost === bestEndCost && currentSteps < bestEndSteps)) {
        bestEndCost = currentCost;
        bestEndSteps = currentSteps;
      }
      continue;
    }

    for (const { node: neighbor, direction: newDir } of currentNode.neighbors) {
      const turnCost = getTurnCost(currentDir, newDir);
      const newCost = currentCost + 1 + turnCost;
      const newSteps = currentSteps + 1;

      if (newCost > bestEndCost) continue;

      const prevBestPath = neighbor.bestPaths.get(newDir);
      const isBetterPath = !prevBestPath ||
        newCost < prevBestPath.cost ||
        (newCost === prevBestPath.cost && newSteps < prevBestPath.steps);
      const isEqualPath = prevBestPath &&
        newCost === prevBestPath.cost &&
        newSteps === prevBestPath.steps;

      if (isBetterPath || isEqualPath) {
        if (isEqualPath) {
          const prevPaths = neighbor.prev.get(newDir) || [];
          prevPaths.push({
            prevNode: currentNode,
            prevDir: currentDir,
            cost: newCost,
            steps: newSteps
          });
          neighbor.prev.set(newDir, prevPaths);
        } else {
          neighbor.bestPaths.set(newDir, { cost: newCost, steps: newSteps });
          neighbor.prev.set(newDir, [{
            prevNode: currentNode,
            prevDir: currentDir,
            cost: newCost,
            steps: newSteps
          }]);
          queue.push({
            node: neighbor,
            cost: newCost,
            steps: newSteps,
            direction: newDir
          });
        }
      }
    }
  }

  return reconstructAllPaths(end, bestEndCost, bestEndSteps);
}

function reconstructAllPaths(end) {
  let bestCost = Infinity;
  let bestSteps = Infinity;
  const paths = [];

  function backtrack(node, direction, visited = [], dirs = []) {
    if (!node) return;

    visited.push(node);
    dirs.push(direction);

    const prevPaths = node.prev.get(direction) || [];
    if (prevPaths.length === 0) {
      if (node.value === 'S') {
        const endPath = end.bestPaths.get(Array.from(end.bestPaths.keys())[0]);
        if (endPath.cost <= bestCost && endPath.steps <= bestSteps) {
          if (endPath.cost < bestCost || endPath.steps < bestSteps) {
            paths.length = 0; // Clear previous paths if we found a better one
            bestCost = endPath.cost;
            bestSteps = endPath.steps;
          }
          paths.push({
            nodes: [...visited].reverse(),
            directions: [...dirs].reverse(),
            cost: endPath.cost,
            steps: endPath.steps
          });
        }
      }
      return;
    }

    for (const { prevNode, prevDir } of prevPaths) {
      backtrack(prevNode, prevDir, [...visited], [...dirs]);
    }
  }

  for (const [endDir] of end.prev) {
    backtrack(end, endDir);
  }

  return {
    paths,
    cost: bestCost,
    steps: bestSteps
  };
}

function findAllLowestCostPaths() {
  const grid = parseInput();
  const { paths, cost, steps } = findBestPaths(grid);

  const allTiles = new Set();
  paths.forEach(path => {
    path.nodes.forEach(node => allTiles.add(`${node.x},${node.y}`));
  });

  return {
    tileCount: allTiles.size,
    cost,
    steps,
    allTiles: Array.from(allTiles)
  };
}

const { cost, tileCount } = findAllLowestCostPaths();

console.log(`Part 1 Answer: ${cost}`);
console.log(`Part 2 Answer: ${tileCount}`);
