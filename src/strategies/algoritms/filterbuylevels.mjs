function filterBuyLevels(trades, buyLevels) {
    const boughtLevels = new Set();
    const filteredLevels = [];

    for (const trade of trades) {
        const level = trade.price_avg;
        const isBuy = trade.side === 'buy';

        if (isBuy) {
            boughtLevels.add(level);
        } else {
            boughtLevels.delete(level);
        }
    }

    for (const level of buyLevels) {
        const isInvalidated = Array.from(boughtLevels)
            .some(boughtLevel => Math.abs((boughtLevel - level) / boughtLevel) < 0.1);

        if (!isInvalidated) {
            filteredLevels.push(level);
        }
    }

    return filteredLevels;
}