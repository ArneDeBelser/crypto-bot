export const getPairConfig = async (config, pair, exchange) => {
    // Get the pairConfig (if pair variable is supplied)
    const pairConfig = getConfig(config, 'symbol', pair, exchange);

    // Import the strategy module and run the strategy
    let strategyModule;
    strategyModule = await import(`../strategies/${pairConfig.strategy.identifier}.mjs`);

    return [pairConfig, strategyModule];
}

function getConfig(configArr, key, value, exchange) {
    console.log(`getConfig: Searching for ${key}=${value} in configArr`, configArr);
    console.log(`getConfig: Searching for exchange=${exchange} in configArr`, configArr);

    // Find the first configuration object in the array that has a property with the given key and value
    const matchingConfig = configArr.find(function (config) {
        return config.exchange === exchange && config[key] === value;
    });

    // If a matching configuration was found, return it
    if (matchingConfig) {
        console.log(`getConfig: Found matching config:`, matchingConfig);
        return matchingConfig;
    }

    // If no matching configuration was found, look for a default configuration
    const defaultConfig = configArr.find(function (config) {
        return config.exchange == exchange && config.symbol == 'default';
    });

    // If a default configuration was found, return it
    if (defaultConfig) {
        console.log(`getConfig: Using default config:`, defaultConfig);
        return defaultConfig;
    }

    // If no default configuration was found, return undefined
    console.log(`getConfig: No matching config or default config found`);
    return undefined;
}
