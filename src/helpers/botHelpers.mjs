import { insertOrder, getLastOrder } from "../database/orders.mjs";
//import { sendMessage } from '../TelegramBot.mjs';

export const logSymbol = (pairConfig) => {
    return `\x1b[33m[\x1b[32m${pairConfig.symbol}\u001b[37;1m:\u001b[31;1m${pairConfig.exchange}\u001b[37;1m:\u001b[34;1m${pairConfig.strategy.identifier}\x1b[33m]\x1b[0m`;
}

export const fetchUserTrades = async (pairConfig, pair, since) => {
    const lastOrder = await getLastOrder(pair, pairConfig.exchange);
    const exchangeObject = await import(`../exchanges/${pairConfig.exchange}/nodeExchange.mjs`);
    const exchange = exchangeObject.default;
    if (typeof exchange.signIn === 'function') await exchange.signIn(); // Only for probit

    try {
        if (lastOrder && lastOrder.length > 0) {
            const lastOrderTimestamp = lastOrder[0]?.timestamp;
            const bufferTime = 500; // 0.5 seconds
            const sinceTimestamp = lastOrderTimestamp ? lastOrderTimestamp + bufferTime : since;
            const orders = await exchange.fetchMyTrades(pair, sinceTimestamp);

            for (const order of orders) {
                insertOrder(order, pairConfig.exchange);
                //sendMessage(`New trade ${order.symbol} for ${pairConfig.exchange}`);
            }
        } else {
            const orders = await exchange.fetchMyTrades(pair, since);
            for (const order of orders) {
                insertOrder(order, pairConfig.exchange);
                // sendMessage(`New trade ${order.symbol} for ${pairConfig.exchange}`);
            }
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
        const [base, quote] = pair.split('/');

        return {
            base: balance[base] ? balance[base].total : 0,
            quote: balance[quote] ? balance[quote].total : 0
        };
    } catch (error) {
        console.error(error);
        return null;
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