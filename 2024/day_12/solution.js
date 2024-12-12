const fs = require('node:fs');
const path = require('node:path');

function parseInput() {
  const inputPath = path.join(__dirname, 'input.txt');
  const txt = fs.readFileSync(inputPath, 'utf8').trim();
  return txt.split('\n').map((line) => line.split(''));
}

const DIR_TO_COORD = {
  'N': [0, -1],
  'E': [1, 0],
  'S': [0, 1],
  'W': [-1, 0],
}

function calculatePerimeter(points) {
  const pointSet = new Set(points);
  let perimeter = 0;

  for (const point of points) {
    const [x, y] = point.split(',').map(Number);

    const neighbors = [
      `${x - 1},${y}`,
      `${x + 1},${y}`,
      `${x},${y - 1}`,
      `${x},${y + 1}`,
    ];

    for (const neighbor of neighbors) {
      if (!pointSet.has(neighbor)) {
        perimeter++;
      }
    }
  }

  return perimeter;
}

function calculateNumSides(points) {
  const grp = new Set(points);
  let seen = new Set();
  let corners = 0;

  for (const point of grp) {
    const [y, x] = point.split(',').map(Number);

    for (const [dy, dx] of Object.values(DIR_TO_COORD)) {
      const neighborKey = `${y + dy},${x + dx}`;
      if (grp.has(neighborKey)) continue;

      let cy = y;
      let cx = x;
      while (grp.has(`${cy + dx},${cx + dy}`) && !grp.has(`${cy + dy},${cx + dx}`)) {
        cy += dx;
        cx += dy;
      }

      const key = `${cy},${cx},${dy},${dx}`;
      if (!seen.has(key)) {
        seen.add(key);
        corners += 1;
      }
    }
  }

  return corners;
}

function explore(letter, pos, grid, calcFn) {
  let [x, y] = pos;
  const queue = [{ x, y }];
  const seen = new Set();
  const key = (x, y) => `${x},${y}`;

  while (queue.length > 0) {
    const { x, y } = queue.shift();

    if (seen.has(key(x, y))) continue;
    seen.add(key(x, y));
    grid[x][y] = '.';

    for (const dir of ['N', 'E', 'S', 'W']) {
      const [dx, dy] = DIR_TO_COORD[dir];
      const nx = x + dx;
      const ny = y + dy;
      const next = grid[nx]?.[ny];

      if (next === letter) {
        queue.push({ x: nx, y: ny });
      }
    }
  }

  const val = calcFn(seen);
  return { grid, price: val * seen.size };
}

function calculatePlantPrices(calcFn) {
  let grid = parseInput();
  let price = 0;
  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid[x].length; y++) {
      const letter = grid[x][y];
      if (letter !== '.') {
        const result = explore(letter, [x, y], grid, calcFn);
        grid = result.grid;
        price += result.price;
      }
    }
  }
  return price;
}

// Part 1
const perimeterPlantPrice = calculatePlantPrices(calculatePerimeter);
console.log(`Part 1 Answer: ${perimeterPlantPrice}`);

// Part 2
const sidesPlantPrice = calculatePlantPrices(calculateNumSides);
console.log(`Part 2 Answer: ${sidesPlantPrice}`);
