const min = 1;
const max = 100000;

function randomInt() {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomArray(length) {
    const randomArray = [];
    for (let i = 0; i < length; i++) {
        const randomValue = randomInt(min, max);
        randomArray.push(randomValue);
    }
    return randomArray;
}

function generateRandomSorterArray(length) {
    return generateRandomArray(length).sort((a, b) => a - b);;
}

function generateSameArray(length) {
    const randInt = randomInt(1, 100000);
    return new Array(length).fill(randInt);
}

function generateStepArray(length, step) {
    const array = [];
    let value = 0;
    for (let i = 0; i < length; i++) {
        value += step;
        array.push(value);
    }
    return array;
}

function generateLargeRangeArray(length) {
    const array = Array.from({ length }, () => randomInt());
    // max array length = 4_294_967_295
    array.push(Math.pow(2, 32) - Math.pow(2, 8));
    return array;
}


module.exports = {
    generateRandomArray,
    generateSameArray,
    generateRandomSorterArray,
    generateStepArray,
    randomInt,
    generateLargeRangeArray
};