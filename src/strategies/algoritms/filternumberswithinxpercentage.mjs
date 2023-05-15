export const filterNumbersWithinXPercentage = (arr, threshold = 0) => {
    if (arr.length === 0) {
        return []; // Return an empty array if the input array is empty
    }

    const result = [arr[0]];

    for (let i = 1; i < arr.length; i++) {
        const currentNumber = arr[i];
        const lastNumber = result[result.length - 1];
        const difference = Math.abs(currentNumber - lastNumber);
        const average = (currentNumber + lastNumber) / 2;
        const percentDifference = difference / average;

        if (percentDifference >= threshold) {
            result.push(currentNumber);
        } else if (i === arr.length - 1 && percentDifference >= threshold) {
            result.push(currentNumber);
        }
    }

    return result;
}
