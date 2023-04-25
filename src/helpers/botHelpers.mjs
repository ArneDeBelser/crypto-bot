import { telegramInstance } from "../TelegramBot.mjs";
import { insertOrder, getLastOrder } from "../database/orders.mjs";
import { ExchangeError } from "ccxt";

export const logSymbol = (pairConfig) => {
    return `\x1b[33m[\x1b[32m${pairConfig.symbol}\u001b[37;1m:\u001b[31;1m${pairConfig.exchange}\u001b[37;1m:\u001b[34;1m${pairConfig.strategy.identifier}\x1b[33m]\x1b[0m`;
}

export const fetchUserTrades = async (pairConfig, pair, since) => {
    const lastOrder = await getLastOrder(pair, pairConfig.exchange);
    const exchangeObject = await import(`../exchanges/${pairConfig.exchange}/nodeExchange.mjs`);
    const exchange = exchangeObject.default;
    if (typeof exchange.signIn === 'function') await exchange.signIn(); // Only for probit

    try {
        const lastOrderTimestamp = lastOrder?.[0]?.timestamp;
        const sinceTimestamp = lastOrderTimestamp ? lastOrderTimestamp + 500 : since;
        let orders = [];

        if (lastOrderTimestamp) {
            // console.log(`Fetching trades for ${pair} since ${sinceTimestamp}`);
            orders = await exchange.fetchMyTrades(pair, sinceTimestamp);
        } else {
            // console.log(`Fetching all trades for ${pair} without timestamp`);
            orders = await exchange.fetchMyTrades(pair);
        }

        if (orders.length > 0) {
            // console.log(`Fetched ${orders.length} new trades for ${pair}`);
            for (const order of orders) {
                insertOrder(order, pairConfig.exchange);
            }

            const numOrders = orders.length;
            const message = numOrders <= 1 ? `New trade ${orders[0].symbol} for ${pairConfig.exchange}` : `${numOrders} new trades ${orders[0].symbol} for ${pairConfig.exchange}`;
            telegramInstance.sendMessage(message);
        } else {
            // console.log(`No new trades for ${pair} since ${sinceTimestamp}`);
        }
    } catch (error) {
        console.log(error);
    }

}

export const fetchOrderBook = async (pairConfig, pair) => {
    let orderBook = null;

    try {
        const exchangeObject = await import(`../exchanges/${pairConfig.exchange}/nodeExchange.mjs`);
        const exchange = exchangeObject.default;
        if (typeof exchange.signIn === 'function') await exchange.signIn(); // Only for probit

        orderBook = await exchange.fetchOrderBook(pair);
    } catch (error) {
        throw new Error('Something went wrong while fetching the orderbook', error);
    }

    return orderBook;
}

export const fetchKlines = async (pairConfig, pair, timeframe) => {
    let klines = null;

    try {
        const exchangeObject = await import(`../exchanges/${pairConfig.exchange}/nodeExchange.mjs`);
        const exchange = exchangeObject.default;
        if (typeof exchange.signIn === 'function') await exchange.signIn(); // Only for probit

        klines = await exchange.fetchOHLCV(pair, timeframe);
    } catch (error) {
        throw new Error('Something went wrong while fetching the candlestick data');
    }

    return klines;
}

export const fetchUserBalanceForPair = async (pairConfig, pair) => {
    try {
        const exchangeObject = await import(`../exchanges/${pairConfig.exchange}/nodeExchange.mjs`);
        const exchange = exchangeObject.default;
        if (typeof exchange.signIn === 'function') await exchange.signIn(); // Only for probit
        const balance = await exchange.fetchBalance();
        const ticker = await fetchRealTicker(pairConfig, pair);
        const [base, quote] = pair.split('/');
        const baseBalance = balance[base] ? balance[base].total : 0;
        const quoteBalance = balance[quote] ? balance[quote].total : 0;

        return {
            base: baseBalance,
            quote: quoteBalance,
            usdtValue: parseFloat(baseBalance) * parseFloat(ticker.last),
        };
    } catch (error) {
        console.error(error);
        return null;
    }
}

export const fetchOpenOrders = async (pairConfig, pair) => {
    let openOrders = null;

    try {
        const exchangeObject = await import(`../exchanges/${pairConfig.exchange}/nodeExchange.mjs`);
        const exchange = exchangeObject.default;
        if (typeof exchange.signIn === 'function') await exchange.signIn(); // Only for probit

        openOrders = await exchange.fetchOpenOrders(pair);
    } catch (error) {
        throw new Error('Something went wrong while fetching the candlestick data');
    }

    return openOrders;
}

export const fetchRealTicker = async (pairConfig, pair) => {
    try {
        const exchangeObject = await import(`../exchanges/${pairConfig.exchange}/nodeExchange.mjs`);
        const exchange = exchangeObject.default;
        if (typeof exchange.signIn === 'function') await exchange.signIn(); // Only for probit

        // Some hocus pocus to get ticker data in case the exchange has not fetchTicker availability
        let ticker;
        try {
            ticker = await exchange.fetchTicker(pair);
        } catch (error) {
            if (error instanceof ExchangeError) {
                try {
                    const ohlcv = await exchange.fetchOHLCV(pair, '1m', undefined, 1);
                    ticker = {};
                    ticker.last = ohlcv[0][4];
                } catch (error) {
                    throw new Error('Something went wrong while trying to get ticker, even OHLCV is not working - Arne');
                }
            }
        }

        return ticker;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export const createOrder = async (pairConfig, pair, type, side, amount, price, params = {}) => {
    const exchangeObject = await import(`../exchanges/${pairConfig.exchange}/nodeExchange.mjs`);
    const exchange = exchangeObject.default;
    if (typeof exchange.signIn === 'function') await exchange.signIn(); // Only for probit

    // console.log('----------');
    // console.log(amount);
    // console.log(price);
    // console.log(amount * price);
    // console.log('----------');

    await exchange.createOrder(pair, type, side, amount, price, params = {});
    try {
    } catch (error) {
        throw new Error(`Something went wrong while creating order for ${pair}`);
    }
}

export const cancelOrder = async (pairConfig, orderId, pair) => {
    try {
        const exchangeObject = await import(`../exchanges/${pairConfig.exchange}/nodeExchange.mjs`);
        const exchange = exchangeObject.default;
        if (typeof exchange.signIn === 'function') await exchange.signIn(); // Only for probit

        await exchange.cancelOrder(orderId, pair);
    } catch (error) {
        throw new Error(`Something went wrong while cancelling order #${orderId} | ${pair}`);
    }
}

export const mapBidAsks = async (orderBook) => {
    return Object.entries(orderBook)
        .reduce((acc, [key, value]) => {
            if (key === 'bids' || key === 'asks') {
                const mappedArray = value.map(([price]) => price);
                acc[key] = mappedArray;
            }
            return acc;
        }, {});
}

export const convertScientificToFloat = (num) => {
    // If the number is not in scientific notation return it as it is.
    if (!/\d+\.?\d*e[+-]*\d+/i.test(num)) {
        return num;
    }

    // Remove the sign.
    const numberSign = Math.sign(Number(num));
    num = Math.abs(Number(num)).toString();

    // Parse into coefficient and exponent.
    const [coefficient, exponent] = num.toLowerCase().split("e");
    let zeros = Math.abs(Number(exponent));
    const exponentSign = Math.sign(Number(exponent));
    const [integer, decimals] = (coefficient.indexOf(".") != -1 ? coefficient : `${coefficient}.`).split(".");

    if (exponentSign === -1) {
        zeros -= integer.length;
        num =
            zeros < 0
                ? integer.slice(0, zeros) + "." + integer.slice(zeros) + decimals
                : "0." + "0".repeat(zeros) + integer + decimals;
    } else {
        if (decimals) zeros -= decimals.length;
        num =
            zeros < 0
                ? integer + decimals.slice(0, zeros) + "." + decimals.slice(zeros)
                : integer + decimals + "0".repeat(zeros);
    }

    return numberSign < 0 ? "-" + num : num;
}