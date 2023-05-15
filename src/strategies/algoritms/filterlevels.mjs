export function filterLevelsBids(userTrades, levels, priceThreshold) {
    if (userTrades.length === 0) {
        return levels;
    }

    const lastSide = userTrades[userTrades.length - 1].side;
    //  console.log("Last side:", lastSide);

    const lastSameSideTrades = [];
    for (let i = userTrades.length - 1; i >= 0; i--) {
        if (userTrades[i].side === lastSide) {
            lastSameSideTrades.push(userTrades[i]);
        } else {
            break;
        }
    }
    // console.log("Last same side trades:", lastSameSideTrades);

    const filteredLevels = levels.filter((level) => {
        for (const trade of lastSameSideTrades) {
            const priceDifference = Math.abs(level - trade.price_avg);
            const pricePercentageDifference = priceDifference / trade.price_avg;

            //   console.log(`Level: ${level}, Trade: ${trade.price_avg}`);
            //  console.log("Price difference:", priceDifference);
            //  console.log("Price percentage difference:", pricePercentageDifference);

            if (pricePercentageDifference <= priceThreshold) {
                //       console.log("Level filtered out:", level);
                return false;
            }
        }
        return true;
    });

    return filteredLevels;
}

export function filterLevelsAsks(userTrades, levels, priceThreshold) {
    //console.log("Price threshold:", priceThreshold);

    const lastSameSideTrades = getLastSameSideTrades(userTrades, 'sell');

  //  console.log("Last same side trades:", lastSameSideTrades);

    if (lastSameSideTrades.length === 0) {
       // console.log("No trades on the sell side.");
        return [];
    }

    const lastTradePrice = lastSameSideTrades[0].price_avg;

   // console.log("Last sell trade price:", lastTradePrice);

    const filteredLevels = levels.filter(level => {
   //     console.log("Current level:", level);

        const priceDifferenceRecentTrade = Math.abs(level - lastTradePrice);
        const isWithinThresholdRecentTrade = (priceDifferenceRecentTrade / lastTradePrice) >= priceThreshold;

      //  console.log("Is level within threshold of recent trade:", isWithinThresholdRecentTrade);

        const isWithinThresholdAnyTrade = lastSameSideTrades.every(trade => {
            const priceDifference = Math.abs(level - trade.price_avg);
            const isWithinThreshold = (priceDifference / trade.price_avg) >= priceThreshold;

           // console.log(`For trade with price ${trade.price_avg}, is level within threshold: ${isWithinThreshold}`);

            return isWithinThreshold;
        });

       // console.log("Is level within threshold of any trade:", isWithinThresholdAnyTrade);

        return isWithinThresholdRecentTrade && isWithinThresholdAnyTrade;
    });

   // console.log("Filtered levels:", filteredLevels);

    return filteredLevels;
}

function getLastSameSideTrades(userTrades, tradeSide) {
    const sameSideTrades = userTrades.filter(trade => trade.side === tradeSide);
   // console.log("Same side trades:", sameSideTrades);
    return sameSideTrades.length ? [sameSideTrades[sameSideTrades.length - 1]] : [];
}




// export function filterLevelsAsks(userTrades, levels, priceThreshold, tradeSide) {
//     const lastSameSideTrades = getLastSameSideTrades(userTrades, tradeSide);

//     // console.log(`Last ${tradeSide} side trades:`, lastSameSideTrades);

//     // If there are no trades on the same side, return an empty array
//     if (lastSameSideTrades.length === 0) {
//         //    console.log(`No trades on the ${tradeSide} side.`);
//         return [];
//     }

//     // Get the price of the most recent same-side trade
//     const lastTradePrice = lastSameSideTrades[0].price_avg;

//     //   console.log(`Last ${tradeSide} trade price: ${lastTradePrice}`);

//     // Filter levels based on the price threshold
//     const filteredLevels = levels.filter(level => {
//         const priceDifference = Math.abs(level - lastTradePrice);
//         const isWithinThreshold = priceDifference <= priceThreshold;

//         //  console.log(`Level price: ${level}, Price difference: ${priceDifference}, Is within threshold: ${isWithinThreshold}`);

//         return isWithinThreshold;
//     });

//     // console.log(`Filtered levels for ${tradeSide} side:`, filteredLevels);

//     return filteredLevels;
// }

// function getLastSameSideTrades(userTrades, tradeSide) {
//     // Filter trades based on the provided side (buy/sell)
//     const sameSideTrades = userTrades.filter(trade => trade.side === tradeSide);

//     // Return the most recent trade
//     return sameSideTrades.length ? [sameSideTrades[sameSideTrades.length - 1]] : [];
// }

