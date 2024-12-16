const fs = require('node:fs');
const path = require('node:path');

function parseInput() {
  const inputPath = path.join(__dirname, 'input.txt');
  const txt = fs.readFileSync(inputPath, 'utf8').trim();
  const [rawGrid, moves] = txt.split('\n\n');
  return {
    grid: rawGrid.trim().split('\n').map(line => line.trim().split('')),
    moves: moves.split('').filter(c => ['^', '>', 'v', '<'].includes(c)),
  }
}

const input = parseInput();

const ROBOT = '@';
const BOX = 'O';
const BLOCK = '#';
const FREE_SPACE = '.';

const DIRS = {
  '^': [-1, 0],
  '>': [0, 1],
  'v': [1, 0],
  '<': [0, -1],
};

function findRobot(grid) {
  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid[x].length; y++) {
      if (grid[x][y] === ROBOT) {
        return [x, y];
      }
    }
  }
  return null;
}

const isValid = (grid, [x, y]) => {
  return x > 0 && x < grid.length - 1 && y > 0 && y < grid[x].length - 1;
}

function push(grid, [dx, dy], [x, y]) {
  let itemsToMove = [];
  let cx = x;
  let cy = y;

  while (true) {
    cx += dx;
    cy += dy;

    if (!isValid(grid, [cx, cy])) {
      return false;
    }

    const cell = grid[cx][cy];
    if (cell === FREE_SPACE) {
      break;
    } else if (cell === BOX) {
      itemsToMove.push({ x: cx, y: cy });
    } else {
      return false;
    }
  }

  for (let i = itemsToMove.length - 1; i >= 0; i--) {
    const { x: boxX, y: boxY } = itemsToMove[i];
    grid[boxX + dx][boxY + dy] = BOX;
    grid[boxX][boxY] = FREE_SPACE;
  }

  grid[x + dx][y + dy] = ROBOT;
  grid[x][y] = FREE_SPACE;

  return true;
}

function getGPSTotal({ grid, moves }) {
  let pos = findRobot(grid);
  for (const move of moves) {
    const [dx, dy] = DIRS[move];
    const [nx, ny] = [pos[0] + dx, pos[1] + dy];
    const item = grid[nx]?.[ny];
    if (item === BLOCK) {
      continue;
    } else if (item === FREE_SPACE) {
      grid[nx][ny] = ROBOT;
      grid[pos[0]][pos[1]] = FREE_SPACE;
      pos = [nx, ny];
    } else if (item === BOX) {
      if (push(grid, [dx, dy], pos)) {
        pos = [nx, ny];
      }
    }
  }

  return grid.reduce((total, row, x) => (
    total + row.reduce((rt, cell, y) => (
      cell === BOX ? rt + (100 * x) + y : rt
    ), 0)
  ), 0);
}

// Part 1
const gpsTotal = getGPSTotal(input);
console.log(`Part 1 Answer: ${gpsTotal}`);

// Part 2
