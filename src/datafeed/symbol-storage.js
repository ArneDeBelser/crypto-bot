import { SUPPORTED_RESOLUTIONS } from "./data-provider";

export default class SymbolsStorage {
    constructor(exchange) {
        this.history = {};
        this.exchange = exchange;
    }

    async resolveSymbol(symbolName) {
        try {
            let timezone = "UTC";

            // Some frustration hocus pocus to get the right delimiter.
            let delimiter = symbolName.includes("_") ? "_" : "/";
            delimiter = symbolName.includes("-") ? "-" : "/";

            const [coin, base] = symbolName.split(delimiter);

            if (!this.exchange.markets) {
                await this.exchange.loadMarkets();
            }

            // Get the market and precision price
            const market = this.exchange.market(symbolName);
            console.log(market);
            const precision = parseFloat(
                "1" + "0".repeat(market.info.price_max_precision ? market.info.price_max_precision : market.info.cost_precision)
            )

            this.history[symbolName] = {
                name: symbolName,
                description: `${coin.toUpperCase()}/${base.toUpperCase()} on ${this.exchange.name}`,
                ticker: symbolName,
                supported_resolutions: SUPPORTED_RESOLUTIONS,
                minmov: 1,
                pricescale: precision,
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

function getPrecisionPriceScale(num) {
    let zerosToAdd = num - 1;
    return 10 ** zerosToAdd;
}