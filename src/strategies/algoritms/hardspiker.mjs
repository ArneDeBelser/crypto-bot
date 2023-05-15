export const hasHardSpike = (klineData) => {
    const priceThreshold = calculatePriceThreshold(klineData);

    // Check if any price exceeds the threshold
    const hasSpike = klineData.some((data) => Math.abs(data[1] - data[2]) > priceThreshold);

    return hasSpike;
};


function calculatePriceThreshold(klineData) {
    // Extract the prices from the kline data
    const prices = klineData.map((data) => data[1]);

    // Calculate the average price
    const totalPrices = prices.reduce((sum, price) => sum + price, 0);
    const averagePrice = totalPrices / prices.length;

    // Calculate the standard deviation of prices
    const squaredDifferences = prices.map((price) => Math.pow(price - averagePrice, 2));
    const variance = squaredDifferences.reduce((sum, diff) => sum + diff, 0) / squaredDifferences.length;
    const standardDeviation = Math.sqrt(variance);

    // Calculate the threshold as a multiple of the standard deviation
    const thresholdMultiplier = 2; // Adjust this multiplier as needed
    const priceThreshold = standardDeviation * thresholdMultiplier;

    return priceThreshold;
}