export const filterKlineRange = (klines, orderbook, currentPrice, klineRangeLowAdjustmentFactor, klineRangeHighAdjustmentFactor) => {
    // Get the highest and lowest values from the klines data
    let high = Math.max(...klines.map(kline => kline[2]));
    let low = Math.min(...klines.map(kline => kline[3]));

    // Check if the current price is within 10% of the high or low and adjust the range accordingly
    // console.log('lowfirst', low);

    const percentHigh = high * klineRangeHighAdjustmentFactor;
    const percentLow = low * klineRangeLowAdjustmentFactor;

    if (currentPrice <= percentHigh) {
        low *= klineRangeLowAdjustmentFactor;
    } else if (currentPrice >= percentLow) {
        high *= klineRangeHighAdjustmentFactor;
    }

    //console.log('lowsecond', percentLow);

    // Filter out the orderbook data that falls outside the klines range
    const filteredOrderbook = orderbook.filter(price => {
        return price >= low && price <= high;
    })

    return filteredOrderbook;
}