/* Exchange */
import ccxt from 'ccxt';
import 'dotenv/config';
const exchangeName = "bitmart";
const config = await import(
    `./exchanges/${exchangeName}/configBot.mjs`
);
const exchange = new ccxt[exchangeName](config.default);

async function runBotCycle() {
    // Execute bot logic here
    console.log("Bot running through cycle...");
    // throw new Error("Sample error");

    // Wait for a certain amount of time before running again
    // await new Promise((resolve) => setTimeout(resolve, 5000));
}

async function startBot() {
    console.log("Starting bot ...");

    while (true) {
        try {
            await runBotCycle();
        } catch (error) {
            console.error("Bot cycle failed:", error);
        }

        // Wait for a certain amount of time before running the next cycle
        await new Promise((resolve) => setTimeout(resolve, 5000));
    }
}

startBot();
