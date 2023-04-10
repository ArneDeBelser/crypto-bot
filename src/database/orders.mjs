
import { db } from './database.mjs';

export async function getLastOrder(pair) {
    console.log(pair);
    return db.get(`SELECT * FROM orders WHERE symbol = ? ORDER BY timestamp DESC LIMIT 1`, pair);
}

export async function insertOrder(order) {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO orders (
      symbol, price_avg, cost, fee_cost, fee_currency, fee_currency_price,
      trade_id, order_id, side, taker_or_maker, amount, datetime, timestamp
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const params = [
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

export async function getAllOrdersByPair(pair) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM orders WHERE pair = ?`;

        db.all(sql, [pair], (err, rows) => {
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