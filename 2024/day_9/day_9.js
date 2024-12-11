const fs = require('node:fs');
const path = require('node:path');

function parseInput() {
  const inputPath = path.join(__dirname, 'input.txt');
  return fs.readFileSync(inputPath, 'utf8').trim();
}

// Part 1
function calculateChecksum() {
  const input = parseInput().split('')
  let diskMap = input.length % 2 === 0 ? input.slice(0, -1) : input;

  diskMap = diskMap.flatMap((n, i) =>
    Array.from({ length: n }, () => (i % 2 === 0 ? Math.floor(i / 2) : null))
  );

  let left = 0;
  let right = diskMap.length - 1;

  while (left < right) {
    const [l, r] = [diskMap[left], diskMap[right]];

    if (r === null) {
      right--;
    } else if (l === null) {
      [diskMap[left], diskMap[right]] = [diskMap[right], diskMap[left]];
      left++;
      right--;
    } else {
      left++;
    }
  }

  return diskMap
    .map((v, i) => ({ i, v }))
    .filter(({ v }) => v !== null)
    .reduce((sum, { i, v }) => sum + i * v, 0);
}

const checksum = calculateChecksum();
console.log(`Part 1 Answer: ${checksum}`);

// Part 2
function transformInput(input) {
  const files = [];
  const freeSpaces = [];
  let fileNumber = 0;
  let memAddr = 0;
  let fileNext = true;

  for (const char of input.trim()) {
    const size = parseInt(char, 10);
    if (fileNext) {
      files.push([fileNumber, memAddr, size]);
      fileNumber++;
      memAddr += size;
      fileNext = false;
    } else {
      freeSpaces.push([memAddr, size]);
      memAddr += size;
      fileNext = true;
    }
  }

  return { files, freeSpaces };
}

function computeChecksum(startAddr, size, fileNumber) {
  const endAddr = startAddr + size - 1;
  const sumRange = ((endAddr * (endAddr + 1)) - (startAddr * (startAddr - 1))) / 2;
  return sumRange * fileNumber;
}

function compactAndChecksum() {
  const input = parseInput();
  const { files, freeSpaces } = transformInput(input);

  let checksum = 0;
  const sortedFiles = [...files].reverse();

  for (const [fileNumber, fileAddr, fileSize] of sortedFiles) {
    let fileMoved = false;

    for (let i = 0; i < freeSpaces.length; i++) {
      let [spaceAddr, spaceSize] = freeSpaces[i];

      if (spaceAddr > fileAddr) break;

      if (fileSize === spaceSize) {
        checksum += computeChecksum(spaceAddr, fileSize, fileNumber);
        freeSpaces.splice(i, 1);
        fileMoved = true;
        break;
      } else if (fileSize < spaceSize) {
        checksum += computeChecksum(spaceAddr, fileSize, fileNumber);
        freeSpaces[i] = [spaceAddr + fileSize, spaceSize - fileSize];
        fileMoved = true;
        break;
      }
    }

    if (!fileMoved) {
      checksum += computeChecksum(fileAddr, fileSize, fileNumber);
    }
  }

  return checksum;
}

const compactChecksum = compactAndChecksum();
console.log(`Part 2 Answer: ${compactChecksum}`);
