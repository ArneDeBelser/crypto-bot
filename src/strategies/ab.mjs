import { strategyConfigs } from "../config/strategy.mjs";
import { getAllOrdersByPair } from "../database/orders.mjs";
import { fetchOrderBook, fetchUserBalanceForPair, fetchOpenOrders, fetchUserTrades, logSymbol, mapBidAsks, createOrder, cancelOrder, fetchKlines, fetchRealTicker } from "../helpers/botHelpers.mjs";
import { filterLevels } from "./algoritms/filterLevels.mjs";
import { filterCloseToCurrentPrice } from "./algoritms/filterCloseToCurrentPrice.mjs";
import { filterNumbersWithinXPercentage } from "./algoritms/filterNumbersWithinXPercentage.mjs";
import { filterKlineRange } from "./algoritms/filterKlineRange.mjs";
import { calculateAskOrders, calculateBidOrders } from "./algoritms/calculateBidAskOrderAmounts.mjs";

export default async function strategy(pairConfig, pair, testing = false) {
  console.log(`${logSymbol(pairConfig)} Running "ab" strategy`);

  // Setup strategy parameters
  const baseUsdtAmount = pairConfig.baseUsdtAmount || strategyConfigs.baseUsdtAmount.defaultValue;
  const minUsdtAmount = pairConfig.minUsdtAmount || strategyConfigs.minUsdtAmount.defaultValue;
  const maxUsdtAmount = pairConfig.maxUsdtAmount || strategyConfigs.maxUsdtAmount.defaultValue;

  const klineRangeLowAdjustmentFactor = pairConfig.strategy.klineRangeLowAdjustmentFactor || strategyConfigs.ab.klineRangeLowAdjustmentFactor.defaultValue;
  const klineRangeHighAdjustmentFactor = pairConfig.strategy.klineRangeHighAdjustmentFactor || strategyConfigs.ab.klineRangeHighAdjustmentFactor.defaultValue;

  const priceRangePercentageAsk = pairConfig.strategy.priceRangePercentageAsk || strategyConfigs.ab.priceRangePercentageAsk.defaultValue;
  const priceRangePercentageBid = pairConfig.strategy.priceRangePercentageBid || strategyConfigs.ab.priceRangePercentageBid.defaultValue;

  const askDifferenceThreshold = pairConfig.strategy.askDifferenceThreshold || strategyConfigs.ab.askDifferenceThreshold.defaultValue;
  const bidDifferenceThreshold = pairConfig.strategy.bidDifferenceThreshold || strategyConfigs.ab.bidDifferenceThreshold.defaultValue;

  const sellInvalidationThreshold = pairConfig.strategy.sellInvalidationThreshold || strategyConfigs.ab.sellInvalidationThreshold.defaultValue;
  const buyInvalidationThreshold = pairConfig.strategy.buyInvalidationThreshold || strategyConfigs.ab.buyInvalidationThreshold.defaultValue;

  // Fetching all the required data
  // Fetch new orders and assign all orders to trades which is later used
  await fetchUserTrades(pairConfig, pair);
  const trades = await getAllOrdersByPair(pairConfig.exchange, pair);
  // console.log(trades);

  // Fetch user balance so we know the USDT value for the given pair
  const userBalance = await fetchUserBalanceForPair(pairConfig, pair);

  // Fetch orderbook so we can set up our levels
  const orderBook = await fetchOrderBook(pairConfig, pair);

  // Map bids and asks
  const bidsAndAsks = await mapBidAsks(orderBook);
  const asks = bidsAndAsks.asks.reverse();
  const bids = bidsAndAsks.bids;

  // Run strategy
  // Filter out price levels that are out of kline range, by changing '1d' to f.e. '4h' you can make the range more "tight"
  const klines = await fetchKlines(pairConfig, pair, '1d');
  let askOrders = filterKlineRange(klines, asks, orderBook.asks[0][0], klineRangeLowAdjustmentFactor, klineRangeHighAdjustmentFactor);
  let bidOrders = filterKlineRange(klines, bids, orderBook.bids[0][0], klineRangeLowAdjustmentFactor, klineRangeHighAdjustmentFactor);

  // Filter out orders too close to current price
  askOrders = filterCloseToCurrentPrice(priceRangePercentageAsk, orderBook.asks[0][0], askOrders, "up");
  bidOrders = filterCloseToCurrentPrice(priceRangePercentageBid, orderBook.bids[0][0], bidOrders, "down");

  // Filter out numbers to close to already bought levels in this iteration
  askOrders = filterLevels(trades, askOrders, sellInvalidationThreshold);
  bidOrders = filterLevels(trades, bidOrders, buyInvalidationThreshold);

  // Filter out nubers within x percentage of eachother
  askOrders = filterNumbersWithinXPercentage(askOrders, askDifferenceThreshold);
  bidOrders = filterNumbersWithinXPercentage(bidOrders, bidDifferenceThreshold);

  // Get the last 5 asks 
  askOrders = askOrders.slice(-5);
  // Get the first 5 bids
  bidOrders = bidOrders.slice(0, 5);

  const ticker = await fetchRealTicker(pairConfig, pair);

  askOrders = calculateAskOrders(userBalance, askOrders, ticker.last, minUsdtAmount);
  bidOrders = calculateBidOrders(userBalance, bidOrders, ticker.last, baseUsdtAmount, maxUsdtAmount);

  if (!testing) { // We pass a var testing via server.mjs endpoint if we are testing the strategy, so that no real orders are deleted/created
    // Remove all current orders from the book
    const openOrders = await fetchOpenOrders(pairConfig, pair);
    openOrders.forEach(order => {
      cancelOrder(pairConfig, order.id, pair);
    });

    // Create all ask orders
    askOrders.forEach(order => {
      createOrder(pairConfig, pair, 'limit', 'sell', order.amount, order.price);
    });

    // Create bid ask orders
    bidOrders.forEach(order => {
      createOrder(pairConfig, pair, 'limit', 'buy', order.amount, order.price);
    });
  } else {
    console.log('Testing strategy, not setting up orders');
  }

  // This part is needed for testing the strategy, this information is pushed into the TV chart on click "TEST STRATEGY".
  // The actual bot doesn't use this return values
  return {
    asks: askOrders,
    bids: bidOrders
  };
}
