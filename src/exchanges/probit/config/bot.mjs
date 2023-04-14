export const config = {
    apiKey: process.env.VITE_API_KEY_PROBIT,
    secret: process.env.VITE_API_SECRET_PROBIT,
    uid: process.env.VITE_API_MEMO_PROBIT,
    enableRateLimit: process.env.VITE_RATE_LIMIT_PROBIT,
    rateLimit: process.env.VITE_RATE_LIMIT_PROBIT_FREQUENCY,
    httpAgent: undefined,
    options: {
        createMarketBuyOrderRequiresPrice: false,
        fetch: {
            corsProxyUrl: process.env.VITE_PROXY,
        },
    },
};