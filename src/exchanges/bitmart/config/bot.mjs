export const config = {
    apiKey: process.env.VITE_API_KEY_BITMART,
    secret: process.env.VITE_API_SECRET_BITMART,
    uid: process.env.VITE_API_MEMO_BITMART,
    enableRateLimit: process.env.VITE_RATE_LIMIT_BITMART,
    rateLimit: process.env.VITE_RATE_LIMIT_BITMART_FREQUENCY,
    httpAgent: undefined,
    options: {
        createMarketBuyOrderRequiresPrice: false,
        fetch: {
            corsProxyUrl: process.env.VITE_PROXY,
        },
    },
};