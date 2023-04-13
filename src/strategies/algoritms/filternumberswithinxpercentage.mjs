export const filterNumbersWithinXPercentage = (arr, threshold) => {
    const result = [arr[0]];

    for (let i = 1; i < arr.length; i++) {
        const currentNumber = arr[i];
        const lastNumber = result[result.length - 1];
        const difference = Math.abs(currentNumber - lastNumber);
        const average = (currentNumber + lastNumber) / 2;
        const percentDifference = difference / average;

        if (percentDifference >= threshold) {
            result.push(currentNumber);
        } else if (i === arr.length - 1) {
            result.push(currentNumber);
        }
    }

    return result;
}
