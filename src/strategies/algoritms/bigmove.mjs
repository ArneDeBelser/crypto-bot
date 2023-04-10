import { candlesBigMoveDown, candlesBigMoveUp, candlesNoMove } from "../data/bigmove-data.mjs";

const candles = candlesNoMove;

const threshold = 0.05; // 5% threshold for a big move

const firstCandle = candles[0];
const lastCandle = candles[candles.length - 1];

const priceChange = lastCandle.close - firstCandle.open;
const percentageChange = priceChange / firstCandle.open;

console.log(percentageChange * 100, "% percentageChange");

if (percentageChange >= threshold) {
    console.log("Big move up!");
} else if (percentageChange <= -threshold) {
    console.log("Big move down!");
} else {
    console.log("No big move detected.");
}
