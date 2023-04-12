// import { orderBook, orderBook2 } from "../data/findgap-data.mjs";

export const findPriceGaps = (prices, gapThresholdMulitplier) => {
    const priceRange = Math.max(...prices) - Math.min(...prices);
    const threshold = priceRange * gapThresholdMulitplier;
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
            // console.log(`Large price gap detected: ${prevPrice} to ${currPrice} (${priceGap})`);
        }
    }

    return gaps;
}

export const addOrdersInGaps = (gaps, orderType, highestPriceModifier, lowestPriceModifier) => {
    const newOrders = [];

    gaps.forEach((gap) => {
        let price;

        if (orderType === "buy") {
            price = gap.highestprice * highestPriceModifier; // 1% above the highest price in the gap
        } else if (orderType === "sell") {
            price = gap.lowestprice * lowestPriceModifier; // 1% below the lowest price in the gap: ;
        } else {
            throw new Error("Invalid order type provided. Please provide either 'buy' or 'sell'.");
        }

        // console.log(`Adding ${orderType} order at ${price}`);
        newOrders.push(price);
    });

    return newOrders;
}

// // Find large price gaps
// const gaps = findLargePriceGaps(orderBook2);

// // Add orders above the gaps
// const newOrderBook = addOrdersAboveGaps(orderBook2, gaps, "buy");

// // Log the updated order book
// console.log(newOrderBook);