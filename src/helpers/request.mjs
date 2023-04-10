import axios from 'axios';

let appUrl;
if (typeof process !== 'undefined' && process.env && process.env.VITE_SERVER_URL) {
    // running in Node.js environment
    appUrl = process.env.VITE_SERVER_URL;
} else if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SERVER_URL) {
    // running in a browser environment
    appUrl = import.meta.env.VITE_SERVER_URL;
} else {
    throw new Error('Could not determine VITE_SERVER_URL');
}

let bot = {
    pid: null,
    status: null,
};

export const apiStartBot = async () => {
    if (bot.status === 'Running') {
        console.warn('Bot is already running.');
        return;
    }

    try {
        const { data } = await axios.post(`${appUrl}api/start-bot`);
        bot.pid = data.pid;
        bot.status = 'Running';
        console.log('Bot started:', data);
    } catch (error) {
        console.error('Failed to start bot:', error.code);
    }
}

export const apiStopBot = async () => {
    if (bot.status !== 'Running') {
        console.warn('Bot is not running.');
        return;
    }

    try {
        const { data } = await axios.post(`${appUrl}api/stop-bot`, { pid: bot.pid });
        bot.pid = null;
        bot.status = 'Stopped';
        console.log('Bot stopped:', data);
    } catch (error) {
        console.error('Failed to stop bot:', error.code);
    }
}

export const apiPollBotStatus = async () => {
    // Poll the server for the bot status every 5 seconds
    setInterval(async () => {
        try {
            const { data } = await axios.get(`${appUrl}api/bot-status`, { timeout: 5000 });
            bot.status = data.status;
            console.log('Current bot status:', bot.status);
        } catch (error) {
            console.error('Failed to get bot status:', error);
        }
    }, 5000);
}