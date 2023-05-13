export function calculateAskOrders(userBalance, orders, ticker, minUsdtAmount) {
    const baseValue = userBalance.base;
    const usdtValue = userBalance.usdtValue;

    // console.log("Initial user balance:", userBalance);
    // console.log("Initial orders:", orders);

    // Discard orders until the average USDT per order is greater than or equal to minUsdtAmount
    while (usdtValue / orders.length < minUsdtAmount) {
        orders.shift();
    }

    //console.log("Filtered orders:", orders);

    // If there are no filtered orders left, create a single order with a price that meets the minUsdtAmount requirement
    if (orders.length === 0) {
        const requiredPrice = minUsdtAmount / baseValue;
        orders.push(requiredPrice);
    }

    // console.log("Filtered orders after checking if only one left:", orders);

    let remainingBase = baseValue;
    let askOrders = [];

    const basePerOrder = Math.floor(baseValue / orders.length);
    const remainingBaseForLastOrder = baseValue - (basePerOrder * (orders.length - 1));

    //  console.log("Base per order:", basePerOrder);
    //   console.log("Remaining base for last order:", remainingBaseForLastOrder);

    orders.forEach((price, index) => {
        //  console.log("Processing order index:", index);
        //  console.log("Current price:", price);
        //  console.log("Remaining base:", remainingBase);

        if (remainingBase <= 0) {
            //    console.log("No remaining base, skipping order...");
            return;
        }

        let currentBaseAmount;

        if (index === orders.length - 1) {
            currentBaseAmount = remainingBaseForLastOrder;
            // Calculate the required price to make USDT value above minUsdtAmount
            const minPrice = minUsdtAmount / currentBaseAmount;
            if (price < minPrice) {
                price = minPrice;
            }
        } else {
            currentBaseAmount = basePerOrder;
        }

        const currentUsdtAmount = currentBaseAmount * price;
        // console.log("Current base amount:", currentBaseAmount);
        // console.log("Current USDT amount:", currentUsdtAmount);

        if (currentUsdtAmount >= minUsdtAmount) {
            askOrders.push({
                price,
                amount: currentBaseAmount,
                amountUsdt: currentUsdtAmount
            });
            remainingBase -= currentBaseAmount;
            //console.log("Created new ask order:", askOrders[askOrders.length - 1]);
        } else {
            askOrders[0].amount += remainingBase;
            askOrders[0].amountUsdt += remainingBase * price;
            remainingBase = 0;
            // console.log("Allocated remaining base to the first order:", askOrders[0]);
        }
    });

    //console.log("Final ask orders:", askOrders);
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