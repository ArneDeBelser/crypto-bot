import { strategyConfigs } from "../config/strategy.mjs";
import { getAllOrdersByPair } from "../database/orders.mjs";
import { fetchOrderBook, fetchUserBalanceForPair, fetchOpenOrders, fetchUserTrades, logSymbol, mapBidAsks, createOrder, cancelOrder, fetchKlines, fetchRealTicker } from "../helpers/botHelpers.mjs";
import { filterLevelsAsks, filterLevelsBids } from "./algoritms/filterLevels.mjs";
import { filterCloseToCurrentPriceAsks, filterCloseToCurrentPriceBids } from "./algoritms/filterCloseToCurrentPrice.mjs";
import { filterNumbersWithinXPercentage } from "./algoritms/filterNumbersWithinXPercentage.mjs";
import { filterKlineRange } from "./algoritms/filterKlineRange.mjs";
import { calculateAskOrders, calculateBidOrders } from "./algoritms/calculateBidAskOrderAmounts.mjs";
import { bigMoveDetected } from "./algoritms/bigmove.mjs";
import { getLastTradeInfo } from "./algoritms/getlastbuy.mjs";

export default async function strategy(pairConfig, pair, testing = false) {
  console.log(`${logSymbol(pairConfig)} Running "ab" strategy`);

  // Setup strategy parameters
  const baseUsdtAmount = pairConfig.baseUsdtAmount || strategyConfigs.baseUsdtAmount.defaultValue;
  const minUsdtAmount = pairConfig.minUsdtAmount || strategyConfigs.minUsdtAmount.defaultValue;
  const maxUsdtAmount = pairConfig.maxUsdtAmount || strategyConfigs.maxUsdtAmount.defaultValue;

  const klineRangeLowAdjustmentFactor = pairConfig.strategy.klineRangeLowAdjustmentFactor || strategyConfigs.ab.klineRangeLowAdjustmentFactor.defaultValue;
  const klineRangeHighAdjustmentFactor = pairConfig.strategy.klineRangeHighAdjustmentFactor || strategyConfigs.ab.klineRangeHighAdjustmentFactor.defaultValue;

  const priceRangePercentageAsk = pairConfig.strategy.priceRangePercentageAsk || strategyConfigs.ab.priceRangePercentageAsk.defaultValue;
  let priceRangePercentageBid = pairConfig.strategy.priceRangePercentageBid || strategyConfigs.ab.priceRangePercentageBid.defaultValue;

  const askDifferenceThreshold = pairConfig.strategy.askDifferenceThreshold || strategyConfigs.ab.askDifferenceThreshold.defaultValue;
  const bidDifferenceThreshold = pairConfig.strategy.bidDifferenceThreshold || strategyConfigs.ab.bidDifferenceThreshold.defaultValue;

  const sellInvalidationThreshold = pairConfig.strategy.sellInvalidationThreshold || strategyConfigs.ab.sellInvalidationThreshold.defaultValue;
  const buyInvalidationThreshold = pairConfig.strategy.buyInvalidationThreshold || strategyConfigs.ab.buyInvalidationThreshold.defaultValue;

  // Fetching all the required data
  // Fetch new orders and assign all orders to trades which is later used
  await fetchUserTrades(pairConfig, pair);
  const trades = await getAllOrdersByPair(pairConfig.exchange, pair);
  //  console.log(trades);

  // Fetch user balance so we know the USDT value for the given pair
  const userBalance = await fetchUserBalanceForPair(pairConfig, pair);


  // Fetch orderbook so we can set up our levels
  const orderBook = await fetchOrderBook(pairConfig, pair);

  // Map bids and asks
  const bidsAndAsks = await mapBidAsks(orderBook);
  const asks = bidsAndAsks.asks;
  const bids = bidsAndAsks.bids;

  // Run strategy
  // Filter out price levels that are out of kline range, by changing '1d' to f.e. '4h' you can make the range more "tight"
  const klines = await fetchKlines(pairConfig, pair, '4h');
  const isBigMove = bigMoveDetected(klines);

  //  console.log(klines);
  //console.log(isBigMove);

  // console.log('raw', bids);
  let askOrders = filterKlineRange(klines, asks, orderBook.asks[0][0], klineRangeLowAdjustmentFactor, klineRangeHighAdjustmentFactor);
  let bidOrders = filterKlineRange(klines, bids, orderBook.bids[0][0], klineRangeLowAdjustmentFactor, klineRangeHighAdjustmentFactor);
  console.log('filterKlineRange ran', askOrders);

  // Filter out orders too close to current price
  if (isBigMove.isBigMove === true) {
    // If we encouter a big move, we put our bid orders very low
    priceRangePercentageBid = isBigMove.percentageChange * 0.5;
  }

  // Get Last trade info, if it's a buy we filter our price levels accordignly
  const lastTradeInfo = getLastTradeInfo(trades);
  // console.log(lastTradeInfo);

  //console.log('askOrders', askOrders);
  // console.log('priceRangePercentageBid', priceRangePercentageBid);
  askOrders = filterCloseToCurrentPriceAsks(priceRangePercentageAsk, orderBook.asks[0][0], askOrders, "up", lastTradeInfo);
  bidOrders = filterCloseToCurrentPriceBids(priceRangePercentageBid, orderBook.bids[0][0], bidOrders, "down");
  console.log('filterCloseToCurrentPrice ran', askOrders);

  //console.log('askOrders', askOrders);
  // Filter out numbers to close to already bought levels in this iteration
  askOrders = filterLevelsAsks(trades, askOrders, sellInvalidationThreshold, 'sell');
  bidOrders = filterLevelsBids(trades, bidOrders, buyInvalidationThreshold);
  console.log('filterLevels ran', askOrders);

  // Filter out nubers within x percentage of eachother
  askOrders = filterNumbersWithinXPercentage(askOrders, askDifferenceThreshold); // We reserve here so that the last order (closest to current price) is checked first
  bidOrders = filterNumbersWithinXPercentage(bidOrders, bidDifferenceThreshold);
  console.log('filterNumbersWithinXPercentage ran', askOrders);

  // Get the last 5 asks 
  askOrders = askOrders.reverse().slice(-5);
  // Get the first 5 bids
  bidOrders = bidOrders.slice(0, 5);
  console.log('After slice', askOrders);

  const ticker = await fetchRealTicker(pairConfig, pair);

  askOrders = calculateAskOrders(userBalance, askOrders, ticker.last, minUsdtAmount);
  // console.log('askOrders', askOrders);
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
