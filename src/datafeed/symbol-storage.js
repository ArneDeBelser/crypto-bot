import { SUPPORTED_RESOLUTIONS } from "./data-provider";

export default class SymbolsStorage {
    constructor(exchange) {
        this.history = {};
        this.exchange = exchange;
    }

    async resolveSymbol(symbolName) {
        try {
            let timezone = "UTC";

            const delimiter = symbolName.includes("_") ? "_" : "/";
            const [coin, base] = symbolName.split(delimiter);

            const marketSymbol = `${coin.toUpperCase()}/USDT`;

            if (!this.exchange.markets) {
                await this.exchange.loadMarkets();
            }

            // Get the market and precision price
            const market = this.exchange.market(symbolName);
            const { precision } = market;

            this.history[symbolName] = {
                name: symbolName,
                description: `${coin.toUpperCase()}/${base.toUpperCase()} on ${this.exchange.name}`,
                ticker: symbolName,
                supported_resolutions: SUPPORTED_RESOLUTIONS,
                minmov: 1,
                pricescale: 10000000000,
                session: "24x7",
                timezone: timezone,
                has_intraday: true,
                visible_plots_set: false,
                intraday_multipliers: ["5", "15", "30", "60", "150", "240"],
            };

            return this.history[symbolName];
        } catch (error) {
            console.error("Could not load symbol", error);
        }
    }
}
