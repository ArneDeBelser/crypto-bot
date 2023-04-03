const config = {
    apiKey: 'bg_b0c0466d8dd16ff262410836a011a1d5',
    secret: '07339037b0a1f91d6304d9395531a0334402278457822ec7fd6a72b286e1eb7c',
    rateLimit: 500,
    enableRateLimit: false,
    proxy: 'http://localhost:8080/',
    options: {
        createMarketBuyOrderRequiresPrice: false,
        fetch: {
            corsProxyUrl: 'http://localhost:8080/', // replace with your proxy URL
        },
    },
};

export default config;
