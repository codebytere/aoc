const fs = require('node:fs');
const path = require('node:path');

function parseInput() {
  const inputPath = path.join(__dirname, 'input.txt');
  const txt = fs.readFileSync(inputPath, 'utf8').trim();
  return txt.split('\n').map((line) => {
    return line.split('x').map(Number);
  });
}

const input = parseInput();

function getTotalWrappingPaper() {
  return input.reduce((acc, [l, w, h]) => {
    const sides = [l * w, w * h, h * l];
    const smallestSide = Math.min(...sides);
    return acc + 2 * sides.reduce((a, b) => a + b) + smallestSide;
  }, 0);
}

function getTotalRibbonLength() {
  return input.reduce((acc, [l, w, h]) => {
    const smallestPerimeter = Math.min(2 * (l + w), 2 * (w + h), 2 * (h + l));
    const volume = l * w * h;
    return acc + smallestPerimeter + volume;
  }, 0);
}


// Part 1
const totalWrappingPaper = getTotalWrappingPaper();
console.log(`Part 1 Answer ${totalWrappingPaper}`);

// Part 2
const totalRibbonLength = getTotalRibbonLength();
console.log(`Part 2 Answer ${totalRibbonLength}`);