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
        .setText(order.side == "buy" ? "BUY" : "SELL")
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

export const drawTestOrderLine = (activeChart, price, side) => {
    let orderLine = activeChart.createOrderLine({
        disableUndo: true,
    });

    orderLine
        .setPrice(parseFloat(price))
        .setQuantity(1)
        .setText(setTestOrderLineText(side))
        .setLineColor(setTestOrderLineColor(side))
        .setBodyFont("12px Roboto, sans-serif")
        .setBodyBorderColor(setTestOrderLineColor(side))
        .setBodyTextColor("#FFFFFF")
        .setBodyBackgroundColor(setTestOrderLineColor(side))
        .setQuantityFont("12px Roboto, sans-serif")
        .setQuantityBackgroundColor(setTestOrderLineColor(side))
        .setQuantityBorderColor(setTestOrderLineColor(side))
        .setQuantityTextColor("#FFFFFF")
        .setCancelButtonIconColor("#FFFFFF")
        .setCancelButtonBorderColor(setTestOrderLineColor(side))
        .setCancelButtonBackgroundColor(setTestOrderLineColor(side))
        .setModifyTooltip("Edit")
        .onModify({}, async (e) => {
            // code to handle modify event
        })
        .onCancel({}, async (e) => {
            // code to handle cancel event
        })
        .setLineStyle(0)
        .setLineLength(300)
        .setExtendLeft(true);
}

function setColor(side) {
    return side == "buy" ? "#37CB95" : "#F15959";
}

function setTestOrderLineText(side) {
    return side == "buy" ? "BUY ORDER" : "SELL ORDER";
}

function setTestOrderLineColor(side) {
    return side == "buy" ? "#6fa8dc" : "#e06666";
}