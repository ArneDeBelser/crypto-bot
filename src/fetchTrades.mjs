import { config } from './config/pairs.mjs';
import { fetchUserTrades } from "./helpers/botHelpers.mjs";

periodicallyFetchUserTrades();
setInterval(async () => {
    periodicallyFetchUserTrades();
}, 120000); // 2 minutes = 120,000 milliseconds

function periodicallyFetchUserTrades() {
    console.log(`\x1b[38;5;178m[${new Date().toLocaleString()}]\x1b[0m Fetching trades`);
    config.forEach(async (pairConfig) => {
        if (pairConfig.symbol !== 'default') {
            // console.log(`Trade Fetcher: Fetching trades for ${pairConfig.symbol} on ${pairConfig.exchange}`);
            await fetchUserTrades(pairConfig, pairConfig.symbol);
        }
    });
}