export const config = [
    {
        symbol: 'default',
        exchange: 'bitmart',
        strategy: 'ab',
        gapThresholdMulitplier: 0.01,
        interval: 15 * 60 * 1000,
        ignore: true,
    },
    {
        symbol: 'BITBOY/USDT',
        exchange: 'bitmart',
        strategy: 'ab',
        gapThresholdMulitplier: 0.05,
        interval: 15 * 60 * 1000,
        ignore: false,
    },
    {
        symbol: 'APL/USDT',
        exchange: 'bitmart',
        strategy: 'ab',
        gapThresholdMulitplier: 0.05,
        interval: 15 * 60 * 1000,
        ignore: false,
    },
];
