import SymbolsStorage from "./symbol-storage";
import ccxt from "ccxt";
import config from '../config/bitmart.js';

export const SUPPORTED_RESOLUTIONS = ["1", "2", "3", "5", "10", "15", "30", "60", "120", "240", "360", "720", "D", "1D", "3D", "W", "1W", "2W", "1M"];

let lastBarTime = 0;
const lastBarsCache = new Map();

export default class DataProvider {
    constructor() {
        this._loadedPromise = new Promise((resolve) => {
            this._resolveLoaded = resolve
        });

        this._subscribers = {};
        this._symbolsStorage = new SymbolsStorage();
    }

    onGetMarks(callback) {
        this._onGetMarksCallback = callback
    }

    onReady = async (callback) => {
        let configurationData = {
            supports_marks: true,
            supported_resolutions: SUPPORTED_RESOLUTIONS,
        }

        setTimeout(() => callback(configurationData), 0)
    }

    searchSymbols = async (userInput, exchange, symbolType, onResultReadyCallback) => {
        const search = async () => {
            const exchangeObj = new ccxt[exchange]({ enableRateLimit: true })
            const markets = await exchangeObj.loadMarkets()
            const symbols = Object.values(markets)
                .filter(market => market.type === symbolType)
                .filter(market => market.symbol.toUpperCase().includes(userInput.toUpperCase()))
                .map(market => ({
                    symbol: market.symbol,
                    full_name: market.symbol,
                    description: market.info.description,
                    exchange: exchange,
                    type: symbolType,
                    ticker: market.symbol,
                }))
            onResultReadyCallback(symbols)
        }

        if (this.searchSymbolsDebounce) {
            clearTimeout(this.searchSymbolsDebounce)
        }

        if (userInput.length > 2) {
            this.searchSymbolsDebounce = setTimeout(search, 200)
        }
    }

    resolveSymbol = (symbolName, onSymbolResolvedCallback, onError) => {
        function onResultReady(symbolInfo) {
            onSymbolResolvedCallback(symbolInfo)
        }

        this._symbolsStorage.resolveSymbol(symbolName).then(onResultReady).catch(onError)
    }

    getBars = async (symbolInfo, resolution, periodParams, onHistoryCallback, onErrorCallback) => {
        let { from, to, firstDataRequest, countBack } = periodParams;
        console.log(
            "[getBars]: Method call (symbolinfo, resolution, from, to, limit)",
            symbolInfo,
            resolution,
            from,
            to,
            countBack
        );
        const exchange = new ccxt['bitmart'](config);
        const timeframe = Object.keys(exchange.timeframes).find(key => exchange.timeframes[key] == resolution);

        if (countBack >= 500) {
            console.log('Requesting way to many bars, limiting', countBack);
            countBack = 450;
        }

        const ohlcv = await exchange.fetchOHLCV(symbolInfo.ticker, timeframe, from, countBack, {
            from: from,
            to: to,
        });

        const bars = ohlcv.map(([time, open, high, low, close, volume]) => ({
            time: time,
            open,
            high,
            low,
            close,
            volume,
        }));

        console.log(
            `[getBars]: returned ${bars.length} bar(s)`
        );

        if (firstDataRequest && bars.length > 0) {
            console.log('firstDataRequest', firstDataRequest);
            lastBarTime = bars[bars.length - 1].time;
            lastBarsCache.set(symbolInfo.ticker, {
                ...bars[bars.length - 1],
            });
            console.log('lastBarsCache', lastBarsCache);
        }

        if (bars.length > 0) {
            console.log('still bars');
            onHistoryCallback(bars, {
                noData: false,
            });
        } else {
            console.log('no bars');
            onHistoryCallback([], {
                noData: true,
            });
        }
    };

    subscribeBars = async (symbolInfo, resolution, onRealtimeCallback, listenerGuid, onResetCacheNeededCallback) => {
        // if (symbolInfo.ticker !== this.currentMarket.ticker && !this.subscriptionReady) {
        //     return
        // }
        // this.subscriptionReady = true

        // try {
        //     const exchange = await ccxt['bimart'](config);
        //     const symbol = this.currentMarket.ticker.replace("_", "/")
        //     const market = exchange.markets[symbol]
        //     const timeframe = this._resolutionToTimeframe(resolution)

        //     const callback = ({ timestamp, open, high, low, close, volume }) => {
        //         if (this._subscribers[listenerGuid]) {
        //             this._subscribers[listenerGuid].listener({
        //                 time: timestamp,
        //                 open,
        //                 high,
        //                 low,
        //                 close,
        //                 volume,
        //             })
        //         }
        //     }
        //     exchange.websocketSubscribe(market['id'], timeframe, callback)
        //     this._subscribers[listenerGuid] = {
        //         listener: onRealtimeCallback,
        //         channel: { symbol, resolution },
        //         callback
        //     }
        // } catch (error) {
        //     console.error("SubscribeBars error: ", error)
        // }
    }

    unsubscribeBars = async (listenerGuid) => {
        // if (this._subscribers[listenerGuid]) {
        //     try {
        //         const exchange = await ccxt[this.currentMarket.exchange].new()
        //         exchange.remove_listener(this._subscribers[listenerGuid].channel, this._subscribers[listenerGuid].callback)
        //     } catch (error) {
        //         console.error("UnsubscribeBars error: ", error)
        //     }
        // }
    }

    calculateHistoryDepth(resolution, resolutionBack, intervalBack) {
        return undefined
    }

    getMarks(symbolInfo, from, to, onDataCallback, resolution) {
        if (this._onGetMarksCallback) {
            return this._onGetMarksCallback(symbolInfo, from, to, onDataCallback, resolution)
        }
    }

    getTimescaleMarks(symbolInfo, from, to, onDataCallback, resolution) {
        return undefined
    }

    getServerTime(callback) {
        callback(new Date().getTime() / 1000)
    }

    adjustRangeForExchange(range, exchangeName) {
        if (exchangeName === "bitmart") {
            return {
                from: range.from * 1000,
                to: range.to * 1000,
                countBack: range.countBack,
            };
        } else {
            return range;
        }
    }
}
