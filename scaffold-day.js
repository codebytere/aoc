const fs = require('node:fs');
const path = require('node:path');

const red = (s) => `\x1b[31m${s}\x1b[0m`;
const bright = (s) => `\x1b[1m${s}\x1b[0m`;
const green = (s) => `\x1b[32m${s}\x1b[0m`;
const blue = (s) => `\x1b[34m${s}\x1b[0m`;

const success = green(bright('✓'));
const fail = red(bright('✗'));
const info = blue(bright('ℹ'));

const date = new Date();
const day = date.getDate();
const year = date.getFullYear().toString();

function createScaffolding() {
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
    fs.writeFileSync(dayPath, '');

    console.log(`${info} Creating input file: ${blue(inputPath)}`);
    fs.writeFileSync(inputPath, '');

    console.log(`${info} Creating sample input file: ${blue(sampleInputPath)}`);
    fs.writeFileSync(sampleInputPath, '');

    console.log(`${success} Created scaffold for day ${day} of ${year}`);
  } else {
    console.log(`${fail} Scaffold for day ${day} in ${year} already exists`);
  }
}

try {
  createScaffolding();
} catch (e) {
  console.error(`${fail} Failed to create scaffold for day ${day} in ${year}`, e);
}
