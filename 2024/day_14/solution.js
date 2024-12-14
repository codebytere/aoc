const fs = require('node:fs');
const path = require('node:path');

function parseInput() {
  const inputPath = path.join(__dirname, 'input.txt');
  const txt = fs.readFileSync(inputPath, 'utf8').trim();
  return txt.split('\n').map((line) => {
    const regex = /^p=(-?\d+,-?\d+) v=(-?\d+,-?\d+)$/;
    const match = line.match(regex);
    if (match) {
      return {
        position: match[1].split(',').map(Number),
        velocity: match[2].split(',').map(Number),
      };
    }
  });
}

const input = parseInput();

const BOARD_SIZE = { width: 101, height: 103 };
const mod = (a, b) => ((a % b) + b) % b;

const getQuadrant = ([x, y], { width, height }) => {
  const xMid = width / 2;
  const yMid = height / 2;

  if (x === Math.floor(xMid) || y === Math.floor(yMid)) {
    return false;
  }

  const horiz = x < xMid ? 'W' : 'E';
  const vert = y < yMid ? 'N' : 'S';

  return vert + horiz;
}

function getRobotSafetyFactor(data, seconds = 0) {
  const { width, height } = BOARD_SIZE;

  const quadrants = { NW: 0, NE: 0, SW: 0, SE: 0 };

  data.map(({ position, velocity }) => {
    const [px, py] = position;
    const [vx, vy] = velocity;

    const endPosition = [
      mod((px + (vx * seconds)), width),
      mod((py + (vy * seconds)), height),
    ];

    const quadrant = getQuadrant(endPosition, BOARD_SIZE);
    if (quadrant) quadrants[quadrant]++;
  });

  return Object.values(quadrants).reduce((acc, quadrant) => {
    acc *= quadrant;
    return acc;
  }, 1);
}

function getChristmasTreePosition(data) {
  const { width, height } = BOARD_SIZE;

  for (let second = 1; second < 10000000; second++) {
    data = data.map(({ position, velocity }) => {
      const [px, py] = position;
      const [vx, vy] = velocity;

      return {
        position: [
          mod(px + vx, width),
          mod(py + vy, height),
        ],
        velocity,
      }
    });

    const positions = new Set(data.map(({ position }) => {
      return `${position[0]},${position[1]}`;
    }));

    if (positions.size === data.length) {
      return second;
    }
  }
}

// Part 1
const safetyFactor = getRobotSafetyFactor(input, 100);
console.log(`Part 1 Answer: ${safetyFactor}`);

// Part 2
const secondsToChristmas = getChristmasTreePosition(input);
console.log(`Part 2 Answer: ${secondsToChristmas}`);
