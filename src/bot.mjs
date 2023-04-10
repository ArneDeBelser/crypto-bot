const wait = 5000;

import { config } from './config/pairs.mjs';
import { logName } from './helpers/botHelpers.mjs';

async function runBotCycle(pairConfig) {
    console.log(`${logName(pairConfig)} Bot running through cycle`);

    const strategyModule = await import(`./strategies/${pairConfig.strategy}.mjs`);
    const strategy = strategyModule.default;

    await strategy(pairConfig);
}

async function startBot() {
    console.log("Starting bot");

    // Create a queue of pairs to process
    const queue = config.map((pairConfig) => ({
        pairConfig,
        lastRunTime: 0,
        interval: pairConfig.interval,
    }));

    while (queue.length > 0) {
        const { pairConfig, lastRunTime, interval } = queue.shift();
        const timeSinceLastRun = Date.now() - lastRunTime;

        if (timeSinceLastRun >= interval) {
            try {
                await runBotCycle(pairConfig);
                console.log(`${logName(pairConfig)} Bot completed cycle`);
            } catch (error) {
                console.error(`${logName(pairConfig)} Bot cycle failed:`, error);
            }
            // Update last run time for pair
            queue.push({
                pairConfig,
                lastRunTime: Date.now(),
                interval: pairConfig.interval,
            });
        } else {
            // Add pair back to queue with adjusted interval
            const delay = Math.max(0, interval - timeSinceLastRun);
            queue.push({
                pairConfig,
                lastRunTime,
                interval: pairConfig.interval, // Use pairConfig.interval instead of delay
            });
            console.log(`${logName(pairConfig)} Bot waiting \x1b[36m${Math.floor(delay / 1000 / 60)}m${Math.floor(delay / 1000) % 60}s\x1b[0m before running next cycle`);
        }

        // Wait before processing the next pair in the queue
        await new Promise((resolve) => setTimeout(resolve, wait));
    }

    console.log("Bot has completed all cycles");
}

startBot();
