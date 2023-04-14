export const config = [
    {
        symbol: 'default',
        exchange: 'bitmart',
        interval: 60 * 60 * 1000,
        ignore: true,
        strategy: {
            identifier: 'ab',
        },
    },
    {
        symbol: 'ZENIQ/USDT',
        exchange: 'bitmart',
        interval: 15 * 60 * 1000,
        ignore: false,
        strategy: {
            identifier: 'ab',
            filterAskThreshold: 0.05,
            filterBidThreshold: 0.02,
            closeToCurrentPricePercentageAsk: 0.02,
            closeToCurrentPricePercentageBid: 0.02,
        },
    },
    {
        symbol: 'GBEX/USDT',
        exchange: 'bitmart',
        interval: 15 * 60 * 1000,
        ignore: false,
        strategy: {
            identifier: 'ab',
            filterAskThreshold: 0.05,
            filterBidThreshold: 0.02,
            closeToCurrentPricePercentageAsk: 0.1,
            closeToCurrentPricePercentageBid: 0.07,
        },
    },
    {
        symbol: 'GODE/USDT',
        exchange: 'bitmart',
        interval: 15 * 60 * 1000,
        ignore: false,
        strategy: {
            identifier: 'ab',
            filterAskThreshold: 0.05,
            filterBidThreshold: 0.1,
        },
    },
    {
        symbol: 'BITBOY/USDT',
        exchange: 'bitmart',
        interval: 15 * 60 * 1000,
        ignore: false,
        strategy: {
            identifier: 'ab',
            gapThresholdMulitplier: 0.05,
            filterAskThreshold: 0.05,
            filterBidThreshold: 0.1,
        },
    },

    {
        symbol: 'default',
        exchange: 'probit',
        interval: 60 * 60 * 1000,
        ignore: true,
        strategy: {
            identifier: 'ab',
        },
    },
];
