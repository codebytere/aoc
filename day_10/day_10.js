const fs = require('node:fs');
const path = require('node:path');

function parseInput() {
  const inputPath = path.join(__dirname, 'input.txt');
  const txt = fs.readFileSync(inputPath, 'utf8').trim();
  return txt.split('\n').map(line => line.split('').map(n => parseInt(n, 10)));
}

const input = parseInput();

// Part 1
const DIR_TO_COORD = {
  E: [1, 0],
  W: [-1, 0],
  N: [0, 1],
  S: [0, -1],
};

function checkDirectionScore(grid, pos) {
  let [x, y] = pos;
  const stack = [{ x, y, idx: 0 }];
  const seen = new Set();
  let score = 0;

  while (stack.length > 0) {
    const { x, y, idx } = stack.pop();

    if (idx === 9 && !seen.has(`${x},${y}`)) {
      seen.add(`${x},${y}`);
      score += 1;
      continue;
    }

    for (const dir of ['N', 'E', 'S', 'W']) {
      const [dx, dy] = DIR_TO_COORD[dir];
      const nx = x + dx;
      const ny = y + dy;
      const next = grid[nx]?.[ny];

      if (next === idx + 1) {
        stack.push({ x: nx, y: ny, idx: idx + 1 });
      }
    }
  }

  return score;
}

function calculateTrailHeadScores(grid) {
  let totalScore = 0;
  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid[x].length; y++) {
      if (grid[x][y] === 0) {
        totalScore += checkDirectionScore(grid, [x, y]);
      }
    }
  }
  return totalScore;
}

const score = calculateTrailHeadScores(input);
console.log(`Part 1 Answer: ${score}`);

// Part 2
function checkDirectionRating(grid, pos) {
  let [x, y] = pos;
  const stack = [{ x, y, idx: 0 }];
  let score = 0;

  while (stack.length > 0) {
    const { x, y, idx } = stack.pop();

    if (idx === 9) {
      score += 1;
      continue;
    }

    for (const dir of ['N', 'E', 'S', 'W']) {
      const [dx, dy] = DIR_TO_COORD[dir];
      const nx = x + dx;
      const ny = y + dy;
      const next = grid[nx]?.[ny];

      if (next === idx + 1) {
        stack.push({ x: nx, y: ny, idx: idx + 1 });
      }
    }
  }

  return score;
}

function calculateTrailHeadRatings(grid) {
  let totalScore = 0;
  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid[x].length; y++) {
      if (grid[x][y] === 0) {
        totalScore += checkDirectionRating(grid, [x, y]);
      }
    }
  }
  return totalScore;
}

const rating = calculateTrailHeadRatings(input);
console.log(`Part2  Answer: ${rating}`);
