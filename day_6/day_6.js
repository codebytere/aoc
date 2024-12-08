const fs = require('node:fs');
const path = require('node:path');

function parseInput() {
  const inputPath = path.join(__dirname, 'input.txt');
  const txt = fs.readFileSync(inputPath, 'utf8').trim();
  return txt.split('\n').map(line => line.split(''));
}

const DIR_TO_COORD = {
  N: [-1, 0],
  E: [0, 1],
  S: [1, 0],
  W: [0, -1],
};

const GUARD_TO_DIR = {
  '^': 'N',
  '>': 'E',
  '<': 'W',
  'v': 'S',
};

function getNextDir(curr) {
  const directions = ['N', 'E', 'S', 'W'];
  const index = directions.indexOf(curr);
  return directions[(index + 1) % directions.length];
}

function findGuard(grid) {
  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid[x].length; y++) {
      const cell = grid[x][y];
      if (GUARD_TO_DIR[cell]) {
        return { start: [x, y], dir: GUARD_TO_DIR[cell] };
      }
    }
  }
  return null;
}

const atEnd = (grid, [x, y]) => x < 0 || y < 0 || x >= grid.length || y >= grid[0].length;

const atObstacle = (grid, [x, y]) => grid[x][y] === '#';

// Part 1
function computeDistinctGuardPositions() {
  const grid = parseInput();

  let total = 0;

  const guard = findGuard(grid);
  if (!guard) return total;

  let { start, dir } = guard;
  let curr = start;

  const seen = new Set();

  const maybeAddCell = (cell) => {
    const currKey = cell.join(',');
    if (!seen.has(currKey)) {
      seen.add(currKey);
      total += 1;
    }
  };

  while (true) {
    const [dx, dy] = DIR_TO_COORD[dir];
    const next = [curr[0] + dx, curr[1] + dy];

    if (atEnd(grid, next)) {
      maybeAddCell(curr);
      break;
    };
  
    if (atObstacle(grid, next)) {
      dir = getNextDir(dir);
      continue;
    }

    maybeAddCell(curr);
    curr = next;
  }
  return total;
}

const positions = computeDistinctGuardPositions();
console.log(`Part 1 Answer: ${positions}`);

// Part 2
function simulatePatrol (grid, [startX, startY], startDir) {
  const visited = new Set();
  let x = startX;
  let y = startY;
  let dir = startDir;

  while (true) {
    const state = `${x},${y},${dir}`;
    if (visited.has(state)) return true;
    visited.add(state);

    const [dx, dy] = DIR_TO_COORD[dir];
    const next = [x + dx, y + dy];

    if (atEnd(grid, next)) return false;
  
    if (atObstacle(grid, next)) {
      dir = getNextDir(dir);
    } else {
      x = next[0];
      y = next[1];
    }
  }
};

function findObstructionPositions() {
  const grid = parseInput();
  const loopPositions = new Set();

  const guard = findGuard(grid);
  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid[x].length; y++) {
      if (grid[x][y] === '.' && (x !== guard.start[0] || y !== guard.start[1])) {
        grid[x][y] = '#';

        if (simulatePatrol(grid, guard.start, guard.dir)) {
          loopPositions.add(`${x},${y}`);
        }

        grid[x][y] = '.';
      }
    }
  }

  return loopPositions.size;
}

const obstructions = findObstructionPositions();
console.log(`Part 2 Answer: ${obstructions}`);
