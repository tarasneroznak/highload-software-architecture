const { setTimeout } = require("node:timers/promises");
const { Bst } = require("./bst");

function randomInt(min = 1, max = 10000000) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function profile(size = 1000) {
    if (size === 1000) {
        await setTimeout(10000);
    }
    if (size >= 100000) {
        console.log("Done all");
        return;
    }
    const bst = new Bst();
    for (let i = 0; i < size; i++) {
        bst.insert(randomInt());
        bst.find(randomInt());
        bst.delete(randomInt());
    }
    console.log("Done", bst.size);
    profile(size + 1000);
}
profile();