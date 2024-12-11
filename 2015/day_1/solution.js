const fs = require('node:fs');
const path = require('node:path');

function parseInput() {
  const inputPath = path.join(__dirname, 'sample_input.txt');
  return fs.readFileSync(inputPath, 'utf8').trim();
}

const instructions = parseInput();

// Part 1
function calculateFloor(steps) {
  let floor = 0;
  for (const step of steps) {
    if (step === '(') {
      floor++;
    } else {
      floor--;
    }
  }
  return floor;
}

const finalFloor = calculateFloor(instructions);
console.log(`Part 1 Answer: ${finalFloor}`);

// Part 2
function calculateBasementEntry(steps) {
  let floor = 0;
  for (let i = 0; i < steps.length; i++) {
    if (steps[i] === '(') {
      floor++;
    } else {
      floor--;
    }
    if (floor < 0) {
      return i + 1;
    }
  }
}

const basementEntry = calculateBasementEntry(instructions);
console.log(`Part 2 Answer: ${basementEntry}`);
