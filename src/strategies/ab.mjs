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
import { logToFile } from "../filelogger.mjs";

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

  const bigMoveThreshold = pairConfig.strategy.bigMoveThreshold || strategyConfigs.ab.bigMoveThreshold.defaultValue;

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
  const asks = bidsAndAsks.asks;
  const bids = bidsAndAsks.bids;

  // Run strategy
  // Filter out price levels that are out of kline range, by changing '1d' to f.e. '4h' you can make the range more "tight"
  const klines = await fetchKlines(pairConfig, pair, '4h');
  const isBigMove = bigMoveDetected(klines, bigMoveThreshold);
  //console.log(klines);
  // logToFile(klines);
  // console.log(isBigMove);

  // console.log('raw', bids);
  let askLevels = filterKlineRange(klines, asks, orderBook.asks[0][0], klineRangeLowAdjustmentFactor, klineRangeHighAdjustmentFactor);
  let bidLevels = filterKlineRange(klines, bids, orderBook.bids[0][0], klineRangeLowAdjustmentFactor, klineRangeHighAdjustmentFactor);
  //console.log('filterKlineRange ran', bidLevels);

  // Filter out orders too close to current price
  if (isBigMove.isBigMove === true) {
    //console.log('bigmove happend');
    // If we encouter a big move, we put our bid orders very low
    priceRangePercentageBid = isBigMove.percentageDifference * 0.5;
    // console.log('priceRangePercentageBid changed to:', priceRangePercentageBid);
  }

  // Get Last trade info, if it's a buy we filter our price levels accordignly
  const lastTradeInfo = getLastTradeInfo(trades);
  // console.log(lastTradeInfo);

  //console.log('askLevels', askLevels);
  // console.log('priceRangePercentageBid', priceRangePercentageBid);
  askLevels = filterCloseToCurrentPriceAsks(priceRangePercentageAsk, orderBook.asks[0][0], askLevels, "up", lastTradeInfo);
  bidLevels = filterCloseToCurrentPriceBids(priceRangePercentageBid, orderBook.bids[0][0], bidLevels, "down");
  // console.log('filterCloseToCurrentPrice ran', askLevels);

  //console.log('askLevels', askLevels);
  // Filter out numbers to close to already bought levels in this iteration
  askLevels = filterLevelsAsks(trades, askLevels, sellInvalidationThreshold, 'sell');
  bidLevels = filterLevelsBids(trades, bidLevels, buyInvalidationThreshold);
  // console.log('filterLevels ran', askLevels);

  // Filter out nubers within x percentage of eachother
  askLevels = filterNumbersWithinXPercentage(askLevels, askDifferenceThreshold); // We reserve here so that the last order (closest to current price) is checked first
  bidLevels = filterNumbersWithinXPercentage(bidLevels, bidDifferenceThreshold);
  // console.log('filterNumbersWithinXPercentage ran', bidLevels);

  // Get the last 5 asks 
  askLevels = askLevels.reverse().slice(-5);
  // Get the first 5 bids
  bidLevels = bidLevels.slice(0, 5);
  // console.log('After slice', bidLevels);

  let askOrdersWithAmount = calculateAskOrders(userBalance, askLevels, minUsdtAmount);
  let bidOrdersWithAmount = calculateBidOrders(userBalance, bidLevels, baseUsdtAmount, maxUsdtAmount);

  if (!testing) { // We pass a var testing via server.mjs endpoint if we are testing the strategy, so that no real orders are deleted/created
    //const ticker = await fetchRealTicker(pairConfig, pair);

    // Remove all current orders from the book
    const openOrders = await fetchOpenOrders(pairConfig, pair);
    openOrders.forEach(order => {
      cancelOrder(pairConfig, order.id, pair);
    });

    // Create all ask orders
    //console.log(askOrdersWithAmount);
    // This line filters out fake data created above. This fake data is created when we don't have actual baseValue to sell
    askOrdersWithAmount = askOrdersWithAmount.filter(order => !(order.amount === 0.0001 && order.amountUsdt === 4.9));
    // console.log(askOrdersWithAmount);
    askOrdersWithAmount.forEach(order => {
      createOrder(pairConfig, pair, 'limit', 'sell', order.amount, order.price);
    });

    // Create bid ask orders
    bidOrdersWithAmount.forEach(order => {
      createOrder(pairConfig, pair, 'limit', 'buy', order.amount, order.price);
    });
  } else {
    console.log('Testing strategy, not setting up orders');
  }

  // This part is needed for testing the strategy, this information is pushed into the TV chart on click "TEST STRATEGY".
  // The actual bot doesn't use this return values
  //console.log('before print', askOrdersWithAmount);
  return {
    asks: askOrdersWithAmount,
    bids: bidOrdersWithAmount
  };
}
