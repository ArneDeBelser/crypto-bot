import express from 'express';
import { spawn } from 'child_process';
import { startTelegramBot } from './TelegramBot.mjs';

/* Database */
import './database/database.mjs';

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
        cryptAlyzeBotProcess = spawn('node', [botPath]);

        cryptAlyzeBotProcess.stdout.on('data', (data) => {
            console.log(`\x1b[38;5;178m[${new Date().toLocaleString()}]\x1b[0m CryptAlyzeBot: ${data.toString().trim()}`);
        });

        cryptAlyzeBotProcess.stderr.on('data', (data) => {
            console.error(`\x1b[38;5;178m[${new Date().toLocaleString()}]\x1b[0m CryptAlyzeBot: ${data.toString().trim()}`);
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

const port = 3000;

app.listen(port, () => {
    startTelegramBot();
    console.log(`Server listening on port ${port}`);
});

function isBotRunning() {
    return cryptAlyzeBotProcess !== null;
}

export default app;