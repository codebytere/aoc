const fs = require('node:fs');
const path = require('node:path');

function parseInput() {
  const inputPath = path.join(__dirname, 'input.txt');
  return fs.readFileSync(inputPath, 'utf8').trim();
}

const instructions = parseInput();

// Part 1
// Sample Input: xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))
function totalValidMuls(instructions) {
  const mulPattern = /mul\((\d+,\d+)\)/g;
  const muls = instructions.matchAll(mulPattern);

  let total = 0;
  for (const mul of muls) {
    const [a, b] = mul[1].split(',').map(x => parseInt(x, 10));
    total += a * b;
  }
  return total;
}

const total = totalValidMuls(instructions);
console.log(`Part 1 Answer: ${total}`);

// Part 2
// Sample Input: xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))
function totalEnabledMuls(instructions) {
  let total = 0;
  let type = 'do';
  let toConsume = instructions;

  while (toConsume.length > 0) {
    let match = null;
    if (type === 'dont') {
      match = /do\(\)/g.exec(toConsume);
      if (match) {
        toConsume = toConsume.slice(match.index + match[0].length);
        type = 'do';
      }
    } else {
      match = /don't\(\)/g.exec(toConsume);
      if (match) {
        const chunk = toConsume.slice(0, match.index);
        total += totalValidMuls(chunk);
        toConsume = toConsume.slice(match.index + match[0].length);
        type = 'dont';
      }
    }

    if (!match) {
      if (type === 'do') {
        total += totalValidMuls(toConsume);
      }
      break;
    }
  }
  return total;
}

const enabledTotal = totalEnabledMuls(instructions);
console.log(`Part 2 Answer: ${enabledTotal}`);
