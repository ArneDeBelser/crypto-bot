export function filterLevels(userTrades, levels, priceThreshold) {
    if (userTrades.length === 0) {
        return levels;
    }

    const lastSide = userTrades[userTrades.length - 1].side;

    const lastSameSideTrades = [];
    for (let i = userTrades.length - 1; i >= 0; i--) {
        if (userTrades[i].side === lastSide) {
            lastSameSideTrades.push(userTrades[i]);
        } else {
            break;
        }
    }

    const filteredLevels = levels.filter((level) => {
        for (const trade of lastSameSideTrades) {
            const priceDifference = Math.abs(level - trade.price_avg);
            const pricePercentageDifference = priceDifference / trade.price_avg;

            if (pricePercentageDifference <= priceThreshold) {
                return false;
            }
        }
        return true;
    });

    return filteredLevels;
}