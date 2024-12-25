const fs = require('node:fs');
const { get } = require('node:http');
const path = require('node:path');

function parseInput() {
  const inputPath = path.join(__dirname, 'input.txt');
  const txt = fs.readFileSync(inputPath, 'utf8').trim();
  return txt.split('\n');
}

const PRUNE_NUM= 16777216;

const input = parseInput();

const mod = (a, b) => ((a % b) + b) % b;

function createKey(deltas, index) {
  return [
    deltas[index - 3],
    deltas[index - 2],
    deltas[index - 1],
    deltas[index],
  ].map(String).join('|');
}

function getNextSecret(secret) {
  const mult = secret * 64;
  const mix1 = mult ^ secret;
  secret = mod(mix1, PRUNE_NUM);
  const div = Math.floor(secret / 32);
  const mix2 = div ^ secret;
  secret = mod(mix2, PRUNE_NUM);
  const shift = secret * 2048;
  const mix3 = shift ^ secret;
  secret = mod(mix3, PRUNE_NUM);
  return secret;
}

function getNthSecret(initial, times = 1) {
  const next = [initial];
  let secret = parseInt(initial, 10);

  for (let i = 0; i < times; i++) {
    secret = getNextSecret(secret);
    next.push(secret.toString());
  }

  return next;
}

function getSecretTotal(secrets, times = 1) {
  return secrets.reduce((acc, secret) => {
    const nth = getNthSecret(secret, times);
    return acc + parseInt(nth[nth.length - 1], 10);
  }, 0);
}

function getPriceChangeSequences(secrets) {
  const map = secrets.reduce((map, secret) => {
    const prices = [secret % 10];
    const deltas = [];
    const sequences = new Set();

    for (let i = 0; i < 2000; i++) {
      secret = getNextSecret(secret);

      const current = secret % 10;
      prices.push(current);

      const delta = current - prices[prices.length - 2];
      deltas.push(delta);

      if (i >= 3) {
        const key = createKey(deltas, i);
        if (!sequences.has(key)) {
          sequences.add(key);
          const val = map.get(key) ?? 0;
          map.set(key, val + prices[i + 1]);
        }
      }
    }

    return map;
  }, new Map());

  return Math.max(...map.values());
}

// Part 1
const secretTotal = getSecretTotal(input, 2000);
console.log(`Part 1 Answer: ${secretTotal}`);

// Part 2
const bestPrice = getPriceChangeSequences(input);
console.log(`Part 2 Answer: ${bestPrice}`);
