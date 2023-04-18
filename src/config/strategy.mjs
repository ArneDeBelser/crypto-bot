export const strategyConfigs = {
    // Simple default values
    baseUsdtAmount: 10,
    maxUsdtAmount: 50,

    ab: {
        gapThresholdMulitplier: {
            defaultValue: 0.1, // 10% - It is used to determine the threshold for what constitutes a "large" price gap.
        },

        // The highestPriceModifier and lowestPriceModifier variables can be adjusted by the function's user to set the price for the new orders according to their preferences. The default values are 1.01 for highestPriceModifier and 0.99 for lowestPriceModifier, which means that the new buy order will be placed 1% higher than the highest price in the gap, and the new sell order will be placed 1% lower than the lowest price in the gap.
        // These are gap modifiers
        highestPriceModifier: {
            defaultValue: 0.99, // -1% - Used as multipliers to calculate the price for a new order to be placed in the gap.
        },
        lowestPriceModifier: {
            defaultValue: 1.01, // +1% - Used as multipliers to calculate the price for a new order to be placed in the gap.
        },

        // The threshold is essentially a measure of how different a number must be from its adjacent numbers to be included in the result array. If the threshold is set to a higher value, only numbers that are significantly different from their adjacent numbers will be included in the result array, and vice versa.
        askDifferenceThreshold: {
            defaultValue: 0.05, // 10% - Used as a limit or a cutoff value to determine whether or not to include a number in the result array
        },
        bidDifferenceThreshold: {
            defaultValue: 0.05, // 10% - Used as a limit or a cutoff value to determine whether or not to include a number in the result array
        },

        // The percentage parameter allows the user to set the range of prices that should be included in the filtered prices array. A higher percentage value will result in a wider price range being included, while a lower percentage value will result in a narrower price range being included.
        priceRangePercentageAsk: {
            defaultValue: 0.03, // 5% - Used to calculate the maximum distance from the currentPrice at which the function should filter out prices from the prices array.
        },
        priceRangePercentageBid: {
            defaultValue: 0.05, // 10% - Used to calculate the maximum distance from the currentPrice at which the function should filter out prices from the prices array.
        },

        // The buyThreshold and sellThreshold are parameters of the filterLevels function that control the filtering of levels based on trades and side arguments. It gives you a general way of specifying when a level is invalidated upon a sell or a buy
        sellInvalidationThreshold: {
            defaultValue: 0.03, // 5% - The sellThreshold value acts as a filter to remove levels that have been invalidated by trades executed at prices too high, relative to their original price.
        },
        buyInvalidationThreshold: {
            defaultValue: 0.03, // 5% - The buyThreshold value acts as a filter to remove levels that have been invalidated by trades executed at prices too low, relative to their original price.
        },

        // The buyThreshold and sellThreshold are parameters of the filterLevels function that control the filtering of levels based on trades and side arguments. It gives you a general way of specifying when a level is invalidated upon a sell or a buy
        klineRangeLowAdjustmentFactor: {
            defaultValue: 0.9, // -10% - The sellThreshold value acts as a filter to remove levels that have been invalidated by trades executed at prices too high, relative to their original price.
        },
        klineRangeHighAdjustmentFactor: {
            defaultValue: 1.1, // +10% - The buyThreshold value acts as a filter to remove levels that have been invalidated by trades executed at prices too low, relative to their original price.
        },
    },
};
