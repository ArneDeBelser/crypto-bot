import { logName } from "../helpers/botHelpers.mjs";
import { insertOrder, getLastOrder } from "../database/orders.mjs";
import bitmart from "../exchanges/bitmart/bitmartNode.mjs";

export default function abStrategy(pairConfig) {
  console.log(`${logName(pairConfig)} Running ab.mjs strategy`);

  fetchOrders(pairConfig)
}

const fetchOrders = async (pairConfig, since) => {
  const lastOrder = await getLastOrder(pairConfig.name);
  console.log('lastOrder', lastOrder);

  const sinceTimestamp = lastOrder ? lastOrder.timestamp : since;
  console.log('sinceTimestamp', sinceTimestamp);

  const orders = await bitmart.fetchMyTrades(pairConfig.name, sinceTimestamp);

  for (const order of orders) {
    insertOrder(order);
  }
}