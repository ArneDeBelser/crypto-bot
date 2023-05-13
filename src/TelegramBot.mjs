import TelegramBot from 'node-telegram-bot-api';
import axios from 'axios';
import 'dotenv/config';
import { apiStartBot, apiStopBot } from './helpers/request.mjs';

class Telegram {
    constructor() {
        this.bot = {
            pid: null,
            status: null,
        };
        this.appUrl = process.env.VITE_SERVER_URL;
        this.instance = null;
        this.botToken = process.env.VITE_TELEGRAM_BOT_TOKEN;
        this.chatId = process.env.VITE_TELEGRAM_CHAT_ID;
        this.messageQueue = [];
        this.isSending = false;
    }

    getTelegramBot() {
        if (!this.instance) {
            this.instance = new TelegramBot(this.botToken, { polling: true });
            // console.log('Creating telegram instance');
            // Add event listeners and other configuration here
        }
        return this.instance;
    }

    sendMessage(text) {
        //console.log(`Adding message to queue: ${text}`);
        this.messageQueue.push(text);

        if (!this.isSending) {
            //console.log('Queue is not sending, calling sendQueuedMessages()');
            this.sendQueuedMessages();
        }
    }

    async sendQueuedMessages() {
        //console.log('Sending queued messages...');
        this.isSending = true;

        while (this.messageQueue.length > 0) {
            const message = this.messageQueue.shift();
            //console.log(`Sending message: ${message}`);
            this.getTelegramBot().sendMessage(this.chatId, message);
            await this.sleep(1000);
        }

        //console.log('All queued messages have been sent');
        this.isSending = false;
    }

    async sleep(ms) {
        return new Promise((resolve) => {
            //console.log(`Sleeping for ${ms}ms...`);
            setTimeout(() => {
                // console.log(`Finished sleeping for ${ms}ms`);
                resolve();
            }, ms);
        });
    }

    startTelegramBot() {
        // Listen for messages sent to the bot
        this.getTelegramBot().on('message', (msg) => {
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
                this.getTelegramBot().sendMessage(chatId, 'Please select an option:', options);
            }
        });

        // Listen for callback queries (i.e., button clicks)
        this.getTelegramBot().on('callback_query', async (query) => {
            const chatId = query.message.chat.id;
            const data = query.data;

            // Handle the button click based on the callback data
            switch (data) {
                case 'start':
                    apiStartBot();
                    this.sendMessage(`Bot started via Telegram command.`);
                    break;
                case 'stop':
                    apiStopBot();
                    this.sendMessage(`Bot stopped via Telegram command.`);
                    break;
                case 'status':
                    const botStatus = this.bot.status == 'Running' ? 'Running' : 'Stopped';
                    this.sendMessage(`The bot is currently ${botStatus}.`);
                    break;
                default:
                    this.sendMessage('Invalid button.');
            }

            // Send a message to indicate that the button was clicked
            this.getTelegramBot().answerCallbackQuery(query.id);
        });

        console.log(`\x1b[38;5;178m[${new Date().toLocaleString()}]\x1b[0m Telegram bot is running`);
    }

    listenBotStatus() {
        if (process.env.VITE_TELEGRAM_BOT_STATUS == 'on') {
            // Periodically check the bot status
            setInterval(async () => {
                try {
                    const { data } = await axios.get(`${this.appUrl}api/bot-status`);
                    this.bot.status = data.status;
                } catch (error) {
                    if (error.code != 'ECONNRESET') {
                        console.error('TelegramBot: Failed to get bot status:', error.code);
                    }
                    if (error.code != 'ETELEGRAM') {
                        console.error('TelegramBot: Polling Error, two polls at same time', error.code);
                    }
                }
            }, 5000);
        }
    }
}

const telegramInstance = new Telegram();

export { telegramInstance };
