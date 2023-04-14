const config = {
    apiKey: import.meta.env.VITE_API_KEY_PROBIT,
    secret: import.meta.env.VITE_API_SECRET_PROBIT,
    uid: import.meta.env.VITE_API_MEMO_PROBIT,
    enableRateLimit: import.meta.env.VITE_RATE_LIMIT_PROBIT,
    rateLimit: import.meta.env.VITE_RATE_LIMIT_PROBIT_FREQUENCY,
    proxy: import.meta.env.VITE_PROXY,
    options: {
        createMarketBuyOrderRequiresPrice: false,
        fetch: {
            corsProxyUrl: import.meta.env.VITE_PROXY,
        },
    },
};

export default config;

