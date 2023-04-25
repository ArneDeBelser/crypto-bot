export function calculateAskOrders(userBalance, orders, ticker, minUsdtAmount) {
    const usdtValue = userBalance.usdtValue;

    // Discard orders until the average USDT per order is greater than or equal to minUsdtAmount
    while (usdtValue / orders.length < minUsdtAmount) {
        orders.shift();
    }

    const usdtPerAskOrder = usdtValue / orders.length;
    const remainingUsdt = usdtValue - (usdtPerAskOrder * (orders.length - 1));

    let askOrders = orders.map((price, index) => {
        if (index === orders.length - 1) {
            const amount = remainingUsdt / price;
            return {
                price,
                amount,
                amountUsdt: remainingUsdt
            };
        }
        return {
            price,
            amount: usdtPerAskOrder / price,
            amountUsdt: usdtPerAskOrder
        };
    });

    return askOrders;
}

export function calculateBidOrders(userBalance, orders, ticker, baseUsdtAmount, maxUsdtAmount) {
    const usdtValue = userBalance.usdtValue;
    const usdtLeftToDivide = maxUsdtAmount - usdtValue;

    let bidOrders = [];
    let availableUsdtForBuys = usdtLeftToDivide;

    for (let price of orders) {
        if (availableUsdtForBuys >= baseUsdtAmount) {
            bidOrders.push({ price, amount: baseUsdtAmount / price, amountUsdt: baseUsdtAmount });
            availableUsdtForBuys -= baseUsdtAmount;
        } else {
            break;
        }
    }

    return bidOrders;
}