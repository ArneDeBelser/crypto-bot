import sqlite3 from 'sqlite3';

const DB_FILENAME = './src/database/cryptalyzebot.db';

export const db = new sqlite3.Database(DB_FILENAME, (err) => {
    if (err) {
        console.error(err.message);
        throw err;
    }
    console.log(`Connected to SQLite database file ${DB_FILENAME}.`);
});

export function createOrdersTable() {
    const sql = `
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY,
      symbol TEXT,
      price_avg REAL,
      cost REAL,
      fee_cost REAL,
      fee_currency REAL,
      fee_currency_price REAL,
      trade_id TEXT,
      order_id TEXT,
      side TEXT,
      taker_or_maker TEXT,
      amount REAL,
      datetime DATETIME,
      timestamp BIGINT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`;
    db.run(sql, (err) => {
        if (err) {
            console.error(err.message);
            throw err;
        }
        console.log(`Created "orders" table in ${DB_FILENAME}.`);
    });
}

export function checkOrdersTable() {
    const sql = `SELECT name FROM sqlite_master WHERE type='table' AND name='orders'`;
    db.get(sql, [], (err, row) => {
        if (err) {
            console.error(err.message);
            throw err;
        }
        if (!row) {
            createOrdersTable();
        }
    });
}

// Check if the "orders" table exists and create it if it doesn't
checkOrdersTable();

// Close SQLite database connection on exit
process.on('exit', () => {
    db.close((err) => {
        if (err) {
            console.error(err.message);
            throw err;
        }
        console.log(`Closed SQLite database file ${DB_FILENAME}.`);
    });
});
