const fs = require('fs');
const path = require('path');

function parseInput() {
  const inputPath = path.join(__dirname, 'input.txt');
  const txt = fs.readFileSync(inputPath, 'utf8').trim();
  return txt.split('\n').map((line) => line.split('-'));
}

const input = parseInput();

function getCombinations(arr, length) {
  const result = [];
  const combine = (start, combo) => {
    if (combo.length === length) {
      if (combo.some((c) => c.startsWith('t'))) {
        result.push(combo);
      }
      return;
    }
    for (let i = start; i < arr.length; i++) {
      combine(i + 1, combo.concat([arr[i]]));
    }
  };
  combine(0, []);
  return result;
}

function isValidSubgraph(subgraph) {
  const [a, b, c] = subgraph;
  const pairs = new Set(input.map(pair => pair.join('-')));

  const p1 = pairs.has(`${a}-${b}`) || pairs.has(`${b}-${a}`);
  const p2 = pairs.has(`${a}-${c}`) || pairs.has(`${c}-${a}`);
  const p3 = pairs.has(`${b}-${c}`) || pairs.has(`${c}-${b}`);
  return p1 && p2 && p3;
}

function findTComputerGroups(computers) {
  const computersSet = new Set(computers.flat());
  const combinations = getCombinations(Array.from(computersSet), 3);
  return combinations.filter(isValidSubgraph)
}

function buildAdjacencyList(pairs) {
  const adjacencyList = new Map();

  pairs.forEach(([a, b]) => {
    if (!adjacencyList.has(a)) adjacencyList.set(a, new Set());
    if (!adjacencyList.has(b)) adjacencyList.set(b, new Set());
    adjacencyList.get(a).add(b);
    adjacencyList.get(b).add(a);
  });

  return adjacencyList;
}

function processNodes(R, P, X, adjacencyList, cliques) {
  if (P.size === 0 && X.size === 0) {
    cliques.push(new Set(R));
    return;
  }

  const PArray = Array.from(P);
  for (const v of PArray) {
    const neighbors = adjacencyList.get(v) || new Set();
    processNodes(
      new Set([...R, v]),
      new Set([...P].filter(x => neighbors.has(x))),
      new Set([...X].filter(x => neighbors.has(x))),
      adjacencyList,
      cliques
    );
    P.delete(v);
    X.add(v);
  }
}

function findLargestClique(adjacencyList) {
  const nodes = Array.from(adjacencyList.keys());
  const cliques = [];
  processNodes(new Set(), new Set(nodes), new Set(), adjacencyList, cliques);
  let largestClique = [];
  for (const clique of cliques) {
    if (clique.size > largestClique.length) {
      largestClique = Array.from(clique);
    }
  }
  return largestClique;
}

function findLANPassword() {
  const adjacencyList = buildAdjacencyList(input);
  const largestClique = findLargestClique(adjacencyList);
  return largestClique.sort();
}

// Part 1
const groups = findTComputerGroups(input);
console.log(`Part 1 Answer: ${groups.length}`);

// Part 2
const pwd = findLANPassword();
console.log(`Part 2 Answer: ${pwd}`);
