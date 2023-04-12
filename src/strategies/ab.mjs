import { logSymbol, fetchOrders } from "../helpers/botHelpers.mjs";
import { findPriceGaps, addOrdersInGaps } from "./algoritms/findgap.mjs";
import { strategyConfigs } from "../config/strategy.mjs";

export default async function abStrategy(pairConfig, pair = undefined) {
  console.log(`${logSymbol(pairConfig)} Running "ab.mjs" strategy`);

  // This little check just makes sure that if we are testing a pairconfig with "default", the pair is set to the symbol that is being tested at the given moment
  if (pair !== undefined) {
    pairConfig.symbol = pair;
  }

  // Fetch new orders
  fetchOrders(pairConfig);

  // Setup strategy parameters
  const gapThresholdMulitplier = pairConfig.gapThresholdMulitplier || strategyConfigs.ab.gapThresholdMulitplier.defaultValue;
  const highestPriceModifier = pairConfig.highestPriceModifier || strategyConfigs.ab.highestPriceModifier.defaultValue;
  const lowestPriceModifier = pairConfig.lowestPriceModifier || strategyConfigs.ab.lowestPriceModifier.defaultValue;

  // Fetch orderbook
  let orderBook = null;
  try {
    const exchangeObject = await import(`../exchanges/${pairConfig.exchange}/nodeExchange.mjs`);
    const exchange = exchangeObject.default;
    orderBook = await exchange.fetchOrderBook(pairConfig.symbol);
  } catch (error) {
    console.log(error);
    throw new Error('Something went wrong while fetching the orderbook');
  }

  // Map bids and asks
  const bidsAndAsks = Object.entries(orderBook)
    .reduce((acc, [key, value]) => {
      if (key === 'bids' || key === 'asks') {
        const mappedArray = value.map(([price]) => price);
        acc[key] = mappedArray;
      }
      return acc;
    }, {});

  const bids = bidsAndAsks.bids;
  const asks = bidsAndAsks.asks;

  // Run strategy
  // Loop through bids and print out the first element
  const askGaps = findPriceGaps(asks, gapThresholdMulitplier);
  const askOrders = addOrdersInGaps(askGaps, "sell", highestPriceModifier, lowestPriceModifier);

  // Loop through asks and print out the first element
  const bidGaps = findPriceGaps(bids, gapThresholdMulitplier);
  const bidOrders = addOrdersInGaps(bidGaps, "buy", highestPriceModifier, lowestPriceModifier);

  // This part is needed for testing the strategy, the actual bot doesn't use this part
  return {
    asks: askOrders,
    bids: bidOrders
  };
}