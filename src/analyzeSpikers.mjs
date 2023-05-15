import { telegramInstance } from "./TelegramBot.mjs";
import { logToFile } from "./filelogger.mjs";
import { hasHardSpike } from "./strategies/algoritms/hardspiker.mjs";

analyzeSpikers();
setInterval(analyzeSpikers, 120000); // 2 minutes = 120,000 milliseconds

async function analyzeSpikers() {
    try {
        console.log(`\x1b[38;5;178m[${new Date().toLocaleString()}]\x1b[0m Analyzing next batch of spikers`);
        const exchangeObject = await import(`../src/exchanges/bitmart/nodeExchange.mjs`);
        const exchange = exchangeObject.default;
        exchange.enableRateLimit = true;
        exchange.rateLimit = 2500;
        if (typeof exchange.signIn === 'function') await exchange.signIn(); // Only for probit

        let pairs = await exchange.loadMarkets();
        let singlePairs = Object.keys(pairs);

        singlePairs = ['KOM/USDT'];

        for (const pair of singlePairs) {
            try {
                const klines = await exchange.fetchOHLCV(pair, '4h');
                logToFile(klines);
                const isHardSpike = hasHardSpike(klines);
                console.log(`Has hard spike for ${pair}: ${isHardSpike}`);
            } catch (error) {
                const errorMessage = `Error occurred fetching klines for spiker analysis ${pair}: ${error.message}`;
                telegramInstance.sendMessage(errorMessage);
                console.error(errorMessage);
            }
        }
    } catch (error) {
        console.error(`Error occurred in analyzeSpikers: ${error.message}`);
    }
}
