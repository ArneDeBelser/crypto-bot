import BigNumber from "bignumber.js";

export const drawArrow = (activeChart, trade) => {
    return activeChart.createMultipointShape(
        [
            {
                time: trade.timestamp / 1000,
                price: parseFloat(trade.price_avg),
            },
        ],
        {
            text: "",
            lock: true,
            disableSelection: true,
            disableSave: true,
            disableUndo: true,
            showInObjectsTree: false,
            shape: trade.side == "buy" ? "arrow_up" : "arrow_down",
            zOrder: "top",
        }
    );
}

export const drawOrderLine = (activeChart, order) => {
    let orderLine = activeChart.createOrderLine({
        disableUndo: true,
    });

    return orderLine
        .setPrice(order.price)
        .setQuantity(order.amount)
        .setText(timeSince(order.timestamp) + ' | ' + (order.side == "buy" ? "BUY" : "SELL"))
        .setLineColor(setColor(order.side))
        .setBodyFont("12px Roboto, sans-serif")
        .setBodyBorderColor(setColor(order.side))
        .setBodyTextColor(
            order.side == "buy" ? "#000000" : "#f5f5f5"
        )
        .setBodyBackgroundColor(setColor(order.side))
        .setQuantityFont("12px Roboto, sans-serif")
        .setQuantityBackgroundColor(setColor(order.side))
        .setQuantityBorderColor(setColor(order.side))
        .setQuantityTextColor(
            order.side == "buy" ? "#000000" : "#f5f5f5"
        )
        .setCancelButtonIconColor(setColor(order.side))
        .setCancelButtonBorderColor(setColor(order.side))
        .setCancelButtonBackgroundColor("#f5f5f5")
        .setModifyTooltip("Edit")
        .onModify({}, async (e) => {
        })
        .onCancel({}, async (e) => {
        })
        .setLineStyle(2)
        .setExtendLeft(true);
}

export const drawTestOrderLine = (activeChart, order, side) => {
    let orderLine = activeChart.createOrderLine({
        disableUndo: true,
    });

    let amountUsdt = new BigNumber(order.amountUsdt);
    let formattedAmountUsdt = amountUsdt.toFixed(2);

    orderLine
        .setPrice(parseFloat(order.price))
        .setQuantity(order.amount)
        .setText(`${setTestOrderLineText(side)} ${formattedAmountUsdt} USDT`)
        .setLineColor(setTestOrderLineColor(side))
        .setBodyFont("12px Roboto, sans-serif")
        .setBodyBorderColor(setTestOrderLineColor(side))
        .setBodyTextColor(order.side == "buy" ? "#000" : "#fff")
        .setBodyBackgroundColor(setTestOrderLineColor(side))
        .setQuantityFont("12px Roboto, sans-serif")
        .setQuantityBackgroundColor(setTestOrderLineColor(side))
        .setQuantityBorderColor(setTestOrderLineColor(side))
        .setQuantityTextColor(order.side == "buy" ? "#000" : "#fff")
        .setCancelButtonIconColor(order.side == "buy" ? "#000" : "#fff")
        .setCancelButtonBorderColor(setTestOrderLineColor(side))
        .setCancelButtonBackgroundColor(setTestOrderLineColor(side))
        .setModifyTooltip("Edit")
        .onModify({}, async (e) => {
            // code to handle modify event
        })
        .onCancel({}, async (e) => {
            // code to handle cancel event
        })
        .setLineStyle(1)
        .setLineLength(60)
        .setExtendLeft(true);
}

function setColor(side) {
    return side == "buy" ? "#37CB95" : "#F15959";
}

function setTestOrderLineText(side) {
    return side == "buy" ? "BUY" : "SELL";
}

function setTestOrderLineColor(side) {
    return side == "buy" ? "#52a42e" : "#c44242";
}

function timeSince(dateString) {
    const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
    const intervals = { 'day': 86400, 'hour': 3600, 'minute': 60, 'second': 1 };

    for (const [label, secondsPerInterval] of Object.entries(intervals)) {
        const count = Math.floor(seconds / secondsPerInterval);
        if (count > 0) {
            return `${count} ${label}${count === 1 ? '' : 's'} ago`;
        }
    }
    return 'just now';
}
