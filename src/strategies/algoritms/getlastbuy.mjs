export const getLastTradeInfo = (trades) => {
    // Assumption: The trades array is sorted by datetime in ascending order
    let lastBuyPrice = null;
    let lastOrderType = null;

    for (let i = trades.length - 1; i >= 0; i--) {
        if (trades[i].side === 'buy' && lastBuyPrice === null) {
            lastBuyPrice = trades[i].price_avg;
        }

        if (lastOrderType === null) {
            lastOrderType = trades[i].side;
        }

        if (lastBuyPrice !== null && lastOrderType !== null) {
            break;
        }
    }

    return { lastBuyPrice, lastOrderType };
}
