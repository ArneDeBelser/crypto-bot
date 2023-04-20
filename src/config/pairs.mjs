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
            askDifferenceThreshold: 0.05,
            bidDifferenceThreshold: 0.1,
            sellInvalidationThreshold: 0.05,
            buyInvalidationThreshold: 0.07,
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
            askDifferenceThreshold: 0.05,
            bidDifferenceThreshold: 0.1,
            sellInvalidationThreshold: 0.05,
            buyInvalidationThreshold: 0.07,
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
            askDifferenceThreshold: 0.1,
            bidDifferenceThreshold: 0.1,
            priceRangePercentageAsk: 0.03, // 0.03
            priceRangePercentageBid: 0.03, // 0.05
            sellInvalidationThreshold: 0.1, // 0.03
            buyInvalidationThreshold: 0.07, // 0.03
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
            askDifferenceThreshold: 0.1,
            bidDifferenceThreshold: 0.1,
            priceRangePercentageAsk: 0.01, // 0.03
            priceRangePercentageBid: 0.03,
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
            askDifferenceThreshold: 0.09,
            bidDifferenceThreshold: 0.09,
            priceRangePercentageAsk: 0.07, // 0.03
            priceRangePercentageBid: 0.05,
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
            askDifferenceThreshold: 0.05,
            bidDifferenceThreshold: 0.1,
            priceRangePercentageAsk: 0.03, // 0.03
            priceRangePercentageBid: 0.05,
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
            askDifferenceThreshold: 0.1,
            bidDifferenceThreshold: 0.1,
            priceRangePercentageAsk: 0.1, // 0.03
            priceRangePercentageBid: 0.1,
            sellInvalidationThreshold: 0.1,
            buyInvalidationThreshold: 0.1,
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
