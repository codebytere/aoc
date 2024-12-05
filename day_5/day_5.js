const fs = require('node:fs');
const path = require('node:path');

function parseInput() {
  const inputPath = path.join(__dirname, 'input.txt');
  const txt = fs.readFileSync(inputPath, 'utf8').trim().split('\n');
  const rules = txt.slice(0, txt.indexOf(''));
  const updates = txt.splice(txt.indexOf('') + 1).map(u => u.split(','))
  return { rules, updates }
}

const input = parseInput();

// Part 1
function checkFollowsRules(pageRules, update) {
  for (const rule of pageRules) {
    const [a,b] = rule.split('|');
    if (!update.includes(a) || !update.includes(b)) {
      continue;
    }
    if (update.indexOf(a) > update.indexOf(b)) {
      return false;
    }
  }
  return true;
}

function tallyCorrectUpdates(data) {
  const { rules, updates } = data;

  const validUpdates = updates.filter(update => checkFollowsRules(rules, update))
  return validUpdates.reduce((total, update) => {
    const middleIndex = Math.floor(update.length / 2);
    total += parseInt(update[middleIndex], 10);
    return total;
  }, 0);
}

const correctUpdateCount = tallyCorrectUpdates(input);
console.log(`Part 1 Answer: ${correctUpdateCount}`);

// Part 2
function fixBadUpdate(pageRules, update) {
  const graph = new Map();
  const inDegree = new Map();

  for (const page of update) {
    graph.set(page, []);
    inDegree.set(page, 0);
  }

  for (const rule of pageRules) {
    const [from, to] = rule.split('|');
    if (graph.has(from) && graph.has(to)) {
      graph.get(from).push(to);
      inDegree.set(to, inDegree.get(to) + 1);
    }
  }

  const queue = [];
  for (const [node, degree] of inDegree.entries()) {
    if (degree === 0) queue.push(node);
  }

  const sorted = [];
  while (queue.length > 0) {
    const current = queue.shift();
    sorted.push(current);

    for (const neighbor of graph.get(current)) {
      inDegree.set(neighbor, inDegree.get(neighbor) - 1);
      if (inDegree.get(neighbor) === 0) queue.push(neighbor);
    }
  }

  const orderMap = new Map(sorted.map((page, idx) => [page, idx]));
  update.sort((a, b) => orderMap.get(a) - orderMap.get(b));

  return update;
}

function tallyFixedBadUpdates(data) {
  const { rules, updates } = data;

  const fixBadUpdates = updates
                          .filter(update => !checkFollowsRules(rules, update))
                          .map(update => fixBadUpdate(rules, update));
  return fixBadUpdates.reduce((total, update) => {
    const middleIndex = Math.floor(update.length / 2);
    total += parseInt(update[middleIndex], 10);
    return total;
  }, 0);
}

const correctedUpdateCount = tallyFixedBadUpdates(input);
console.log(`Part 2 Answer: ${correctedUpdateCount}`);