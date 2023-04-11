import { insertOrder, getLastOrder } from "../database/orders.mjs";
//import { sendMessage } from '../TelegramBot.mjs';

export const logName = (pairConfig) => {
    return `\x1b[33m[\x1b[32m${pairConfig.name}\u001b[37;1m:\u001b[31;1m${pairConfig.exchange}\u001b[37;1m:\u001b[34;1m${pairConfig.strategy}\x1b[33m]\x1b[0m`;
}

export const fetchOrders = async (pairConfig, since) => {
    const lastOrder = await getLastOrder(pairConfig.name, pairConfig.exchange);
    const exchangeObject = await import(`../exchanges/${pairConfig.exchange}/nodeExchange.mjs`);
    const exchange = exchangeObject.default

    try {
        if (lastOrder && lastOrder.length > 0) {
            const lastOrderTimestamp = lastOrder[0]?.timestamp;
            const bufferTime = 5000; // 5 seconds
            const sinceTimestamp = lastOrderTimestamp ? lastOrderTimestamp + bufferTime : since;
            const orders = await exchange.fetchMyTrades(pairConfig.name, sinceTimestamp);

            for (const order of orders) {
                insertOrder(order, pairConfig.exchange);
                //sendMessage(`New trade ${order.symbol} for ${pairConfig.exchange}`);
            }
        } else {
            const orders = await exchange.fetchMyTrades(pairConfig.name, since);
            for (const order of orders) {
                insertOrder(order, pairConfig.exchange);
                // sendMessage(`New trade ${order.symbol} for ${pairConfig.exchange}`);
            }
        }
    } catch (error) {
        console.log(error);
    }
}
