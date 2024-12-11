const fs = require('node:fs');
const path = require('node:path');

function parseInput() {
  const inputPath = path.join(__dirname, 'input.txt');
  const txt = fs.readFileSync(inputPath, 'utf8').trim();
  return txt.split(' ');
}

const input = parseInput();

function calculateStoneChange(stoneArr, blinkCount) {
  const cache = new Map();

  const blink = (number, blinks) => {
    const key = `${number}:${blinks}`;
    if (cache.has(key)) {
      return cache.get(key);
    }

    if (blinks === 0) return 1;
    if (number === 0) {
      const result = blink(1, blinks - 1);
      return cache.set(key, result), result;
    }

    const str = `${number}`;
    if (str.length % 2 === 0) {
      const middle = str.length / 2;
      const r1 = blink(parseInt(str.slice(0, middle), 10), blinks - 1)
      const r2 = blink(parseInt(str.slice(middle), 10), blinks - 1);
      const total = r1 + r2;
      cache.set(key, total);
      return total;
    }
    const result = blink(number * 2024, blinks - 1);
    return cache.set(key, result), result;
  }

  return stoneArr.map((s) => parseInt(s, 10)).reduce((a, b) => {
    return a + blink(b, blinkCount) 
  }, 0);
}

// Part 1
const result1 = calculateStoneChange(input, 25);
console.log(`Part 1 Answer: ${result1}`);

// Part 2
const result2 = calculateStoneChange(input, 75);
console.log(`Part 2 Answer: ${result2}`);
