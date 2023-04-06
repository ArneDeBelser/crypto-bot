const config = {
    apiKey: process.env.VITE_API_KEY_BITMART,
    secret: process.env.VITE_API_SECRET_BITMART,
    enableRateLimit: process.env.VITE_RATE_LIMIT_BITMART,
    rateLimit: process.env.VITE_RATE_LIMIT_BITMART_FREQUENCY,
    proxy: process.env.VITE_PROXY,
    options: {
        createMarketBuyOrderRequiresPrice: false,
        fetch: {
            corsProxyUrl: process.env.VITE_PROXY,
        },
    },
};

export default config;

