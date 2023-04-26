import express from 'express';
import { spawn } from 'child_process';
import { config } from './config/pairs.mjs';
import { telegramInstance } from './TelegramBot.mjs';
import { getPairConfig } from './helpers/pairConfig.mjs';
import { getAllOrdersByPair } from './database/orders.mjs';
import './logger.mjs';

/* Database */
await import('./database/database.mjs');

const app = express();
const botPath = './src/bot.mjs';

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

let cryptAlyzeBotProcess = null;

app.post('/api/start-bot', async (req, res) => {
    // Check if CryptAlyzeBot is already running
    if (cryptAlyzeBotProcess !== null) {
        console.warn('CryptAlyzeBot is already running.');
        res.status(409).send('CryptAlyzeBot is already running.');
        return;
    }

    // Start CryptAlyzeBot
    try {
        cryptAlyzeBotProcess = spawn('node', [botPath], { stdio: ['pipe', 'pipe', 'pipe', 'ipc'] });

        cryptAlyzeBotProcess.stdout.on('data', (data) => {
            console.log(`\x1b[38;5;178m[${new Date().toLocaleString()}]\x1b[0m ${data.toString().trim()}`);
        });

        cryptAlyzeBotProcess.stderr.on('data', (data) => {
            console.error(`\x1b[38;5;178m[${new Date().toLocaleString()}]\x1b[0m ${data.toString().trim()}`);
        });

        cryptAlyzeBotProcess.on('message', (message) => {
            if (message.type === 'TELEGRAM_MESSAGE') {
                telegramInstance.sendMessage(message.text);
            }
        });

        cryptAlyzeBotProcess.on('close', (code) => {
            console.log(`CryptAlyzeBot process exited with code ${code}`);
            cryptAlyzeBotProcess = null;
        });

        res.send('CryptAlyzeBot started successfully');
    } catch (error) {
        console.error('Error starting CryptAlyzeBot:', error);
        res.status(500).send('Error starting CryptAlyzeBot');
    }
});

app.post('/api/stop-bot', async (req, res) => {
    // Check if CryptAlyzeBot is running
    if (cryptAlyzeBotProcess === null) {
        console.warn('CryptAlyzeBot is not running.');
        res.status(409).send('CryptAlyzeBot is not running.');
        return;
    }

    // Stop CryptAlyzeBot
    try {
        cryptAlyzeBotProcess.kill();
        res.send('CryptAlyzeBot stopped successfully');
    } catch (error) {
        console.error('Error stopping CryptAlyzeBot:', error);
        res.status(500).send('Error stopping CryptAlyzeBot');
    }
});

app.get('/api/bot-status', async (req, res) => {
    // Get the bot status
    const status = isBotRunning() ? 'Running' : 'Stopped';
    res.send({ status });
});

app.get('/api/get-orders/:exchange', async (req, res) => {
    const exchange = req.params.exchange;
    const pair = req.query.pair;

    try {
        // Query the database for the orders
        const orders = await getAllOrdersByPair(exchange, pair);

        res.send({ orders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Unable to fetch orders' });
    }
});

app.get('/api/test-strategy/:pair', async (req, res) => {
    const pair = req.params.pair.replace('_', '/');
    const exchange = req.query.exchange;

    try {
        console.log(`Running test for ${pair}`);
        const [pairConfig, strategyModule] = await getPairConfig(config, pair, exchange);
        const strategy = strategyModule.default;
        const orders = await strategy(pairConfig, pair, true);

        res.send({ orders });
    } catch (error) {
        console.error(error);
        res.status(422).json({ error: error.message });
    }
});

const port = 3001;

app.listen(port, () => {
    if (process.env.VITE_TELEGRAM_BOT_STATUS == 'on') {
        telegramInstance.startTelegramBot();
    }

    console.log(`\x1b[38;5;178m[${new Date().toLocaleString()}]\x1b[0m Server listening on port ${port}`);
});

function isBotRunning() {
    return cryptAlyzeBotProcess !== null;
}

await import('./fetchTrades.mjs');

export default app;