const fs = require('node:fs');
const path = require('node:path');

function parseInput() {
  const inputPath = path.join(__dirname, 'input.txt');
  const txt = fs.readFileSync(inputPath, 'utf8').trim();
  const [registerData, programData] = txt.split('\n\n');
  
  const registers = {};
  registerData.split('\n').map(line => {
     const rMatch = /Register (\w): (\d+)/g.exec(line);
    if (rMatch) registers[rMatch[1]] = parseInt(rMatch[2], 10);
  });

  const pMatch = /Program: ((?:\d+,?)+)/.exec(programData);
  const program = pMatch ? pMatch[1].split(',').map(Number) : [];

  return { registers, program };
}

let ip = 0;
let output = [];
let registers = {};

function getComboOperand(operand) {
  if ([0, 1, 2, 3].includes(operand)) {
    return operand;
  }

  if (operand === 4) return registers.A;
  if (operand === 5) return registers.B;
  if (operand === 6) return registers.C;

  throw new Error(`Invalid combo operand: ${operand}`);
}

const INSTRUCTIONS = {
  // Performs division. The numerator is the value in the
  // A register. The denominator is found by raising 2 to
  // the power of the instruction's combo operand. (So, an
  // operand of 2 would divide A by 4 (2^2); an operand of
  // 5 would divide A by 2^B.) The result of the division
  // operation is truncated to an integer and then written
  // to the A register.
  0: function adv(op) {
    const operand = getComboOperand(op);
    const [numerator, denominator] = [ registers.A, Math.pow(2, operand) ];
    const result = Math.floor(numerator / denominator);
    registers.A = result;
    return false;
  },
  // Calculates the bitwise XOR of register B and the instruction's
  // literal operand, then stores the result in register B.
  1: function bxl(operand) {
    registers.B = registers.B ^ operand;
    return false;
  },
  // Calculates the value of its combo operand modulo 8
  // (thereby keeping only its lowest 3 bits), then writes
  // that value to the B register.
  2: function bst(op) {
    const operand = getComboOperand(op);
    registers.B = operand % 8;
    return false;
  },
  // Does nothing if the A register is 0. However, if the
  // A register is not zero, it jumps by setting the instruction
  // pointer to the value of its literal operand; if this
  // instruction jumps, the instruction pointer is not increased
  // by 2 after this instruction.
  3: function jnz(operand) {
    if (registers.A === 0) return false;
    ip = operand;
    return true;
  },
  // Calculates the bitwise XOR of register B and register C,
  // then stores the result in register B. (For legacy reasons,
  // this instruction reads an operand but ignores it.)
  4: function bxc(_) {
    registers.B = registers.B ^ registers.C;
    return false;
  },
  // Calculates the value of its combo operand modulo 8, then
  // outputs that value. (If a program outputs multiple values,
  // they are separated by commas.)
  5: function out(op) {
    const operand = getComboOperand(op);
    output.push(operand % 8);
    return false;
  },
  // Works exactly like the adv instruction except that the
  // result is stored in the B register. (The numerator is
  // still read from the A register.)
  6: function bdv( op) {
    const operand = getComboOperand(op);
    const [numerator, denominator] = [ registers.A, Math.pow(2, operand) ];
    const result = Math.floor(numerator / denominator);
    registers.B = result;
    return false;
  },
  // Works exactly like the adv instruction except that the
  // result is stored in the C register. (The numerator is
  // still read from the A register.)
  7: function cdv(op) {
    const operand = getComboOperand(op);
    const [numerator, denominator] = [ registers.A, Math.pow(2, operand) ];
    const result = Math.floor(numerator / denominator);
    registers.C = result;
    return false;
  }
};

function runProgram() {
  const input = parseInput();
  registers = input.registers;
  ip = 0;

  while (ip < input.program.length) {
    const [opcode, operand] = [input.program[ip], input.program[ip + 1]];
    const jump = INSTRUCTIONS[opcode](operand);
    if (!jump) ip += 2;
  }

  return output;
}

const result = runProgram();
console.log(`Part 1 Answer: ${result.join(',')}`);
