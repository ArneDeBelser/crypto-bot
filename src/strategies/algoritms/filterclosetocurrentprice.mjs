export const filterCloseToCurrentPriceBids = (percentage, currentPrice, prices, side) => {
    let maxPriceDistance;

    if (side == "up") {
        maxPriceDistance = currentPrice * (1 + percentage);
        //console.log("Max price distance (up):", maxPriceDistance);
    }
    if (side == "down") {
        maxPriceDistance = currentPrice * (1 - percentage);
        //console.log("Max price distance (down):", maxPriceDistance);
    }

    return prices.filter(function (price) {
        if (side == "up") {
            const isAboveMax = parseFloat(price) > maxPriceDistance;
            //  console.log(`Checking price ${price}. Is above max? ${isAboveMax}`);
            return isAboveMax;
        }
        if (side == "down") {
            const isBelowMax = parseFloat(price) < maxPriceDistance;
            //console.log(`Checking price ${price}. Is below max? ${isBelowMax}`);
            return isBelowMax;
        }
    });
}

export const filterCloseToCurrentPriceAsks = (percentage, currentPrice, prices, side, lastTradeInfo) => {
    let maxPriceDistance;
    let minPriceDistance;

    if (side === "up") {
        maxPriceDistance = currentPrice * (1 + percentage);
       // console.log("Max price distance:", maxPriceDistance);

        if (lastTradeInfo && lastTradeInfo.lastOrderType === 'buy') {
            minPriceDistance = lastTradeInfo.lastBuyPrice * (1 + 0.08);  // Calculating the 8% profit from the last buy
          //  console.log("Min price distance:", minPriceDistance);
        }
    } else if (side === "down") {
        maxPriceDistance = currentPrice * (1 - percentage);
       // console.log("Max price distance:", maxPriceDistance);
    }

    const filteredPrices = prices.filter(function (price) {
        if (side === "up") {
            const isWithinRange = parseFloat(price) >= maxPriceDistance || (parseFloat(price) >= currentPrice && parseFloat(price) >= minPriceDistance);
            //console.log(`Price: ${price}, Is within range: ${isWithinRange}`);
            return isWithinRange;
        } else if (side === "down") {
            const isWithinRange = parseFloat(price) >= maxPriceDistance;
           // console.log(`Price: ${price}, Is within range: ${isWithinRange}`);
            return isWithinRange;
        }
    });

    return filteredPrices;
}

