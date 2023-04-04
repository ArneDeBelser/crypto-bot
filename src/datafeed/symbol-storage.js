import ccxt from 'ccxt';
import { SUPPORTED_RESOLUTIONS } from "./data-provider";
import config from '../exchanges/bitmart/config.js';

export default class SymbolsStorage {
    constructor() {
        this.history = {};
        this.bitmart = new ccxt.bitmart(config);
    }

    async resolveSymbol(symbolName) {
        try {
            let timezone = "UTC";

            const [coin, base] = symbolName.split("_");
            const marketSymbol = `${coin.toUpperCase()}/USDT`;

            if (!this.bitmart.markets) {
                await this.bitmart.loadMarkets();
            }

            // Get the market and precision price
            const market = this.bitmart.market(symbolName);
            const { precision } = market;

            this.history[symbolName] = {
                name: symbolName,
                description: `${coin.toUpperCase()}/USDT on Bitmart`,
                ticker: symbolName,
                supported_resolutions: SUPPORTED_RESOLUTIONS,
                minmov: 1,
                pricescale: 100000000,
                session: "24x7",
                timezone: timezone,
                has_intraday: true,
                has_no_volume: false,
                intraday_multipliers: ["5", "15", "30", "60", "150", "240"],
            };

            return this.history[symbolName];
        } catch (error) {
            console.error("Could not load symbol", error);
        }
    }
}
