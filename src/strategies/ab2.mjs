import { strategyConfigs } from "../config/strategy.mjs";
import { logSymbol, fetchUserTrades, fetchOrderBook, fetchKlines, mapBidAsks } from "../helpers/botHelpers.mjs";
import { filterNumbersWithinXPercentage } from "./algoritms/filternumberswithinxpercentage.mjs";
import { findPriceGaps, addOrdersInGaps } from "./algoritms/findgap.mjs";
import { filterCloseToCurrentPrice } from "./algoritms/filterclosetocurrentprice.mjs";

export default async function abStrategy(pairConfig, pair) {
  console.log(`${logSymbol(pairConfig)} Running "ab.mjs" strategy`);

  // Fetch new orders
  fetchUserTrades(pairConfig, pair);

  // Setup strategy parameters
  const gapThresholdMulitplier = pairConfig.strategy.gapThresholdMulitplier || strategyConfigs.ab.gapThresholdMulitplier.defaultValue;
  const highestPriceModifier = pairConfig.strategy.highestPriceModifier || strategyConfigs.ab.highestPriceModifier.defaultValue;
  const lowestPriceModifier = pairConfig.strategy.lowestPriceModifier || strategyConfigs.ab.lowestPriceModifier.defaultValue;
  const closeToCurrentPricePercentageAsk = pairConfig.strategy.closeToCurrentPricePercentageAsk || strategyConfigs.ab.closeToCurrentPricePercentageAsk.defaultValue;
  const closeToCurrentPricePercentageBid = pairConfig.strategy.closeToCurrentPricePercentageBid || strategyConfigs.ab.closeToCurrentPricePercentageBid.defaultValue;
  const filterAskThreshold = pairConfig.strategy.filterAskThreshold || strategyConfigs.ab.filterAskThreshold.defaultValue;
  const filterBidThreshold = pairConfig.strategy.filterBidThreshold || strategyConfigs.ab.filterBidThreshold.defaultValue;

  // Fetch orderbook 
  fetchOrderBook(pairConfig, pair);

  // Fetch klines
  fetchKlines(pairConfig, pair, '4h');

  const isSpiking = hasTwoSidesSpikes(klines);

  // Map bids and asks
  const bidsAndAsks = mapBidAsks(orderBook);

  const asks = bidsAndAsks.asks.reverse();
  const bids = bidsAndAsks.bids;

  // Run strategy
  // Loop through bids and print out the first element
  // const askGaps = findPriceGaps(asks, gapThresholdMulitplier);
  // let askOrders = addOrdersInGaps(askGaps, "sell", highestPriceModifier, lowestPriceModifier);

  // // Loop through asks and print out the first element
  // const bidGaps = findPriceGaps(bids, gapThresholdMulitplier);
  // let bidOrders = addOrdersInGaps(bidGaps, "buy", highestPriceModifier, lowestPriceModifier);

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
