// import { candlesBigMoveDown, candlesBigMoveUp, candlesNoMove } from "../data/bigmove-data.mjs";

// export const bigMoveDetected = (candles) => {
//     const threshold = 0.7; // 50% threshold for a big move

//     const firstCandleClose = candles[0][4];
//     console.log('firstCandle', firstCandleClose)
//     const lastCandleOpen = candles[candles.length - 1][1];
//     console.log('lastCandle', lastCandleOpen)

//     const priceChange = firstCandleClose - lastCandleOpen;
//     console.log('priceChange', priceChange)
//     const percentageChange = Math.abs(priceChange / lastCandleOpen);
//     console.log('percentageChange', percentageChange)

//     console.log(percentageChange * 100, "% percentageChange");

//     if (percentageChange >= threshold) {
//         //  console.log("Big move up!");
//         return { isBigMove: true, percentageChange: percentageChange };
//     } else if (percentageChange <= -threshold) {
//         //  console.log("Big move down!");
//         return { isBigMove: true, percentageChange: percentageChange };
//     } else {
//         //console.log("No big move detected.");
//         return { isBigMove: false, percentageChange: percentageChange };
//     }
// }

export const bigMoveDetected = (candles, bigMoveThreshold) => {
    const firstCandleMovingAverage = calculateMovingAverage(candles, 0);
    const lastCandleMovingAverage = calculateMovingAverage(candles, candles.length - 1);

    const percentageDifference = (lastCandleMovingAverage - firstCandleMovingAverage) / firstCandleMovingAverage;

    if (percentageDifference >= bigMoveThreshold) {
        return { isBigMove: true, percentageDifference: percentageDifference };
    } else {
        return { isBigMove: false, percentageDifference: percentageDifference };
    }
}

// Function to calculate the moving average
const calculateMovingAverage = (candles, index) => {
    let sum = 0;
    const windowSize = candles.length; // Consider all candles for calculating the moving average

    for (let i = Math.max(0, index - windowSize + 1); i <= index; i++) {
        sum += candles[i][4]; // Assuming the closing price is at index 4
    }

    return sum / Math.min(index + 1, windowSize);
}

