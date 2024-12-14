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

function getRobotSafetyFactor(data, boardSize, seconds = 0) {
  const { width, height } = boardSize;

  const quadrants = { NW: 0, NE: 0, SW: 0, SE: 0 };
  const mod = (a, b) => ((a % b) + b) % b;

  data.map(({ position, velocity }) => {
    const [px, py] = position;
    const [vx, vy] = velocity;

    const endPosition = [
      mod((px + (vx * seconds)), width),
      mod((py + (vy * seconds)), height),
    ];

    const quadrant = getQuadrant(endPosition, boardSize);
    if (quadrant) quadrants[quadrant]++;
  });

  return Object.values(quadrants).reduce((acc, quadrant) => {
    acc *= quadrant;
    return acc;
  }, 1);
}

// Part 1
const BOARD_SIZE = { width: 101, height: 103 };
const SECONDS = 100;
const safetyFactor = getRobotSafetyFactor(input, BOARD_SIZE, SECONDS);
console.log(`Part 1 Answer: ${safetyFactor}`);

// Part 2

