const fs = require('node:fs');
const path = require('node:path');

function parseInput() {
  const inputPath = path.join(__dirname, 'input.txt');
  const txt = fs.readFileSync(inputPath, 'utf8').trim();
  return txt.split('\n');
}

const KEYBOARD_MAP = {
  'A': {
    'A': ['A'],
    '0': ['<A'],
    '1': ['^<<A'],
    '2': ['<^A', '^<A'],
    '3': ['^A'],
    '4': ['^^<<A'],
    '5': ['<^^A', '^^<A'],
    '6': ['^^A'],
    '7': ['^^^<<A'],
    '8': ['<^^^A', '^^^<A'],
    '9': ['^^^A']
  },
  '0': {
    'A': ['>A'],
    '0': ['A'],
    '1': ['^<A'],
    '2': ['^A'],
    '3': ['^>A', '>^A'],
    '4': ['^^<A', '^<^A'],
    '5': ['^^A'],
    '6': ['^^>A', '>^^A'],
    '7': ['^^^<A'],
    '8': ['^^^A'],
    '9': ['^^^>A', '>^^^A']
  },
  '1': {
    'A': ['>>vA'],
    '0': ['>vA'],
    '1': ['A'],
    '2': ['>A'],
    '3': ['>>A'],
    '4': ['^A'],
    '5': ['^>A', '>^A'],
    '6': ['^>>A', '>>^A'],
    '7': ['^^A'],
    '8': ['^^>A', '>^^A'],
    '9': ['^^>>A', '>>^^A']
  },
  '2': {
    'A': ['>vA', 'v>A'],
    '0': ['vA'],
    '1': ['<A'],
    '2': ['A'],
    '3': ['>A'],
    '4': ['^<A', '<^A'],
    '5': ['^A'],
    '6': ['^>A', '>^A'],
    '7': ['^^<A', '<^^A'],
    '8': ['^^A'],
    '9': ['^^>A', '>^^A']
  },
  '3': {
    'A': ['vA'],
    '0': ['v<A', '<vA'],
    '1': ['<<A'],
    '2': ['<A'],
    '3': ['A'],
    '4': ['^<<A', '<<^A'],
    '5': ['^<A', '<^A'],
    '6': ['^A'],
    '7': ['<<^^A', '^^<<A'],
    '8': ['^^<A', '<^^A'],
    '9': ['^^A']
  },
  '4': {
    'A': ['>>vvA'],
    '0': ['>vvA'],
    '1': ['vA'],
    '2': ['v>A', '>vA'],
    '3': ['v>>A', '>>vA'],
    '4': ['A'],
    '5': ['>A'],
    '6': ['>>A'],
    '7': ['^A'],
    '8': ['^>A', '>^A'],
    '9': ['>>^A', '^>>A']
  },
  '5': {
    'A': ['>vvA', 'vv>A'],
    '0': ['vvA'],
    '1': ['v<A', '<vA'],
    '2': ['vA'],
    '3': ['v>A', '>vA'],
    '4': ['<A'],
    '5': ['A'],
    '6': ['>A'],
    '7': ['^<A', '<^A'],
    '8': ['^A'],
    '9': ['>^A', '^>A']
  },
  '6': {
    'A': ['vvA'],
    '0': ['vv<A', '<vvA'],
    '1': ['v<<A', '<<vA'],
    '2': ['v<A', '<vA'],
    '3': ['vA'],
    '4': ['<<A'],
    '5': ['<A'],
    '6': ['A'],
    '7': ['^<<A', '<<^A'],
    '8': ['^<A', '<^A'],
    '9': ['^A']
  },
  '7': {
    'A': ['>>vvvA'],
    '0': ['>vvvA'],
    '1': ['vvA'],
    '2': ['vv>A', '>vvA'],
    '3': ['vv>>A', '>>vvA'],
    '4': ['vA'],
    '5': ['v>A', '>vA'],
    '6': ['v>>A', '>>vA'],
    '7': ['A'],
    '8': ['>A'],
    '9': ['>>A']
  },
  '8': {
    'A': ['>vvvA', 'vvv>A'],
    '0': ['vvvA'],
    '1': ['vv<A', '<vvA'],
    '2': ['vvA'],
    '3': ['vv>A', '>vvA'],
    '4': ['v<A', '<vA'],
    '5': ['vA'],
    '6': ['v>A', '>vA'],
    '7': ['<A'],
    '8': ['A'],
    '9': ['>A']
  },
  '9': {
    'A': ['vvvA'],
    '0': ['vvv<A', '<vvvA'],
    '1': ['vv<<A', '<<vvA'],
    '2': ['vv<A', '<vvA'],
    '3': ['vvA'],
    '4': ['v<<A', '<<vA'],
    '5': ['v<A', '<vA'],
    '6': ['vA'],
    '7': ['<<A'],
    '8': ['<A'],
    '9': ['A']
  }
};

const ARROW_MAP = {
  'A': {
    'A': ['A'],
    '^': ['<A'],
    'v': ['<vA', 'v<A'],
    '<': ['v<<A', '<v<A'],
    '>': ['vA']
  },
  '^': {
    'A': ['>A'],
    '^': ['A'],
    'v': ['vA'],
    '<': ['v<A'],
    '>': ['v>A', '>vA']
  },
  'v': {
    'A': ['^>A', '>^A'],
    '^': ['^A'],
    'v': ['A'],
    '<': ['<A'],
    '>': ['>A']
  },
  '<': {
    'A': ['>>^A', '>^>A'],
    '^': ['>^A'],
    'v': ['>A'],
    '<': ['A'],
    '>': ['>>A']
  },
  '>': {
    'A': ['^A'],
    '^': ['<^A', '^<A'],
    'v': ['<A'],
    '<': ['<<A'],
    '>': ['A']
  }
};

const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (!cache.has(key)) {
      cache.set(key, fn(...args));
    }
    return cache.get(key);
  };
};

const processCommand = (command, type) => {
  let current = 'A';

  if (type === 'arrow') {
    let output = '';
    for (let button of command) {
      let actions = ARROW_MAP[current]?.[button][0];
      output += actions;
      current = button;
    }
    return output;
  } else if (type === 'number') {
    let outputs = [''];
    for (let button of command) {
      let actions = KEYBOARD_MAP[current]?.[button];
      let newOutputs = [];
      for (let output of outputs) {
        for (let action of actions) {
          newOutputs.push(output + action);
        }
      }
      outputs = newOutputs;
      current = button;
    }
    return outputs;
  }

  throw new Error('Invalid type');
};

function computeComplexity(commands, robots) {
  let total = 0;
  for (let command of commands) {
    let num = parseInt(command.split('A')[0]);
    let arrowsCommands = processCommand(command, 'number');
    let shortest = Number.MAX_SAFE_INTEGER;
    for (let arrowCommand of arrowsCommands) {
      let temp = findShortestSequence(arrowCommand, robots);
      if (temp < shortest) shortest = temp
    }
    total += shortest * num;
  }
  return total;
}

const findShortestSequence = memoize((command, numRobots, keypad = 0) => {
  if (keypad === numRobots) {
    return command.length;
  }

  let nextCommand = processCommand(command, 'arrow');
  let commandSplits = nextCommand.split('A')
    .filter((_, index, array) => index !== array.length - 1)
    .map(c => c + 'A');
  let shortest = 0;
  for (let splitCommand of commandSplits) {
    shortest += findShortestSequence(splitCommand, numRobots, keypad + 1);
  }

  return shortest;
})

const input = parseInput();

// Part 1
const simpleComplexity = computeComplexity(input, 2);
console.log(`Part 1 Answer: ${simpleComplexity}`);

// Part 2
const complexComplexity = computeComplexity(input, 25);
console.log(`Part 2 Answer: ${complexComplexity}`);
