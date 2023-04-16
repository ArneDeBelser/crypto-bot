export function filterLevels(levels, trades, side) {
    const invalidLevels = new Set();

    for (let i = trades.length - 1; i >= 0; i--) {
        const trade = trades[i];
        const tradePrice = trade.price_avg;
        const tradeSide = trade.side;

        if (tradeSide === side) {
            for (let j = 0; j < levels.length; j++) {
                const levelPrice = levels[j];
                if (!invalidLevels.has(levelPrice) && (
                    (side === "buy" && tradePrice <= levelPrice * 1.1) ||
                    (side === "sell" && tradePrice >= levelPrice * 0.9)
                )) {
                    //  console.log(`Removing ${side} level ${levelPrice} due to trade at ${tradePrice}`);
                    invalidLevels.add(levelPrice);
                }
            }
        } else {
            for (let j = levels.length - 1; j >= 0; j--) {
                const levelPrice = levels[j];
                if (invalidLevels.has(levelPrice)) {
                    // console.log(`${side} level ${levelPrice} invalidated by a ${tradeSide}`);
                    invalidLevels.delete(levelPrice);
                }
            }
        }
    }

    return levels.filter((levelPrice) => !invalidLevels.has(levelPrice));
}