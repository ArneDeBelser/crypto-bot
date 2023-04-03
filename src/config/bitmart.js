const config = {
    apiKey: '02deba7124e71b0c88266e039ec2421f9c1e02a4',
    secret: 'eb0c3087ccb566b79591c27e6031040e71c5603b57e4e5f1585ac02051f7e4e7',
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
