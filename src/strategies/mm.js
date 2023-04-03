// const orderbook = [0.00830801, 0.00753898, 0.00753893, 0.00753886, 0.00753433, 0.007, 0.0064, 0.00599038, 0.00545689, 0.0053953, 0.00455071, 0.004, 0.00320953, 0.0025222, 0.00247153, 0.00100001, 0.001, 0.000071, 0.00003];

const orderbook = [0.00003185, 0.0000335, 0.000035, 0.000038, 0.00003899, 0.00004, 0.000041, 0.0000415, 0.0000439, 0.000044, 0.0000499, 0.00005, 0.000052, 0.000054, 0.00005589, 0.000056, 0.000059, 0.0000599, 0.00006336, 0.00006496, 0.000065, 0.00006899, 0.000069, 0.00007007, 0.000078, 0.000089, 0.000093, 0.000095, 0.000099, 0.00009985, 0.0001, 0.00012, 0.00012103];

// Set parameters
const thresholdDistance = 0.000001; // distance in BTC
const gapMultiplier = 1.1; // set the gap multiplier

// Calculate the average gap value between orders
let totalGap = 0;
for (let i = 1; i < orderbook.length; i++) {
    totalGap += orderbook[i] - orderbook[i - 1];
}
const avgGap = totalGap / (orderbook.length - 1);
//console.log('avgGap', avgGap);

// Set the buy order threshold to be slightly below the lowest ask price
const buyThreshold = orderbook[0] - (avgGap * 0.5);
//console.log('buyThreshold', buyThreshold);

// Find the gaps between orders and place a buy order before each gap
let lastOrder = orderbook[0];
for (let i = 1; i < orderbook.length; i++) {
    const currentOrder = orderbook[i];
    //console.log('currentOrder', currentOrder);
    const gap = currentOrder - lastOrder;
    //console.log('gap', gap);
    if (gap > (avgGap * gapMultiplier)) { // buy if gap is greater than 110% of the average gap
        // console.log('statement', avgGap * gapMultiplier);
        const buyPrice = lastOrder + (gap * 0.5);
        console.log(`Place buy order at ${buyPrice}`);
        if (buyPrice < (buyThreshold - thresholdDistance)) { // check if buy price is below threshold - thresholdDistance
        }
    }
    lastOrder = currentOrder;
}
