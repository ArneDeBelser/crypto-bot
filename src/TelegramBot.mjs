import TelegramBot from 'node-telegram-bot-api';
import axios from 'axios';
import 'dotenv/config';
import { apiStartBot, apiStopBot } from './helpers/request.mjs';

const botToken = process.env.VITE_TELEGRAM_BOT_TOKEN;
const chatId = process.env.VITE_TELEGRAM_CHAT_ID;

export const telegram = new TelegramBot(botToken, { polling: true });

export const sendMessage = (text) => {
    telegram.sendMessage(chatId, text);
};

export const startTelegramBot = () => {
    // Listen for messages sent to the bot
    telegram.on('message', (msg) => {
        const chatId = msg.chat.id;
        const text = msg.text.toLowerCase();

        // Create inline buttons
        const options = {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: '🟢 Start', callback_data: 'start' },
                        { text: '🔴 Stop', callback_data: 'stop' },
                        { text: 'ℹ️ Status', callback_data: 'status' }
                    ],
                ],
            },
        };

        if (text === 'd') {
            // Send a message with the inline buttons
            telegram.sendMessage(chatId, 'Please select an option:', options);
        }
    });

    // Listen for callback queries (i.e., button clicks)
    telegram.on('callback_query', async (query) => {
        const chatId = query.message.chat.id;
        const data = query.data;

        // Handle the button click based on the callback data
        switch (data) {
            case 'start':
                apiStartBot();
                sendMessage(`Bot started via Telegram command.`);
                break;
            case 'stop':
                apiStopBot();
                sendMessage(`Bot stopped via Telegram command.`);
                break;
            case 'status':
                const botStatus = bot.status == 'Running' ? 'Running' : 'Stopped';
                sendMessage(`The bot is currently ${botStatus}.`);
                break;
            default:
                sendMessage('Invalid button.');
        }

        // Send a message to indicate that the button was clicked
        telegram.answerCallbackQuery(query.id);
    });

    console.log('Telegram bot is running!');
};

let bot = {
    pid: null,
    status: null,
};

const appUrl = process.env.VITE_SERVER_URL;

if (process.env.VITE_TELEGRAM_BOT_STATUS == 'on') {
    // Periodically check the bot status
    setInterval(async () => {
        try {
            const { data } = await axios.get(`${appUrl}api/bot-status`);
            bot.status = data.status;
            // console.log('TelegramBot: Current bot status:', bot.status);
        } catch (error) {
            if (error.code != 'ECONNRESET') {
                console.error('TelegramBot: Failed to get bot status:', error.code);
            }
        }
    }, 5000);
}
