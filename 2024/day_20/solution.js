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

class GridPoint {
  constructor([x, y], value) {
    this.x = x;
    this.y = y;
    this.cost = 0;
    this.value = value;
    this.direction = null;
    this.neighbors = [];
    this.parent = null;
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

function findBestPath(initialGrid) {
  let grid = structuredClone(initialGrid);
  let openSet = [];
  let closedSet = [];
  let bestPath = [];
  let obstacles = [];

  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid[x].length; y++) {
      const value = grid[x][y];

      if (value === '#') {
        obstacles.push([x, y]);
      }

      grid[x][y] = new GridPoint([x, y], value);
    }
  }

  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid[x].length; y++) {
      grid[x][y].updateNeighbors(grid);
    }
  }

  const { start, end } = findStartEnd(grid);
  openSet.push(start);
  while (openSet.length > 0) {
    openSet.sort((a, b) => a.f - b.f);
    const current = openSet.shift();
    if (current === end) {
      let temp = current;
      while (temp) {
        bestPath.push(temp);
        temp = temp.parent;
      }
      return { bestPath: bestPath.reverse(), obstacles };
    }

    closedSet.push(current);
    for (const neighborInfo of current.neighbors) {
      const { node: neighbor, direction } = neighborInfo;
      if (closedSet.includes(neighbor)) continue;
      const pc = current.cost + 1;
      if (!openSet.includes(neighbor) || pc < neighbor.cost) {
        neighbor.cost = pc;
        neighbor.parent = current;
        neighbor.direction = direction;
        if (!openSet.includes(neighbor)) {
          openSet.push(neighbor);
        }
      }
    }
  }

  return { bestPath: [], obstacles };
}

function findCheats(savingsThreshold = 0) {
  const grid = parseInput();

  const savingsMap = new Map();

  const { bestPath, obstacles } = findBestPath(grid);
  const initialTime = bestPath.length - 1;
  
  for (const obstacle of obstacles) {
    const [x, y] = obstacle;
    let temp = structuredClone(grid);
    temp[x][y] = '.';
    const testResult = findBestPath(temp);
    if (testResult.bestPath.length === 0) continue;

    const saving = initialTime - (testResult.bestPath.length - 1);
    if (saving >= savingsThreshold) {
      if (savingsMap.has(saving)) {
        const savings = savingsMap.get(saving);
        savings.push(`${x},${y}`);
        savingsMap.set(saving, savings);
      } else {
        savingsMap.set(saving, [`${x},${y}`]);
      }
    }
  }

  return savingsMap;
}

function getCheatsSaving100() {
  const cheats = findCheats(100);
  const values = Array.from(cheats.values());
  return values.flat().length;
}

const cheats = getCheatsSaving100();
console.log(`Part 1 Answer: ${cheats}`);
