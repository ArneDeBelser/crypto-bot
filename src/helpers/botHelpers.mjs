import { telegramInstance } from "../TelegramBot.mjs";
import { insertOrder, getLastOrder } from "../database/orders.mjs";
import { ExchangeError, InsufficientFunds } from "ccxt";

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
        if (error instanceof ExchangeError) {
            telegramInstance.sendMessage("Exchange error occured fetching user trades:" + error.message);
            console.log("Exchange error occured fetching user trades:" + error.message);
        } else {
            console.log(error);
        }
    }

}

export const fetchOrderBook = async (pairConfig, pair) => {
    try {
        const exchange = (await import(`../exchanges/${pairConfig.exchange}/nodeExchange.mjs`)).default;
        await exchange.signIn?.();
        return await exchange.fetchOrderBook(pair);
    } catch (error) {
        const errorMessage = `Error occurred fetching orderbook ${pair}: ${error.message}`;
        telegramInstance.sendMessage(errorMessage);
        console.error(errorMessage);
        return null;
    }
};

export const fetchKlines = async (pairConfig, pair, timeframe) => {
    try {
        const exchange = (await import(`../exchanges/${pairConfig.exchange}/nodeExchange.mjs`)).default;
        await exchange.signIn?.();
        return await exchange.fetchOHLCV(pair, timeframe);
    } catch (error) {
        const errorMessage = `Error occurred fetching klines ${pair}: ${error.message}`;
        telegramInstance.sendMessage(errorMessage);
        console.error(errorMessage);
        return null;
    }
};
export const fetchUserBalanceForPair = async (pairConfig, pair) => {
    try {
        const exchange = (await import(`../exchanges/${pairConfig.exchange}/nodeExchange.mjs`)).default;
        await exchange.signIn?.(); // Use optional chaining to check if signIn is a function
        const balance = await exchange.fetchBalance();
        const ticker = await fetchRealTicker(pairConfig, pair);
        const [base, quote] = pair.split('/');
        const baseBalance = balance[base]?.total || 0; // Use optional chaining and nullish coalescing to simplify the code
        const quoteBalance = balance[quote]?.total || 0;

        return {
            base: baseBalance,
            quote: quoteBalance,
            usdtValue: parseFloat(baseBalance) * parseFloat(ticker.last),
        };
    } catch (error) {
        const errorMessage = `Error occurred fetching user balance for pair ${pair}: ${error.message}`;
        telegramInstance.sendMessage(errorMessage);
        console.error(errorMessage);
        return null;
    }
};

export const fetchOpenOrders = async (pairConfig, pair) => {
    try {
        const exchange = (await import(`../exchanges/${pairConfig.exchange}/nodeExchange.mjs`)).default;
        await exchange.signIn?.(); // Use optional chaining to check if signIn is a function
        return await exchange.fetchOpenOrders(pair);
    } catch (error) {
        const errorMessage = `Error occurred fetching open orders for pair ${pair}: ${error.message}`;
        telegramInstance.sendMessage(errorMessage);
        console.error(errorMessage);
        return null;
    }
};

export const fetchRealTicker = async (pairConfig, pair) => {
    try {
        const exchange = (await import(`../exchanges/${pairConfig.exchange}/nodeExchange.mjs`)).default;
        await exchange.signIn?.(); // Use optional chaining to check if signIn is a function
        let ticker = null;

        try {
            ticker = await exchange.fetchTicker(pair);
        } catch (error) {
            if (error instanceof ExchangeError) {
                const ohlcv = await exchange.fetchOHLCV(pair, '1m', undefined, 1);
                ticker = { last: ohlcv[0][4] };
            } else {
                throw error; // Rethrow error if it's not an ExchangeError
            }
        }

        return ticker;
    } catch (error) {
        const errorMessage = `Error occurred fetching real ticker for pair ${pair}: ${error.message}`;
        telegramInstance.sendMessage(errorMessage);
        console.error(errorMessage);
        return null;
    }
};

export const createOrder = async (pairConfig, pair, type, side, amount, price, params = {}) => {
    try {
        const exchange = (await import(`../exchanges/${pairConfig.exchange}/nodeExchange.mjs`)).default;
        await exchange.signIn?.(); // Use optional chaining to check if signIn is a function
        await exchange.createOrder(pair, type, side, amount, price, params);
    } catch (error) {
        const errorMessages = {
            ExchangeError: `Exchange error occurred: ${pair} ${error.message}`,
            InsufficientFunds: `Insufficient funds error occurred: ${pair} ${error.message}`,
            default: `Error occurred creating order: ${pair} ${error.message}`,
        };
        const errorMessage = errorMessages[error.name] || errorMessages.default;
        telegramInstance.sendMessage(errorMessage);
        console.log(errorMessage);
        console.error(errorMessage);
        return null;
    }
};

export const cancelOrder = async (pairConfig, orderId, pair) => {
    try {
        const exchange = (await import(`../exchanges/${pairConfig.exchange}/nodeExchange.mjs`)).default;
        await exchange.signIn?.(); // Use optional chaining to check if signIn is a function
        await exchange.cancelOrder(orderId, pair);
    } catch (error) {
        const errorMessages = {
            ExchangeError: `Exchange error occurred: ${pair} ${error.message}`,
            InsufficientFunds: `Insufficient funds error occurred: ${pair} ${error.message}`,
            default: `Error occurred cancelling order: ${pair} ${error.message}`,
        };
        const errorMessage = errorMessages[error.name] || errorMessages.default;
        telegramInstance.sendMessage(errorMessage);
        console.log(errorMessage);
        console.error(errorMessage);
        return null;
    }
};


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