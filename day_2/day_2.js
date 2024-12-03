const fs = require('node:fs');
const path = require('node:path');

function parseInput() {
  const inputPath = path.join(__dirname, 'input.txt');
  const input = fs.readFileSync(inputPath, 'utf8').trim();

  return input.split('\n').map((line) => {
    const levels = line.split(' ');
    return levels.map((level) => parseInt(level, 10));
  });
}

const reports = parseInput();

// Part 1
/* Sample Input
  7 6 4 2 1
  1 2 7 8 9
  9 7 6 2 1
  1 3 2 4 5
  8 6 4 4 1
  1 3 6 7 9
*/
function checkIsSafe(report) {
  let direction = null;
  for (let i = 0; i < report.length - 1; i++) {
    const diff = Math.abs(report[i] - report[i + 1]);
    if (diff === 0 || diff > 3) return false;

    const currentDirection = report[i + 1] > report[i] ? 'increasing' : 'decreasing';
    if (direction && direction !== currentDirection) return false;
    direction = currentDirection;
  }
  return true;
}

const safeReports = reports.filter(checkIsSafe);
console.log(`Part 1 Answer: ${safeReports.length}`);

// Part 2
/* Sample Input
  7 6 4 2 1
  1 2 7 8 9
  9 7 6 2 1
  1 3 2 4 5
  8 6 4 4 1
  1 3 6 7 9
*/
function tryMakeSafe(report) {
  for (let i = 0; i < report.length; i++) {
    const newReport = [...report];
    newReport.splice(i, 1);
    if (checkIsSafe(newReport)) return true;
  }
  return false;
}

function getPossiblySafe(reports) {
  const safe = [];
  for (const report of reports) {
    if (checkIsSafe(report) || tryMakeSafe(report)) {
      safe.push(report);
    }
  }
  return safe;
}

const possiblySafeReports = getPossiblySafe(reports);
console.log(`Part 2 Answer: ${possiblySafeReports.length}`);
