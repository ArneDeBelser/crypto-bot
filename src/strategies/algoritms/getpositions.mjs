export async function filterPriceLevels(trades, priceLevels) {
    const lastTrade = trades[trades.length - 1];
    const lastTradePrice = lastTrade.price_avg;
    const lastTradeAmount = lastTrade.amount;
    const sellTrades = trades.filter(trade => trade.side === 'sell' && trade.amount === lastTradeAmount);
    const maxSellPrice = sellTrades.length > 0 ? Math.max(...sellTrades.map(trade => trade.price_avg)) : Number.MAX_VALUE;
    const filteredPriceLevels = priceLevels.filter(price => price <= lastTradePrice * 0.90 && price >= maxSellPrice);
    return filteredPriceLevels;
}


export async function extractLevels(trades) {
    const buys = {};
    const sells = {};

    // group trades by their side and price_avg
    for (const trade of trades) {
        if (trade.side === 'buy' && !(trade.price_avg in sells)) {
            buys[trade.price_avg] = true;
        } else if (trade.side === 'sell' && !(trade.price_avg in buys)) {
            sells[trade.price_avg] = true;
        }
    }

    return {
        buys: Object.keys(buys),
        sells: Object.keys(sells),
    };
}


// export const makePositions = async (trades) => {

//     const positions = [];
//     let currentPosition = null;
//     let coinsBought = 0;
//     let coinsSold = 0;

//     for (let i = 0; i < trades.length; i++) {
//         const trade = trades[i];

//         if (trade.side === 'buy') {
//             coinsBought += trade.amount;

//             if (currentPosition !== null) {
//                 currentPosition.profit = currentPosition.cost - coinsSold * trade.price_avg;
//                 currentPosition.isOpen = false;
//                 positions.push(currentPosition);
//             }

//             currentPosition = {
//                 buys: [trade],
//                 sells: [],
//                 amountBought: coinsBought,
//                 amountSold: coinsSold,
//                 cost: coinsBought * trade.price_avg,
//                 profit: 0,
//                 isOpen: true,
//             };
//         } else if (trade.side === 'sell') {
//             coinsSold += trade.amount;

//             currentPosition.sells.push(trade);
//             currentPosition.amountSold = coinsSold;
//             currentPosition.profit = currentPosition.cost - coinsSold * trade.price_avg;

//             if (coinsSold === coinsBought) {
//                 currentPosition.isOpen = false;
//                 positions.push(currentPosition);
//                 currentPosition = null;
//                 coinsBought = 0;
//                 coinsSold = 0;
//             }
//         }
//     }

//     if (currentPosition !== null) {
//         currentPosition.profit = currentPosition.cost - coinsSold * currentPosition.buys[0].price_avg;
//         currentPosition.isOpen = true;
//         positions.push(currentPosition);
//     }

//     return positions;
// }

// export const makePositions = async (trades) => {
//     let positions = [];
//     let currentPos = {
//         buys: [],
//         sells: [],
//         totalBought: 0,
//         totalSold: 0,
//         isOpen: false
//     };

//     for (let i = 0; i < trades.length; i++) {
//         let trade = trades[i];
//         if (trade.side === 'buy') {
//             if (currentPos.sells.length > 0 || currentPos.totalSold > currentPos.totalBought) {
//                 console.log(`New position opened: ${JSON.stringify(currentPos)}`);
//                 positions.push(currentPos);
//                 currentPos = { buys: [trade], sells: [], totalBought: trade.amount, totalSold: 0, isOpen: true };
//             } else {
//                 currentPos.buys.push(trade);
//                 currentPos.totalBought += trade.amount;
//                 currentPos.isOpen = currentPos.totalSold < currentPos.totalBought;
//             }
//         } else {
//             if (currentPos.buys.length === 0) {
//                 console.log(`Sell trade without a matching buy trade: ${JSON.stringify(trade)}`);
//             } else {
//                 currentPos.sells.push(trade);
//                 currentPos.totalSold += trade.amount;
//                 currentPos.isOpen = currentPos.totalSold < currentPos.totalBought;
//                 if (!currentPos.isOpen) {
//                     console.log(`Position closed: ${JSON.stringify(currentPos)}`);
//                     positions.push(currentPos);
//                     currentPos = { buys: [], sells: [], totalBought: 0, totalSold: 0, isOpen: false };
//                 }
//             }
//         }
//     }

//     if (currentPos.totalBought > currentPos.totalSold) {
//         currentPos.isOpen = true;
//     }
//     if (currentPos.buys.length > 0 || currentPos.sells.length > 0) {
//         console.log(`Last position still open: ${JSON.stringify(currentPos)}`);
//         currentPos.isOpen = true;
//         positions.push(currentPos);
//     }

//     return positions;
// }


// export const makePositions = async (trades) => {
//     let positions = [];
//     let currentPos = {
//         buys: [],
//         sells: [],
//         totalBought: 0,
//         totalSold: 0,
//         isOpen: false
//     };

//     for (let i = 0; i < trades.length; i++) {
//         let trade = trades[i];
//         if (trade.side === 'buy') {
//             if (currentPos.sells.length > 0) {
//                 console.log(`New position opened: ${JSON.stringify(currentPos)}`);
//                 positions.push(currentPos);
//                 currentPos = { buys: [trade], sells: [], totalBought: trade.amount, totalSold: 0, isOpen: true };
//             } else {
//                 currentPos.buys.push(trade);
//                 currentPos.totalBought += trade.amount;
//                 currentPos.isOpen = currentPos.totalSold < currentPos.totalBought;
//             }
//         } else {
//             if (currentPos.buys.length === 0) {
//                 console.log(`Sell trade without a matching buy trade: ${JSON.stringify(trade)}`);
//             } else {
//                 currentPos.sells.push(trade);
//                 currentPos.totalSold += trade.amount;
//                 currentPos.isOpen = currentPos.totalSold < currentPos.totalBought;
//                 if (!currentPos.isOpen) {
//                     console.log(`Position closed: ${JSON.stringify(currentPos)}`);
//                     positions.push(currentPos);
//                     currentPos = { buys: [], sells: [], totalBought: 0, totalSold: 0, isOpen: false };
//                 }
//             }
//         }
//     }

//     if (currentPos.totalBought > currentPos.totalSold) {
//         currentPos.isOpen = true;
//     }
//     if (currentPos.buys.length > 0 || currentPos.sells.length > 0) {
//         console.log(`Last position still open: ${JSON.stringify(currentPos)}`);
//         positions.push(currentPos);
//     }

//     return positions;
// }


// export const createPositions = async (trades) => {
//     const positions = {};

//     for (const trade of trades) {
//         const { symbol, side, amount, price_avg, cost } = trade;
//         const key = `${symbol}-${side}`;
//         if (!positions[key]) {
//             positions[key] = {
//                 symbol,
//                 side,
//                 amount: 0,
//                 cost: 0,
//                 openTrades: [],
//                 closedTrades: [],
//             };
//         }
//         if (side === 'buy') {
//             positions[key].amount += amount;
//             positions[key].cost += cost;
//             positions[key].openTrades.push(trade);
//             console.log(`Added ${amount} ${symbol} bought at ${price_avg} for a total cost of ${cost}`);
//         } else if (side === 'sell') {
//             let remainingAmount = amount;
//             while (remainingAmount > 0 && positions[key].openTrades.length > 0) {
//                 const openTrade = positions[key].openTrades[0];
//                 if (remainingAmount >= openTrade.amount) {
//                     remainingAmount -= openTrade.amount;
//                     positions[key].amount -= openTrade.amount;
//                     positions[key].cost -= openTrade.cost;
//                     positions[key].closedTrades.push(openTrade);
//                     positions[key].openTrades.shift();
//                     console.log(`Closed ${openTrade.amount} ${symbol} bought at ${openTrade.price_avg} for a total cost of ${openTrade.cost}`);
//                 } else {
//                     openTrade.amount -= remainingAmount;
//                     openTrade.cost -= remainingAmount * openTrade.price_avg;
//                     positions[key].amount -= remainingAmount;
//                     positions[key].cost -= remainingAmount * openTrade.price_avg;
//                     console.log(`Partially closed ${remainingAmount} ${symbol} bought at ${openTrade.price_avg} for a total cost of ${remainingAmount * openTrade.price_avg}`);
//                     remainingAmount = 0;
//                 }
//             }
//             if (remainingAmount > 0) {
//                 console.log(`Remaining ${remainingAmount} ${symbol} sold at ${price_avg} for a total of ${remainingAmount * price_avg}`);
//                 positions[key].closedTrades.push({
//                     ...trade,
//                     amount: remainingAmount,
//                     cost: remainingAmount * price_avg,
//                 });
//             }
//         }
//     }

//     console.log(Object.values(positions));
//     return Object.values(positions);
// }

// export const getPositions = async (orders) => {
//     let trades = [];
//     let position = {};

//     orders.forEach((order) => {
//         if (order.side == "buy") {
//             console.log(`Processing buy order for ${order.symbol}`);
//             if (!position.amount || position.amount === 0) {
//                 position = {
//                     id: order.id,
//                     symbol: order.symbol,
//                     price_avg: order.price_avg,
//                     amount: order.amount,
//                     cost: order.cost,
//                     fee_cost: order.fee_cost,
//                     taker_or_maker: order.taker_or_maker,
//                     datetime: order.datetime,
//                     buys: [order],
//                     sells: [],
//                 };
//                 console.log(`Buy order for ${order.symbol}: Creating new position`);
//             } else {
//                 position.amount += order.amount;
//                 position.cost += order.cost;
//                 position.fee_cost += order.fee_cost;
//                 position.buys.push(order);
//                 console.log(`Buy order for ${order.symbol}: Adding to an existing position`);
//             }
//         } else {
//             if (!position.amount || position.amount === 0) {
//                 console.log(`Sell order for ${order.symbol}: No position found`);
//                 return;
//             }
//             console.log(`Processing sell order for ${order.symbol}`);
//             let remainingAmount = order.amount;
//             while (remainingAmount > 0) {
//                 let buy = position.buys[0];
//                 if (!buy) {
//                     console.log(`Sell order for ${order.symbol}: No buys found in position`);
//                     return;
//                 }
//                 let sellAmount = Math.min(remainingAmount, buy.amount - buy.soldAmount);
//                 if (sellAmount > 0) {
//                     console.log(`Sell order for ${order.symbol}: Sold ${sellAmount} of position`);
//                     remainingAmount -= sellAmount;
//                     buy.soldAmount += sellAmount;
//                     position.sells.push(order);
//                     let trade = {
//                         symbol: position.symbol,
//                         price_buy: buy.price_avg,
//                         price_sell: order.price_avg,
//                         amount: sellAmount,
//                         cost_buy: sellAmount * buy.price_avg,
//                         cost_sell: sellAmount * order.price_avg,
//                         profit: sellAmount * (order.price_avg - buy.price_avg),
//                         fee_buy: sellAmount * buy.fee_cost / buy.amount,
//                         fee_sell: sellAmount * order.fee_cost / order.amount,
//                         datetime_buy: buy.datetime,
//                         datetime_sell: order.datetime,
//                         taker_or_maker_buy: buy.taker_or_maker,
//                         taker_or_maker_sell: order.taker_or_maker,
//                     };
//                     trades.push(trade);
//                 } else {
//                     console.log(`Sell order for ${order.symbol}: Skipping empty buy`);
//                     position.buys.shift();
//                 }
//             }
//             position.amount -= order.amount;
//             position.cost -= order.cost;
//             position.fee_cost -= order.fee_cost;
//         }
//     });

//     console.log(`Trades for all symbols:`, trades);
//     return trades;
// }