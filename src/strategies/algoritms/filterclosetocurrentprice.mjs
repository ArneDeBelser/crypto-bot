export const filterCloseToCurrentPrice = (percentage, currentPrice, prices, side) => {
    let maxPriceDistance;

    if (side == "up") maxPriceDistance = currentPrice * (1 + percentage);
    if (side == "down") maxPriceDistance = currentPrice * (1 - percentage);

    return prices.filter(function (price) {
        if (side == "up") return parseFloat(price) > maxPriceDistance;
        if (side == "down") return parseFloat(price) < maxPriceDistance;
    })
}