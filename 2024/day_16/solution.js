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
}

const heuristic = (a, b) => Math.abs(b.x - a.x) + Math.abs(b.y - a.y);

function findStartEnd(grid) {
  let start = null;
  let end = null;
  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid[x].length; y++) {
      const item = grid[x][y];
      if (item.value === 'S') {
        start = item;
      } else if (item.value === 'E') {
        end = item;
      }
      if (start && end) break;
    }
  }

  return { start, end };
}

class GridPoint {
  constructor([x, y], value) {
    this.x = x;
    this.y = y;
    this.f = 0;
    this.cost = 0;
    this.h = 0;
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


function findBestPath(grid) {
  let openSet = []; 
  let closedSet = [];
  let path = [];

  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid[x].length; y++) {
      const value = grid[x][y];
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
        path.push(temp);
        temp = temp.parent;
      }
      return path.reverse();
    }

    closedSet.push(current);

    for (const neighborInfo of current.neighbors) {
      const { node: neighbor, direction } = neighborInfo;

      if (closedSet.includes(neighbor)) continue;

      const directionChangeCost =
        current.direction && current.direction !== direction ? 1000 : 0;
      const pc = current.cost + 1 + directionChangeCost;

      if (!openSet.includes(neighbor) || pc < neighbor.cost) {
        neighbor.cost = pc;
        neighbor.h = heuristic(neighbor, end);
        neighbor.f = neighbor.cost + neighbor.h;
        neighbor.parent = current;
        neighbor.direction = direction;

        if (!openSet.includes(neighbor)) {
          openSet.push(neighbor);
        }
      }
    }
  }

  return [];
}

function findLowestCost () {
  const grid = parseInput();
  const path = findBestPath(grid);

  if (path.length === 0) {
    return -1;
  }

  return path[path.length - 1].cost;
}

// Part 1
const lowestCost = findLowestCost();
console.log(`Part 1 Answer: ${lowestCost}`);
