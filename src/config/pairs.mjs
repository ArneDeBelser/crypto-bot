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
        symbol: 'GODE/USDT',
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
        symbol: 'APL/USDT',
        exchange: 'bitmart',
        strategy: 'ab',
        interval: 15 * 60 * 1000,
        ignore: false,
        strategy: {
            identifier: 'ab',
            gapThresholdMulitplier: 0.05,
            filterAskThreshold: 0.05,
            filterBidThreshold: 0.1,
        },
    },
];
