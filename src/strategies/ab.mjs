import { strategyConfigs } from "../config/strategy.mjs";
import { logSymbol, fetchOrders, fetchOrderBook, fetchKlines, mapBidAsks } from "../helpers/botHelpers.mjs";
import { filterNumbersWithinXPercentage } from "./algoritms/filternumberswithinxpercentage.mjs";
import { filterCloseToCurrentPrice } from "./algoritms/filterclosetocurrentprice.mjs";

export default async function strategy(pairConfig, pair) {
  console.log(`${logSymbol(pairConfig)} Running "ab" strategy`);

  // Setup strategy parameters
  const closeToCurrentPricePercentageAsk = pairConfig.strategy.closeToCurrentPricePercentageAsk || strategyConfigs.ab.closeToCurrentPricePercentageAsk.defaultValue;
  const closeToCurrentPricePercentageBid = pairConfig.strategy.closeToCurrentPricePercentageBid || strategyConfigs.ab.closeToCurrentPricePercentageBid.defaultValue;
  const filterAskThreshold = pairConfig.strategy.filterAskThreshold || strategyConfigs.ab.filterAskThreshold.defaultValue;
  const filterBidThreshold = pairConfig.strategy.filterBidThreshold || strategyConfigs.ab.filterBidThreshold.defaultValue;

  // Fetching all the required data
  // Fetch new orders
  await fetchOrders(pairConfig, pair);
  // Fetch orderbook 
  const orderBook = await fetchOrderBook(pairConfig, pair);

  // Map bids and asks
  const bidsAndAsks = await mapBidAsks(orderBook);
  const asks = bidsAndAsks.asks.reverse();
  const bids = bidsAndAsks.bids;

  // Run strategy
  // Filter out orders too close to current price
  let askOrders = filterCloseToCurrentPrice(closeToCurrentPricePercentageAsk, orderBook.asks[0][0], asks, "up");
  let bidOrders = filterCloseToCurrentPrice(closeToCurrentPricePercentageBid, orderBook.bids[0][0], bids, "down");

  // Filter out nubers within x percentage of eachother
  askOrders = filterNumbersWithinXPercentage(askOrders, filterAskThreshold);
  bidOrders = filterNumbersWithinXPercentage(bidOrders, filterBidThreshold);

  // Get the last 5 asks 
  askOrders = askOrders.slice(-5);
  // Get the first 5 bids
  bidOrders = bidOrders.slice(0, 5);

  // Never put a sell order below currentprice
  // Never put a buy order above current price

  // This part is needed for testing the strategy, the actual bot doesn't use this part
  return {
    asks: askOrders,
    bids: bidOrders
  };
}
