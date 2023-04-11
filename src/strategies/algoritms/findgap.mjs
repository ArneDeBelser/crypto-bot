import { orderBook, orderBook2 } from "../data/findgap-data.mjs";

export const findLargePriceGaps = (prices) => {
    const priceRange = Math.max(...prices) - Math.min(...prices);
    const threshold = priceRange * 0.05; // 10% of the price range
    const gaps = [];

    for (let i = 1; i < prices.length; i++) {
        const prevPrice = prices[i - 1];
        const currPrice = prices[i];
        const priceGap = Math.abs(currPrice - prevPrice);

        if (priceGap > threshold) {
            const gap = {
                price: (prevPrice + currPrice) / 2,
                highestprice: Math.max(prevPrice, currPrice),
                lowestprice: Math.min(prevPrice, currPrice),
            };
            gaps.push(gap);
            console.log(`Large price gap detected: ${prevPrice} to ${currPrice} (${priceGap})`);
        }
    }

    return gaps;
}


export const addOrdersAboveGaps = (orderBook, gaps, orderType) => {
    const newOrders = [];

    gaps.forEach((gap) => {
        let orderPrice;

        if (orderType === "buy") {
            orderPrice = gap.highestprice * 0.99; // 1% above the highest price in the gap
        } else if (orderType === "sell") {
            orderPrice = gap.lowestprice * 1.01; // 1% below the lowest price in the gap: ;
        } else {
            throw new Error("Invalid order type provided. Please provide either 'buy' or 'sell'.");
        }

        console.log(`Adding ${orderType} order at ${orderPrice}`);
        notifier.sendMessage(`Adding ${orderType} order at ${orderPrice}`);
        newOrders.push(orderPrice);
    });

    return [...orderBook, ...newOrders];
}
// Find large price gaps
const gaps = findLargePriceGaps(orderBook2);

// Add orders above the gaps
const newOrderBook = addOrdersAboveGaps(orderBook2, gaps, "buy");

// Log the updated order book
console.log(newOrderBook);