const config = {
    apiKey: env.VITE_API_KEY_BITGET,
    secret: env.VITE_API_SECRET_BITGET,
    enableRateLimit: env.VITE_RATE_LIMIT_BITGET,
    rateLimit: env.VITE_RATE_LIMIT_BITGET_FREQUENCY,
    proxy: env.VITE_PROXY,
    options: {
        createMarketBuyOrderRequiresPrice: false,
        fetch: {
            corsProxyUrl: env.VITE_PROXY,
        },
    },
};

