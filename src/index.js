import { widget } from '../vendor/charting_library';
import DataProvider from "./datafeed/data-provider.js";

const widgetOptions = {
    symbol: "BTC_USDT",
    interval: "4h",
    container: "tv_chart_container",
    datafeed: new DataProvider(),
    library_path: "vendor/charting_library/",
    autosize: true,
    timezone: "Etc/UTC",
    theme: "dark",
    locale: "en",
    client_id: "tradingview.com",
    user_id: "public_user_id",
    fullscreen: true,
    autosize: true
};

const tvWidget = new widget(widgetOptions);

tvWidget.onChartReady(() => {
    tvWidget.activeChart().dataReady(async () => {
        console.log('Chart Ready');
    });
});
