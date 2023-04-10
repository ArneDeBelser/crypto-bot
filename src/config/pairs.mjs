export const config = [
    {
        name: 'BITBOY/USDT',
        exchange: 'bitmart',
        strategy: 'ab',
        parameter1: '',
        interval: 0.5 * 60 * 1000
    },
];

// export const getPairConfig = (pairName, exchangeName) => {
//     const pairConfig = config.find(
//         (config) => config.name === pairName && config.exchange === exchangeName
//     );
//     const strategyConfig = strategyConfigs[pairConfig.strategy];
//     return { ...strategyConfig, ...pairConfig };
// }
