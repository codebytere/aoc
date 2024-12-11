const fs = require('node:fs');
const path = require('node:path');

function parseInput() {
  const inputPath = path.join(__dirname, 'input.txt');
  const txt = fs.readFileSync(inputPath, 'utf8').trim();
  return txt.split('\n').map(line => line.split(''));
}

// Part 1
const isValidPosition = (grid, x, y) => {
  return x >= 0 && x < grid.length && y >= 0 && y < grid[0].length && grid[x][y] !== '#';
};

function computeTotalAntinodes() {
  const grid = parseInput();

  const antinodes = new Set();
  const nodeMap = new Map();
  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid[x].length; y++) {
      const cell = grid[x][y];
      if (cell === '.') continue;

      if (nodeMap.has(cell)) {
        const nodes = nodeMap.get(cell);
        nodeMap.set(cell, nodes);
        nodes.forEach(([nx, ny]) => {
          const [dx, dy] = [nx - x, ny - y];
          const pts = [[nx + dx, ny + dy], [x - dx, y - dy]].filter(([x, y]) => {
            return isValidPosition(grid, x, y)
          });
          pts.forEach(pt => antinodes.add(pt.join(',')));
        });
        nodes.push([x, y]);
        nodeMap.set(cell, nodes);
      } else {
        nodeMap.set(cell, [[x, y]]);
      }
    }
  }

  return antinodes.size;
}

const totalAntinodes = computeTotalAntinodes();
console.log(`Part 1 Answer: ${totalAntinodes}`);

// Part 2
function getAllNodes(p1, p2, grid) {
  let [x, y] = p1;
  let [nx, ny] = p2;
  const [dx, dy] = [nx - x, ny - y];

  const pts = [];
  while (isValidPosition(grid, nx + dx, ny + dy)) {
    pts.push([nx + dx, ny + dy])
    nx += dx;
    ny += dy;
  }

  while (isValidPosition(grid, x - dx, y - dy)) {
    pts.push([x - dx, y - dy])
    x -= dx;
    y -= dy;
  }

  return pts;
}

function computeResonantAntinodes() {
  const grid = parseInput();

  const antenna = new Set();
  const antinodes = new Set();
  const nodeMap = new Map();
  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid[x].length; y++) {
      const cell = grid[x][y];
      if (cell === '.') continue;

      antenna.add([x, y].join(','));
      if (nodeMap.has(cell)) {
        const nodes = nodeMap.get(cell);
        nodeMap.set(cell, nodes);
        nodes.forEach(([nx, ny]) => {
          const pts = getAllNodes([x, y], [nx, ny], grid);
          pts.forEach(pt => antinodes.add(pt.join(',')));
        });
        nodes.push([x, y]);
        nodeMap.set(cell, nodes);
      } else {
        nodeMap.set(cell, [[x, y]]);
      }
    }
  }

  return new Set([...antinodes, ...antenna]).size;
}

const resonantAntinodes = computeResonantAntinodes();
console.log(`Part 2 Answer: ${resonantAntinodes}`);
