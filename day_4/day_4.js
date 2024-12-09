const fs = require('node:fs');
const path = require('node:path');

function parseInput() {
  const inputPath = path.join(__dirname, 'input.txt');
  const txt = fs.readFileSync(inputPath, 'utf8').trim();
  return txt.split('\n').map(line => line.split(''));
}

const grid = parseInput();

// Part 1
const DIR_TO_COORD = {
  N: [-1, 0],
  E: [0, 1],
  S: [1, 0],
  W: [0, -1],
  NE: [1, -1],
  SE: [1, 1],
  SW: [-1, 1],
  NW: [-1, -1]
};

function checkDirection(letters, dir, grid, pos) {
  const [nx, ny] = DIR_TO_COORD[dir];
  let [x, y] = pos;

  for (const letter of letters) {
    x += nx;
    y += ny;
    const next = grid[x]?.[y];

    if (next === undefined || next !== letter) {
      return false;
    }
  }

  return true;
}

function tallyXMAS(grid) {
  let total = 0;

  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid[x].length; y++) {
      if (grid[x][y] !== 'X') continue;
      for (const dir in DIR_TO_COORD) {
        if (checkDirection(['M', 'A', 'S'], dir, grid, [x, y])) {
          total++;
        }
      }
    }
  }

  return total;
}

const xmasCount = tallyXMAS(grid);
console.log(`Part 1 Answer: ${xmasCount}`);

// Part 2
function checkAround(pos, grid) {
  const [x, y] = pos;

  const ne = grid[x + 1]?.[y - 1];
  const se = grid[x + 1]?.[y + 1];
  const sw = grid[x - 1]?.[y + 1];
  const nw = grid[x - 1]?.[y - 1];

  if (![ne, se, sw, nw].every(val => val === 'M' || val === 'S')) return false;

  if ((ne === 'M' && sw !== 'S') || (ne === 'S' && sw !== 'M')) return false;
  if ((nw === 'M' && se !== 'S') || (nw === 'S' && se !== 'M')) return false;

  return true;
}

function tallyXMASX(grid) {
  let total = 0;

  for (let x = 1; x < grid.length - 1; x++) {
    for (let y = 1; y < grid[x].length - 1; y++) {
      if (grid[x][y] === 'A' && checkAround([x, y], grid)) {
        total++;
      }
    }
  }

  return total;
}

const xmasXCount = tallyXMASX(grid);
console.log(`Part 2 Answer: ${xmasXCount}`);
