function countingSort(arr) {
    if (arr.length === 0) return [];
    let max = arr[0];
    let min = arr[0];
    for (const item of arr) {
        if (item > max) max = item;
        if (item < min) min = item;
    }
    console.log(arr, max, min, max - min + 1);
    const maxLength = Math.pow(2, 32) - 1;
    const length = max - min + 1;
    const counts = new Array(length > maxLength ? maxLength : length).fill(0);
    for (let i = 0; i < arr.length; i++) {
        counts[arr[i] - min]++;
    }
    const sorted = [];
    for (let i = 0; i < counts.length; i++) {
        while (counts[i] > 0) {
            sorted.push(i + min);
            counts[i]--;
        }
    }
    return sorted;
}

module.exports = { countingSort };
