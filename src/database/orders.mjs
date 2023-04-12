
import { db } from './database.mjs';

export async function getLastOrder(pair, exchange) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM orders WHERE symbol = ? AND exchange = ? ORDER BY timestamp DESC LIMIT 1`;
        const params = [pair, exchange];

        db.all(sql, params, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

export async function insertOrder(order, exchange) {
    console.log(`Inserting new order ${order.symbol} for ${exchange}`);
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO orders (
      exchange, symbol, price_avg, cost, fee_cost, fee_currency, fee_currency_price,
      trade_id, order_id, side, taker_or_maker, amount, datetime, timestamp
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const params = [
            exchange,
            order.symbol,
            order.price,
            order.cost,
            order.fee.cost,
            order.fee.currency,
            '', // order.fee_currency_price
            order.id,
            order.order,
            order.side,
            order.takerOrMaker,
            order.amount,
            order.datetime,
            order.timestamp
        ];

        db.run(sql, params, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve({
                    id: this.lastID,
                    ...order
                });
            }
        });
    });
}

export async function getAllOrdersByPair(exchange, pair) {
    pair = pair.replace('_', '/');
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM orders WHERE exchange = ? AND symbol = ?`;

        db.all(sql, [exchange, pair], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

export async function getAllOrders() {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM orders`;

        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}