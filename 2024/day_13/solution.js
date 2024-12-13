const fs = require('node:fs');
const path = require('node:path');

function parseInput() {
  const inputPath = path.join(__dirname, 'input.txt');
  const txt = fs.readFileSync(inputPath, 'utf8').trim();
  return txt.split('\n\n').map((section) => {
    let result = [];
    for (const line of section.split('\n')) {
      const regex = /^(Button [AB]|Prize): X[+=](\d+), Y[+=](\d+)$/;
      const match = line.match(regex);
      if (match) {
        result.push([
          parseInt(match[2]),
          parseInt(match[3]),
        ]);
      }
    }
    return result;
  });
}

const input = parseInput();

function solveCheapestClawCombo(data, prizeAddition = 0) {
  const cheapest = [];
  for (const [[ax, ay], [bx, by], prize] of data) {
    const [px, py] = prize.map(p => p + prizeAddition);
    if ([ax, ay, bx, by].some((v) => v === 0)) {
      continue;
    }

    const tb = Math.floor((ay * px - ax * py) / (ay * bx - ax * by));
    const ta = Math.floor((px - bx * tb) / ax);
    if (ax * ta + bx * tb === px && ay * ta + by * tb === py) {
      cheapest.push({ ta, tb });
    }
  }

  return cheapest.reduce((acc, { ta, tb }) => {
    acc += ta * 3 + tb;
    return acc;
  }, 0);
}

// Part 1
const cheapestCombo1 = solveCheapestClawCombo(input);
console.log(`Part 1 Answer: ${cheapestCombo1}`);

// Part 2
const cheapestCombo2 = solveCheapestClawCombo(input, 10000000000000);
console.log(`Part 2 Answer: ${cheapestCombo2}`);

