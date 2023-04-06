import fetch from 'node-fetch';
import 'dotenv/config';

export default class TelegramNotifier {
    constructor() {
        this.botToken = process.env.VITE_TELEGRAM_BOT_TOKEN;
        this.chatId = process.env.VITE_TELEGRAM_CHAT_ID;
    }

    async sendMessage(message) {
        const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`;

        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: this.chatId,
                text: message,
            }),
        });

        const data = await response.json();

        if (!data.ok) {
            throw new Error(`Failed to send message: ${data.description}`);
        }
    }
}