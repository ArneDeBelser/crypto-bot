export const logName = (pairConfig) => {
    return `\x1b[33m[\x1b[32m${pairConfig.name}\u001b[37;1m:\u001b[31;1m${pairConfig.exchange}\u001b[37;1m:\u001b[34;1m${pairConfig.strategy}\x1b[33m]\x1b[0m`;
}