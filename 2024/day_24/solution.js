const fs = require('node:fs');
const path = require('node:path');

function parseInput() {
  const inputPath = path.join(__dirname, 'input.txt');
  const txt = fs.readFileSync(inputPath, 'utf8').trim();
  let [gates, connected] = txt.split('\n\n');

  gates = gates.split('\n').reduce((acc, gate) => {
    const [name, value] = gate.split(': ').map((str) => str.trim());
    acc[name] = parseInt(value, 10);
    return acc;
  }, {});

  connected = connected.split('\n').map((connection) => {
    const pattern = /^(?<a>[a-z0-9]{3}) (?<gate>XOR|AND|OR) (?<b>[a-z0-9]{3}) -> (?<out>[a-z0-9]{3})$/gm;
    const { groups } = pattern.exec(connection);
    return { ...groups };
  });

  return { gates, connected };
}

const input = parseInput();

const performGate = ({ gate, a, b }) => {
  if (a === undefined || b === undefined) return null;
  switch (gate) {
    case 'AND': return a & b;
    case 'OR': return a | b;
    case 'XOR': return a ^ b;
    default: throw new Error(`Invalid gate ${gate}`);
  }
};

function processGates({ gates, connected }) {
  const zs = {};

  while (connected.length) {
    const connection = connected.shift();
    const { a, gate, b, out } = connection;
    const result = performGate({
      gate,
      a: gates[a],
      b: gates[b],
    });
    if (result !== null) {
      if (out.startsWith('z')) {
        zs[out] = result;
      }
      gates[out] = result;
    } else {
      connected.push(connection);
    }
  }

  const sorted = Object.keys(zs).sort((a, b) => {
    const aNum = parseInt(a.slice(1), 10);
    const bNum = parseInt(b.slice(1), 10);
    return bNum - aNum;
  }).reduce(function (result, key) {
    result[key] = zs[key];
    return result;
  }, {});

  const binaryNum = Object.values(sorted).join('');
  return parseInt(binaryNum, 2);
}

const result = processGates(input);
console.log(`Part 1 Answer: ${result}`);