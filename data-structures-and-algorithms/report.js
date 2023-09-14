const { plot } = require("nodeplotlib");
const { countingSort } = require("./counting-sort");
const { Bst } = require("./bst");
const { 
    generateRandomArray, 
    generateRandomSorterArray, 
    generateSameArray, 
    generateStepArray, 
    randomInt,
    generateLargeRangeArray
} = require("./generator");
const { performance } = require('perf_hooks');

const SIZE = 10000;

const CR = [];
const CRL = [];
const CRS = [];
const CRSA = [];
const CRST = [];
const BIR = [];
const BFR = [];
const BDR = [];

for (let size = 1; size <= SIZE; size++) {
    const arr = generateRandomArray(size);
    const start = performance.now();
    countingSort(arr);
    CR.push([size, performance.now() - start]);
}

// for (let size = 1; size <= SIZE; size++) {
//     const arr = generateLargeRangeArray(size);
//     const start = performance.now();
//     countingSort(arr);
//     CRL.push([size, performance.now() - start]);
// }

for (let size = 1; size <= SIZE; size++) {
    const arr = generateRandomSorterArray(size);
    const start = performance.now();
    countingSort(arr);
    CRS.push([size, performance.now() - start]);
}

for (let size = 1; size <= SIZE; size++) {
    const arr = generateSameArray(size);
    const start = performance.now();
    countingSort(arr);
    CRSA.push([size, performance.now() - start]);
}

for (let size = 1; size <= SIZE; size++) {
    const arr = generateStepArray(size, 1);
    const start = performance.now();
    countingSort(arr);
    CRST.push([size, performance.now() - start]);
}

const bst1 = new Bst(false);
for (let i = 0; i < SIZE; i++) {
    const start = performance.now();
    bst1.insert(randomInt(1, SIZE));
    BIR.push([i, performance.now() - start]);
}

const bst2 = new Bst();
for (let i = 0; i < SIZE; i++) {
    bst2.insert(randomInt(1, SIZE));
}
for (let i = 0; i < SIZE; i++) {
    const start = performance.now();
    bst2.find(randomInt(1, SIZE));
    BFR.push([i, performance.now() - start]);
}

const bst3 = new Bst();
for (let i = 0; i < SIZE; i++) {
    bst3.insert(randomInt(1, SIZE));
}
for (let i = 0; i < SIZE; i++) {
    const start = performance.now();
    bst3.delete(randomInt(1, SIZE));
    BDR.push([i, performance.now() - start]);
}

plot([
    {
        x: CR.map(([count]) => count),
        y: CR.map(([_, timeMs]) => timeMs),
        type: 'scatter',
        name: 'counting-sort',
    },
    {
        x: CRS.map(([count]) => count),
        y: CRS.map(([_, timeMs]) => timeMs),
        type: 'scatter',
        name: 'counting-sort-sorted-array',
    },
    {
        x: CRSA.map(([count]) => count),
        y: CRSA.map(([_, timeMs]) => timeMs),
        type: 'scatter',
        name: 'counting-sort-same-value',
    },
    {
        x: CRST.map(([count]) => count),
        y: CRST.map(([_, timeMs]) => timeMs),
        type: 'scatter',
        name: 'counting-step-value',
    },
    {
        x: BIR.map(([count]) => count),
        y: BIR.map(([_, timeMs]) => timeMs),
        type: 'scatter',
        name: 'bst-insert',
    },
    {
        x: BFR.map(([count]) => count),
        y: BFR.map(([_, timeMs]) => timeMs),
        type: 'scatter',
        name: 'bst-find',
    },
    {
        x: BDR.map(([count]) => count),
        y: BDR.map(([_, timeMs]) => timeMs),
        type: 'scatter',
        name: 'bst-delete',
    }
]);