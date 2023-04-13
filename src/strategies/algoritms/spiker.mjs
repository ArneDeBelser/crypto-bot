export const hasDownspikeWicks = (klines) => {
    let downspikeWicksCount = 0;

    for (let i = 0; i < klines.length; i++) {
        const [timestamp, open, high, low, close, volume] = klines[i];
        if (low < open && low < close && high > open) {
            downspikeWicksCount++;
        }
    }

    return downspikeWicksCount > klines.length * 0.4;
}

export const hasUpspikeWicks = (klines) => {
    let upspikeWicksCount = 0;

    for (let i = 0; i < klines.length; i++) {
        const [timestamp, open, high, low, close, volume] = klines[i];
        if (high > open && high > close && low < close) {
            upspikeWicksCount++;
        }
    }

    return upspikeWicksCount > klines.length * 0.4;
}

export const hasTwoSidedSpikes = (klines) => {
    let twoSidedSpikeCount = 0;

    for (let i = 0; i < klines.length; i++) {
        const [timestamp, open, high, low, close, volume] = klines[i];
        if ((high > open && high > close && low < close) || (low < open && low < close && high > open)) {
            twoSidedSpikeCount++;
        }
    }

    return twoSidedSpikeCount > klines.length * 0.4;
}

