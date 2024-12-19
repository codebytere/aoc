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

function canBuildTarget(target, components, index = 0) {
  if (index === target.length) return true;

  for (const component of components) {
    if (target.substring(index, index + component.length) === component) {
      if (canBuildTarget(target, components, index + component.length)) {
        return true;
      }
    }
  }

  return false;
}

function findPossibleDesigns() {
  let numPossibleDesigns = 0;
  for (const design of input.designs) {
    if (canBuildTarget(design, input.patterns)) {
      numPossibleDesigns++;
    }
  }
  return numPossibleDesigns;
}

// Part 1
const numPossibleDesigns = findPossibleDesigns();
console.log(`Part 1 Answer: ${numPossibleDesigns}`);
