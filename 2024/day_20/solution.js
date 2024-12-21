const fs = require('node:fs');
const path = require('node:path');

function parseInput() {
  const inputPath = path.join(__dirname, 'input.txt');
  const txt = fs.readFileSync(inputPath, 'utf8').trim();
  return txt.split('\n').map(line => line.trim().split(''));
}

const DIRECTIONS = [
  { x: 0, y: -1 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
  { x: 1, y: 0 }
];

const distance = (a, b) => {
  const [ax, ay] = a.split(',').map(num => parseInt(num));
  const [bx, by] = b.split(',').map(num => parseInt(num));

  return Math.abs(ax - bx) + Math.abs(ay - by);
}

const isValid = (grid, pos) => {
  return (
    pos.x >= 0 &&
    pos.x < grid[0].length &&
    pos.y >= 0 &&
    pos.y < grid.length &&
    grid[pos.y][pos.x] !== "#"
  );
}

function findEnd(grid) {
  let ending = { x: 0, y: 0 };
  for (let y = 0; y < grid[0].length; y++) {
    for (let x = 0; x < grid.length; x++) {
      if (grid[y][x] === 'E') {
        ending = { x, y };
        grid[y][x] = '.';
      }
    }
  }
  return ending;
}

function search(grid, { x, y }) {
  const queue = [];
  const distances = {};

  queue.push({ x, y, steps: 0 });
  distances[`${x},${y}`] = 0;

  while (queue.length !== 0) {
    const { x: cx, y: cy, steps: cs } = queue.shift();
    if (!cx || !cy) break;

    DIRECTIONS.forEach(({ x: dx, y: dy }) => {
      const pos = { x: cx + dx, y: cy + dy };
      if (!isValid(grid, pos)) return;

      const nd = cs + 1;
      const key = `${pos.x},${pos.y}`;
      if (distances[key] === undefined || distances[key] > nd) {
        queue.push({ ...pos, steps: nd });
        distances[`${pos.x},${pos.y}`] = nd;
      }
    });
  }

  return distances;
}

function getCheats(cheatDistance) {
  const grid = parseInput();
  const end = findEnd(grid);
  const distances = search(grid, end);

  let cheats = 0;
  const reachable = Object.keys(distances);
  for (let i = 0; i < reachable.length; i++) {
    for (let j = 0; j < reachable.length; j++) {
      if (i === j) continue;

      const [a, b] = [reachable[i], reachable[j]];
      const dist = distance(a, b);

      if (dist <= cheatDistance && distances[a] - distances[b] - dist >= 100) {
        cheats += 1;
      }
    }
  }

  return cheats;
};

// Part 1
const simpleCheats = getCheats(2);
console.log(`Part 1 Answer: ${simpleCheats}`);

// Part 2
const complexCheats = getCheats(20);
console.log(`Part 2 Answer: ${complexCheats}`);
