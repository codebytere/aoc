const fs = require('node:fs');
const path = require('node:path');

function parseInput() {
  const inputPath = path.join(__dirname, 'input.txt');
  const txt = fs.readFileSync(inputPath, 'utf8').trim();
  const [patternData, designData] = txt.split('\n\n');
 
  return {
    patterns: patternData.split(',').map(line => line.trim()),
    designs: designData.split('\n').map(line => line.trim())
  };
}

const input = parseInput();

function countWaysToBuildTarget(target, components, index = 0, memo = {}) {
  if (index === target.length) return 1;

  if (index in memo) {
    return memo[index];
  }

  let count = 0;
  for (const component of components) {
    if (target.substring(index, index + component.length) === component) {
      count += countWaysToBuildTarget(target, components, index + component.length, memo);
    }
  }

  memo[index] = count;
  return count;
}

function findPossibleDesigns(countAllDesigns) {
  let total = 0;
  for (const design of input.designs) {
    const ways = countWaysToBuildTarget(design, input.patterns);
    if (countAllDesigns) {
      total += ways;
    } else if (ways > 0) {
      total += 1;
    }
  }
  return total;
}

// Part 1
const possibleDesigns = findPossibleDesigns(false);
console.log(`Part 1 Answer: ${possibleDesigns}`);

// Part 2
const possibleArrangements = findPossibleDesigns(true);
console.log(`Part 2 Answer: ${possibleArrangements}`);
