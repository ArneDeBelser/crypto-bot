export function resolutionToTimeframe(resolution) {
    const timeframes = {
        '720': '1M',
        '360': '1w',
        '240': '4h',
        '120': '2h',
        '60': '1h',
        '30': '30m',
        '15': '15m'
    };

    return timeframes[resolution];
}
