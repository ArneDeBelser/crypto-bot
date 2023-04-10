const wait = 5000;

const pairs = [
    { name: "BTC_USDT", interval: 15 * 60 * 1000 }, // 15 minutes
    { name: "ETH_USDT", interval: 30 * 60 * 1000 }, // 30 minutes
    // Add more pairs here
];

const queue = [];

async function runBotCycle(pair) {
    console.log(`\x1b[33m[\x1b[32m${pair.name}\x1b[33m]\x1b[0m Bot running through cycle`);
    // Run your strategy logic here
}

export async function startBot() {
    console.log("Starting bot");

    // Add pairs to queue with their respective interval
    pairs.forEach((pair) => {
        queue.push({
            pair,
            lastRunTime: 0,
            timeSinceLastRun: 0,
            interval: pair.interval,
        });
    });

    // Run bot cycle for the next pair in queue
    while (queue.length > 0) {
        const { pair, lastRunTime, timeSinceLastRun, interval } = queue.shift();
        const timeToNextRun = interval - timeSinceLastRun;

        if (timeSinceLastRun >= interval) {
            try {
                await runBotCycle(pair);
                console.log(`\x1b[33m[\x1b[32m${pair.name}\x1b[33m]\x1b[0m Bot completed cycle`);
            } catch (error) {
                console.error(`\x1b[33m[\x1b[32m${pair.name}\x1b[33m]\x1b[0m Bot cycle failed:`, error);
            }
            // Update last run time for pair
            queue.push({
                pair,
                lastRunTime: Date.now(),
                timeSinceLastRun: 0,
                interval: pair.interval,
            });
        } else {
            // Add pair back to queue with adjusted interval
            const delay = Math.max(0, timeToNextRun);
            queue.push({
                pair,
                lastRunTime,
                timeSinceLastRun: timeSinceLastRun + delay,
                interval,
            });
            console.log(`\x1b[33m[\x1b[32m${pair.name}\x1b[33m]\x1b[0m Bot waiting \x1b[36m${Math.floor(delay / 1000 / 60)}m${Math.floor(delay / 1000) % 60}s\x1b[0m before running next cycle`);
        }

        // Delay before running next pair in queue
        await new Promise((resolve) => setTimeout(resolve, wait));
    }

    console.log("Bot has completed all cycles");
}

startBot();
