const fs = require('node:fs');
const path = require('node:path');

function parseInput() {
  const inputPath = path.join(__dirname, 'input.txt');
  const txt = fs.readFileSync(inputPath, 'utf8').trim();
  return txt.split('\n').map((line) => {
    const [x, y] = line.split(',').map(Number);
    return { x, y };
  });
}

const GRID_SIZE = [71, 71];

const distance = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

const DIRS = {
  'N': [-1, 0],
  'S': [1, 0],
  'E': [0, 1],
  'W': [0, -1],
};

class GridPoint {
  constructor([x, y], value) {
    this.x = x;
    this.y = y;
    this.value = value;
    this.f = 0;
    this.cost = 0;
    this.distance = 0;
    this.neighbors = [];
    this.parent = undefined;
  }

  get position() {
    return `${this.x},${this.y}`;
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
        this.neighbors.push(grid[nx][ny]);
      }
    }
  }
}

function printGrid(grid) {
  for (let i = 0; i < grid.length; i++) {
    let row = '';
    for (let j = 0; j < grid[i].length; j++) {
      row += grid[i][j].value;
    }
    console.log(row);
  }
}

function findBestPath(grid) {
  let bestPath = [];
  let openSet = [];
  let closedSet = [];

  const [cols, rows] = GRID_SIZE;
  const start = grid[0][0];
  const end = grid[cols - 1][rows - 1];

  openSet.push(start);

  while (openSet.length > 0) {
    let lowestIndex = 0;
    for (let i = 0; i < openSet.length; i++) {
      if (openSet[i].f < openSet[lowestIndex].f) {
        lowestIndex = i;
      }
    }

    let current = openSet[lowestIndex];
    if (current.position === end.position) {
      let temp = current;
      bestPath.push(temp);
      while (temp.parent) {
        grid[temp.x][temp.y].value = 'O';
        bestPath.push(temp.parent);
        temp = temp.parent;
      }

      return { bestPath: bestPath.reverse(), grid };
    }

    openSet.splice(lowestIndex, 1);
    closedSet.push(current);

    for (const neighbor of current.neighbors) {
      if (!closedSet.includes(neighbor)) {
        let pc = current.cost + 1;

        if (!openSet.includes(neighbor)) {
          openSet.push(neighbor);
        } else if (pc >= neighbor.cost) {
          continue;
        }

        neighbor.cost = pc;
        neighbor.distance = distance(neighbor, end);
        neighbor.f = neighbor.cost + neighbor.distance;
        neighbor.parent = current;
      }
    }
  }

  return { path: [], grid };
}

function simulateFallingBytes(input, threshold = Number.MAX_SAFE_INTEGER) {
  let grid = Array.from({
    length: GRID_SIZE[0]
  }, () => Array(GRID_SIZE[1]).fill('.'));

  input.forEach(({ x, y }, index) => {
    if (index < threshold) {
      grid[x][y] = '#';
    }
  });

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      const value = grid[i][j];
      grid[i][j] = new GridPoint([i, j], value);
    }
  }

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      grid[i][j].updateNeighbors(grid);
    }
  }

  return grid;
}

function getMinimumStepsToExit() {
  const input = parseInput();
  const corruptedGrid = simulateFallingBytes(input, 1024);

  const { bestPath } = findBestPath(corruptedGrid);
  return bestPath.length - 1;
}

const minStepsToExit = getMinimumStepsToExit();
console.log(`Part 1 Answer: ${minStepsToExit}`);
