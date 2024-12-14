const fs = require('node:fs');
const path = require('node:path');

function parseInput() {
  const inputPath = path.join(__dirname, 'input.txt');
  const txt = fs.readFileSync(inputPath, 'utf8').trim();
  return txt.split('');
}

const input = parseInput();

const DIRS = {
  '^': [-1, 0],
  '>': [0, 1],
  'v': [1, 0],
  '<': [0, -1],
}

function calculateDuplicateGiftHouses(dirs) {
  const seen = new Set();
  let pos = [0,0];

  for (const dir of dirs) {
    const [dx, dy] = DIRS[dir];
    const [x, y] = [pos[0] + dx, pos[1] + dy];

    seen.add(`${x},${y}`);
    pos = [x, y];
  }

  return seen.size;
}

function calculateSantaSeenHouses(dirs) {
  let sPos = [0, 0];
  let rsPos = [0, 0];
  const seen = new Set();

  for (let i = 0; i < dirs.length; i++) {
    const [dx, dy] = DIRS[dirs[i]];

    const even = i % 2 === 0;
    let oX = even ? sPos[0] : rsPos[0]; 
    let oY = even ? sPos[1] : rsPos[1]; 
    const [x, y] = [oX + dx, oY + dy];

    seen.add(`${x},${y}`);
    if (even) {
      sPos = [x, y];
    } else {
      rsPos = [x, y];
    }
  }

  return seen.size;
}

// Part 1
const dups = calculateDuplicateGiftHouses(input);
console.log(`Part 1 Answer: ${dups}`);

// Part 2
const roboDups = calculateSantaSeenHouses(input);
console.log(`Part 2 Answer: ${roboDups}`);
