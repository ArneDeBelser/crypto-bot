export const config = [
    // Start bitmart
    {
        symbol: 'default',
        exchange: 'bitmart',
        interval: 60 * 60 * 1000,
        baseUsdtAmount: 10,
        minUsdtAmount: 5.1,
        maxUsdtAmount: 50,
        ignore: true,
        strategy: {
            identifier: 'ab',
        },
    },
    {
        symbol: 'AFIN/USDT',
        exchange: 'bitmart',
        interval: 15 * 60 * 1000,
        ignore: false,
        baseUsdtAmount: 10,
        minUsdtAmount: 5.1,
        maxUsdtAmount: 50,
        strategy: {
            identifier: 'ab',
            priceRangePercentageAsk: 0.03, // Filter out orders too close to current price - def: 0.03
            priceRangePercentageBid: 0.03, // Filter out orders too close to current price - def: 0.05
            askDifferenceThreshold: 0.05, // Filter out nubers within x percentage of eachother - def: 0.05
            bidDifferenceThreshold: 0.1, // Filter out nubers within x percentage of eachother - def: 0.05
            sellInvalidationThreshold: 0.05, // Filter out numbers to close to already bought levels in this iteration - def: 0.03
            buyInvalidationThreshold: 0.07, // Filter out numbers to close to already bought levels in this iteration - def: 0.03
        },
    },
    {
        symbol: 'GODE/USDT',
        exchange: 'bitmart',
        interval: 15 * 60 * 1000,
        ignore: false,
        baseUsdtAmount: 10,
        minUsdtAmount: 5.1,
        maxUsdtAmount: 50,
        strategy: {
            identifier: 'ab',
            askDifferenceThreshold: 0.05, // Filter out nubers within x percentage of eachother - def: 0.05
            bidDifferenceThreshold: 0.1, // Filter out nubers within x percentage of eachother - def: 0.05
            sellInvalidationThreshold: 0.05, // Filter out numbers to close to already bought levels in this iteration - def: 0.03
            buyInvalidationThreshold: 0.07, // Filter out numbers to close to already bought levels in this iteration - def: 0.03
        },
    },
    {
        symbol: 'FWC/USDT',
        exchange: 'bitmart',
        interval: 15 * 60 * 1000,
        ignore: false,
        baseUsdtAmount: 10,
        minUsdtAmount: 5.1,
        maxUsdtAmount: 50,
        strategy: {
            identifier: 'ab',
            askDifferenceThreshold: 0.1, // Filter out nubers within x percentage of eachother - def: 0.05
            bidDifferenceThreshold: 0.1, // Filter out nubers within x percentage of eachother - def: 0.05
            priceRangePercentageAsk: 0.03, // Filter out orders too close to current price - def: 0.03
            priceRangePercentageBid: 0.03, // Filter out orders too close to current price - def: 0.05
            sellInvalidationThreshold: 0.1, // Filter out numbers to close to already bought levels in this iteration - def: 0.03
            buyInvalidationThreshold: 0.07, // Filter out numbers to close to already bought levels in this iteration - def: 0.03
        },
    },
    {
        symbol: 'KISHU/USDT',
        exchange: 'bitmart',
        interval: 15 * 60 * 1000,
        ignore: false,
        baseUsdtAmount: 10,
        minUsdtAmount: 5.1,
        maxUsdtAmount: 50,
        strategy: {
            identifier: 'ab',
            askDifferenceThreshold: 0.1, // Filter out nubers within x percentage of eachother - def: 0.05
            bidDifferenceThreshold: 0.1, // Filter out nubers within x percentage of eachother - def: 0.05
            priceRangePercentageAsk: 0.1, // Filter out orders too close to current price - def: 0.03
            priceRangePercentageBid: 0.03, // Filter out orders too close to current price - def: 0.05
        },
    },
    {
        symbol: '$ORE/USDT',
        exchange: 'bitmart',
        interval: 15 * 60 * 1000,
        ignore: false,
        baseUsdtAmount: 10,
        minUsdtAmount: 5.1,
        maxUsdtAmount: 100,
        strategy: {
            identifier: 'ab',
            askDifferenceThreshold: 0.09, // Filter out nubers within x percentage of eachother - def: 0.05
            bidDifferenceThreshold: 0.09, // Filter out nubers within x percentage of eachother - def: 0.05
            priceRangePercentageAsk: 0.07, // Filter out orders too close to current price - def: 0.03
            priceRangePercentageBid: 0.05, // Filter out orders too close to current price - def: 0.05
        },
    },
    {
        symbol: 'GBEX/USDT',
        exchange: 'bitmart',
        interval: 15 * 60 * 1000,
        ignore: false,
        baseUsdtAmount: 10,
        minUsdtAmount: 5.1,
        maxUsdtAmount: 100,
        strategy: {
            identifier: 'ab',
            askDifferenceThreshold: 0.05, // Filter out nubers within x percentage of eachother - def: 0.05
            bidDifferenceThreshold: 0.1, // Filter out nubers within x percentage of eachother - def: 0.05
            priceRangePercentageAsk: 0.03, // Filter out orders too close to current price - def: 0.03
            priceRangePercentageBid: 0.05, // Filter out orders too close to current price - def: 0.05
        },
    },
    {
        symbol: 'AREA/USDT',
        exchange: 'bitmart',
        interval: 15 * 60 * 1000,
        ignore: false,
        baseUsdtAmount: 6,
        minUsdtAmount: 5.1,
        maxUsdtAmount: 50,
        strategy: {
            identifier: 'ab',
            priceRangePercentageAsk: 0.03, // Filter out orders too close to current price - def: 0.03
            priceRangePercentageBid: 0.03, // Filter out orders too close to current price - def: 0.05
            sellInvalidationThreshold: 0.04, // Filter out numbers to close to already bought levels in this iteration - def: 0.03
            buyInvalidationThreshold: 0.04, // Filter out numbers to close to already bought levels in this iteration - def: 0.03
        },
    },
    {
        symbol: 'CAST/USDT',
        exchange: 'bitmart',
        interval: 15 * 60 * 1000,
        ignore: false,
        baseUsdtAmount: 6,
        minUsdtAmount: 5.1,
        maxUsdtAmount: 50,
        strategy: {
            identifier: 'ab',
            askDifferenceThreshold: 0, // Filter out nubers within x percentage of eachother - def: 0.05
            priceRangePercentageAsk: 0, // Filter out orders too close to current price - def: 0.03
        },
    },
    {
        symbol: 'UBX/USDT',
        exchange: 'bitmart',
        interval: 15 * 60 * 1000,
        ignore: false,
        baseUsdtAmount: 10,
        minUsdtAmount: 5.1,
        maxUsdtAmount: 50,
        strategy: {
            identifier: 'ab',
            askDifferenceThreshold: 0.1, // Filter out nubers within x percentage of eachother - def: 0.05
            bidDifferenceThreshold: 0.1, // Filter out nubers within x percentage of eachother - def: 0.05
            priceRangePercentageAsk: 0.1, // Filter out orders too close to current price - def: 0.03
            priceRangePercentageBid: 0.1, // Filter out orders too close to current price - def: 0.05
            sellInvalidationThreshold: 0.1, // Filter out numbers to close to already bought levels in this iteration - def: 0.03
            buyInvalidationThreshold: 0.1, // Filter out numbers to close to already bought levels in this iteration - def: 0.03
        },
    },

    // Start Probit
    {
        symbol: 'default',
        exchange: 'probit',
        interval: 60 * 60 * 1000,
        ignore: true,
        baseUsdtAmount: 10,
        minUsdtAmount: 1.1,
        maxUsdtAmount: 50,
        strategy: {
            identifier: 'ab',
        },
    },
];
