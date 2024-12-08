const fs = require('node:fs');
const path = require('node:path');

function parseInput() {
  const inputPath = path.join(__dirname, 'input.txt');
  const txt = fs.readFileSync(inputPath, 'utf8').trim();
  return txt.split('\n').map(line => {
    const parts = line.split(':');
    const components = parts[1].trim().split(' ').map(v => parseInt(v, 10));
    return { value: parseInt(parts[0]), components };
  });
}

// Part 1
function evaluateA(expression) {
  const parts = expression.split(' ');
  let total = parseInt(parts[0], 10);
  for (let i = 1; i < parts.length; i += 2) {
    const operator = parts[i];
    const operand = parseInt(parts[i + 1], 10);
    if (operator === '+') {
      total += operand;
    } else if (operator === '*') {
      total *= operand;
    }
  }
  return total;
}

function computePossibleOperatorsA() {
  const data = parseInput();
  const operators = ['+', '*'];

  let total = 0;
  for (const { value, components } of data) {
    const numGaps = components.length - 1;
    const numCombinations = 1 << numGaps;

    for (let i = 0; i < numCombinations; i++) {
      let expression = `${components[0]}`;
      for (let j = 0; j < numGaps; j++) {
        const operator = (i & (1 << j)) ? operators[1] : operators[0];
        expression += ` ${operator} ${components[j + 1]}`;
      }

      if (value === evaluateA(expression)) {
        total += value;
        break;
      }
    }
  }
  return total;
}

const totalA = computePossibleOperatorsA();
console.log(`Part 1 Answer: ${totalA}`);

// Part 2
function evaluateB(expression) {
  const parts = expression.split(' ');
  let total = parseInt(parts[0], 10);
  for (let i = 1; i < parts.length; i += 2) {
    const operator = parts[i];
    const operand = parseInt(parts[i + 1], 10);
    if (operator === '||') {
      total = parseInt(`${total}${operand}`, 10);
    } else if (operator === '+') {
      total += operand;
    } else if (operator === '*') {
      total *= operand;
    }
  }
  return total;
}

function computePossibleOperatorsB() {
  const data = parseInput();
  const operators = ['+', '*', '||'];

  let total = 0;
  for (const { value, components } of data) {
    const numGaps = components.length - 1;
    const numCombinations = Math.pow(3, numGaps);

    for (let i = 0; i < numCombinations; i++) {
      let expression = `${components[0]}`;
      let combination = i;
      for (let j = 0; j < numGaps; j++) {
        const operatorIndex = combination % 3;
        combination = Math.floor(combination / 3);
        const operator = operators[operatorIndex];
        expression += ` ${operator} ${components[j + 1]}`;
      }

      if (value === evaluateB(expression)) {
        total += value;
        break;
      }
    }
  }
  return total;
}

const totalB = computePossibleOperatorsB();
console.log(`Part 2 Answer: ${totalB}`);
