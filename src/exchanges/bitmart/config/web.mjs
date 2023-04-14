const config = {
    apiKey: import.meta.env.VITE_API_KEY_BITMART,
    secret: import.meta.env.VITE_API_SECRET_BITMART,
    uid: import.meta.env.VITE_API_MEMO_BITMART,
    enableRateLimit: import.meta.env.VITE_RATE_LIMIT_BITMART,
    rateLimit: import.meta.env.VITE_RATE_LIMIT_BITMART_FREQUENCY,
    proxy: import.meta.env.VITE_PROXY,
    options: {
        createMarketBuyOrderRequiresPrice: false,
        fetch: {
            corsProxyUrl: import.meta.env.VITE_PROXY,
        },
    },
};

export default config;

