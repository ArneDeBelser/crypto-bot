<template>
    <div id="chart">
        <v-card>
            <v-card-title>Chart</v-card-title>
            <v-card-text>
                <div id="tv_chart_container" style="height: 85vh" :key="componentKey"></div>
            </v-card-text>
        </v-card>
    </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { widget } from "../../vendor/charting_library";
import DataProvider from "../datafeed/data-provider";
import eventBus from './eventBus.mjs';

const selectedMarketId = localStorage.getItem('selectedMarket') || 'BTC/USDT';
const selectedInterval = localStorage.getItem('selectedInterval') || '4h';
const datafeed = await DataProvider.create();

console.log(selectedMarketId);

const componentKey = ref(0);

onMounted(async () => {
    // eventBus.on('refresh-chart', (payload) => {
    //     console.log(payload);
    // });

    const widgetOptions = {
        symbol: selectedMarketId,
        interval: selectedInterval,
        container: "tv_chart_container",
        datafeed: datafeed,
        library_path: "vendor/charting_library/",
        autosize: true,
        timezone: "Etc/UTC",
        theme: "dark",
        locale: "en",
        client_id: "tradingview.com",
        user_id: "public_user_id",
    };

    const tvWidget = new widget(widgetOptions);

    tvWidget.onChartReady(() => {
        const activeChart = tvWidget.activeChart();

        activeChart.dataReady(async () => {
            console.log("Chart Ready");
        });

        activeChart.onIntervalChanged().subscribe(null, (interval) => {
            console.log(`Interval changed to ${interval}`);
            localStorage.setItem('selectedInterval', interval);
        });
    });
});
</script>
