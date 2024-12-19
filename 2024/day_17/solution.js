const fs = require('node:fs');
const path = require('node:path');

function parseInput() {
  const inputPath = path.join(__dirname, 'input.txt');
  const txt = fs.readFileSync(inputPath, 'utf8').trim();
  const [registerData, programData] = txt.split('\n\n');
  
  const registers = {};
  registerData.split('\n').map(line => {
     const rMatch = /Register (\w): (\d+)/g.exec(line);
    if (rMatch) registers[rMatch[1]] = BigInt(rMatch[2]);
  });

  const pMatch = /Program: ((?:\d+,?)+)/.exec(programData);
  const program = pMatch ? pMatch[1].split(',').map(BigInt) : [];

  return { registers, program };
}

let ip = 0;
let output = [];
let registers = {};
let program = [];

const getComboOperand = (operand) => {
  if (operand < 4n) return operand;
  if (operand === 4n) return registers.A;
  if (operand === 5n) return registers.B;
  if (operand === 6n) return registers.C;

  throw new Error('Invalid operand');
};

function runProgram(outIndex = 0n, check = false) {
  ip = 0n;
  output = [];
  registers.B = 0n;
  registers.C = 0n;
  const end = BigInt(program.length);

  while (ip < end) {
    const instruction = program[Number(ip)];
    const opcode = program[Number(ip) + 1];

    if (instruction === 0n) {
      registers.A = registers.A >> getComboOperand(opcode);
    } else if (instruction === 1n) {
      registers.B ^= opcode;
    } else if (instruction === 2n) {
      registers.B = getComboOperand(opcode) % 8n;
    } else if (instruction === 3n) {
      if (registers.A !== 0n) {
        ip = opcode;
        continue;
      }
    } else if (instruction === 4n) {
      registers.B ^= registers.C;
    } else if (instruction === 5n) {
      const result = getComboOperand(opcode) % 8n;
      output.push(result);
      if (check && result !== program[Number(outIndex)]) {
        return false;
      }
      outIndex += 1n;
    } else if (instruction === 6n) {
      registers.B = registers.A >> getComboOperand(opcode);
    } else {
      registers.C = registers.A >> getComboOperand(opcode);
    }
    ip += 2n;
  }

  return outIndex === end;
}

const findInitialA = () => {
  const inProgress = [[0n, BigInt(program.length) - 1n]];
  while (inProgress.length > 0) {
    const [a, distance] = inProgress.shift();
    for (let chunk = 0n; chunk < 8n; chunk++) {
      const nextA = (a << 3n) + chunk;
      registers.A = nextA;
      if (!runProgram(distance, true)) continue;
      if (distance === 0n) return nextA;
      inProgress.push([nextA, distance - 1n]);
    }
  }

  return null;
};

const input = parseInput();
program = input.program;
registers = input.registers;

// Part 1
runProgram();
console.log(`Part 1 Answer: ${output.join(',')}`);

// Part 2
const selfModifyingProgram = findInitialA();
console.log(`Part 2 Answer: ${selfModifyingProgram}`);
