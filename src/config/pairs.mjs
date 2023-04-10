const strategyConfigs = {
    ab10percent: {
        parameter1: '',
        parameter2: '',
    },
    absmallgains: {
        parameter1: '',
        parameter2: '',
    },
};

export const config = [
    {
        name: 'BTC_USDT',
        exchange: 'binance',
        strategy: 'ab10percent',
        parameter1: '',
        interval: 1 * 60 * 1000
    },
    {
        name: 'ETH_USDT',
        exchange: 'coinbase',
        strategy: 'ab10percent',
        parameter1: '',
        interval: 2 * 60 * 1000
    },
    {
        name: 'ATZ_USDT',
        exchange: 'binance',
        strategy: 'absmallgains',
        parameter1: '',
        interval: 5 * 60 * 1000
    },
];

export const getPairConfig = (pairName, exchangeName) => {
    const pairConfig = config.find(
        (config) => config.name === pairName && config.exchange === exchangeName
    );
    const strategyConfig = strategyConfigs[pairConfig.strategy];
    return { ...strategyConfig, ...pairConfig };
}
