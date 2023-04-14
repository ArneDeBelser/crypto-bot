export const strategyConfigs = {
    ab: {
        gapThresholdMulitplier: {
            defaultValue: 0.1, // It is used to determine the threshold for what constitutes a "large" price gap.
        },

        // The highestPriceModifier and lowestPriceModifier variables can be adjusted by the function's user to set the price for the new orders according to their preferences. The default values are 1.01 for highestPriceModifier and 0.99 for lowestPriceModifier, which means that the new buy order will be placed 1% higher than the highest price in the gap, and the new sell order will be placed 1% lower than the lowest price in the gap.
        highestPriceModifier: {
            defaultValue: 0.99, // Used as multipliers to calculate the price for a new order to be placed in the gap.
        },
        lowestPriceModifier: {
            defaultValue: 1.01, // Used as multipliers to calculate the price for a new order to be placed in the gap.
        },

        // The threshold is essentially a measure of how different a number must be from its adjacent numbers to be included in the result array. If the threshold is set to a higher value, only numbers that are significantly different from their adjacent numbers will be included in the result array, and vice versa.
        filterAskThreshold: {
            
            defaultValue: 0.1, // Used as a limit or a cutoff value to determine whether or not to include a number in the result array
        },
        filterBidThreshold: {
            defaultValue: 0.1,// Used as a limit or a cutoff value to determine whether or not to include a number in the result array
        },

        // The percentage parameter allows the user to set the range of prices that should be included in the filtered prices array. A higher percentage value will result in a wider price range being included, while a lower percentage value will result in a narrower price range being included.
        closeToCurrentPricePercentageAsk: {
            defaultValue: 0.05, // Used to calculate the maximum distance from the currentPrice at which the function should filter out prices from the prices array.
        },
        closeToCurrentPricePercentageBid: {
            defaultValue: 0.1, // Used to calculate the maximum distance from the currentPrice at which the function should filter out prices from the prices array.
        }
    },
};
