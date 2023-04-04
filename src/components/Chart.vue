<template>
    <div id="chart">
        <v-card>
            <v-card-title>Chart</v-card-title>
            <v-card-text>
                <div id="tv_chart_container" style="height: 85vh"></div>
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
import { onMounted, defineProps } from "vue";
import { widget } from "../../vendor/charting_library";
import DataProvider from "../datafeed/data-provider";

export default {
    props: {
        exchange: {
            type: Object,
        },
    },

    setup(props) {
        onMounted(() => {
            const widgetOptions = {
                symbol: "BTC_USDT",
                interval: "4h",
                container: "tv_chart_container",
                datafeed: new DataProvider(props.exchange),
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
                tvWidget.activeChart().dataReady(async () => {
                    console.log("Chart Ready");
                });
            });
        });
    },
};
</script>
