const fs = require('node:fs');
const path = require('node:path');

const red = (s) => `\x1b[31m${s}\x1b[0m`;
const bright = (s) => `\x1b[1m${s}\x1b[0m`;
const green = (s) => `\x1b[32m${s}\x1b[0m`;
const blue = (s) => `\x1b[34m${s}\x1b[0m`;

const success = green(bright('✓'));
const fail = red(bright('✗'));
const info = blue(bright('ℹ'));

function getDay(argv) {
  if (argv.length === 0) {
    const date = new Date();
    return {
      day: date.getDate(),
      year: date.getFullYear().toString()
    };
  }

  const [ day, year ] = argv;
  if (isNaN(Number(day)) || isNaN(Number(year))) {
    console.error(`${fail} Invalid day or year provided: ${argv}`);
    process.exit(1);
  }

  return { day, year };
}

function createScaffolding({ day, year }) {
  try {
    // Create the directory if it doesn't exist.
    const yearPath = path.join(__dirname, year);
    if (!fs.existsSync(yearPath)) {
      console.log(`${info} Creating directory: ${blue(yearPath)}`);
      fs.mkdirSync(yearPath);
    }

    // Create a directory for the day if it doesn't exist.
    const dayDir = path.join(yearPath, `day_${day}`);
    if (!fs.existsSync(dayDir)) {
      console.log(`${info} Creating directory: ${blue(dayDir)}`);
      fs.mkdirSync(dayDir);

      // Create files for each component of the solution.
      const dayPath = path.join(dayDir, 'solution.js');
      const inputPath = path.join(dayDir, 'input.txt');
      const sampleInputPath = path.join(dayDir, 'sample-input.txt');

      console.log(`${info} Creating solution file: ${blue(dayPath)}`);
      fs.writeFileSync(dayPath,
        `const fs = require('node:fs');
const path = require('node:path');

function parseInput() {
  const inputPath = path.join(__dirname, 'input.txt');
  const txt = fs.readFileSync(inputPath, 'utf8').trim();
  // Todo: Implement remaining parsing logic
}

const input = parseInput();
`);

      console.log(`${info} Creating input file: ${blue(inputPath)}`);
      fs.writeFileSync(inputPath, '');

      console.log(`${info} Creating sample input file: ${blue(sampleInputPath)}`);
      fs.writeFileSync(sampleInputPath, '');

      console.log(`${success} Created scaffold for day ${day} of ${year}`);
    } else {
      console.log(`${fail} Scaffold for day ${day} in ${year} already exists`);
    }
  } catch (e) {
    console.error(`${fail} Failed to create scaffold for day ${day} in ${year}`, e);
  }
}

if (process.argv?.[2] === '--help') {
  console.log(`Usage: scaffold-day [day] [year]`);
  process.exit(0);
}

const dayInfo = getDay(process.argv.slice(2));
createScaffolding(dayInfo);
