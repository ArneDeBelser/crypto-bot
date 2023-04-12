export const getPairConfig = async (config, pair) => {
    // Get the pairConfig (if pair variable is supplied)
    const pairConfig = getConfig(config, 'symbol', pair);

    // Import the strategy module and run the strategy
    let strategyModule;
    try {
        strategyModule = await import(`../strategies/${pairConfig.strategy}.mjs`);
    } catch (error) {
        throw new Error('There is no defined strategy for this pair.');
    }

    return [
        pairConfig,
        strategyModule
    ];
}

function getConfig(configArr, key, value) {
    const config = configArr.find(config => config[key] === value);
    return config ? config : configArr.find(config => config.symbol == 'default');
}
