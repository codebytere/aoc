const fs = require('node:fs');
const path = require('node:path');

function parseInput() {
  const inputPath = path.join(__dirname, 'input.txt');
  const input = fs.readFileSync(inputPath, 'utf8');

  const one = [];
  const two = [];
  input.trim().split('\n').map((line) => {
    const [a, b] = line.split('   ');
    one.push(a);
    two.push(b);
  });
  return { one, two };
}

const { one, two } = parseInput();

// Part 1
function getDistance(a, b) {
  const sortedLeft = a.sort((a, b) => a - b);
  const sortedRight = b.sort((a, b) => a - b);

  return sortedLeft.reduce((acc, leftValue, index) => {
    const rightValue = sortedRight[index];
    return acc + Math.abs(rightValue - leftValue);
  }, 0);
}

console.log(`Part 1 Answer: ${getDistance(one, two)}`);

// Part 2
function getSimilarityScore(one, two) {
  const map = new Map();
  two.map((value) => map.set(value, map.has(value) ? map.get(value) + 1 : 1));

  let score = 0;
  one.forEach(num => {
    if (map.has(num)) {
      score += map.get(num) * num;
    }
  });
  return score;
}

console.log(`Part 2 Answer: ${getSimilarityScore(one, two)}`);