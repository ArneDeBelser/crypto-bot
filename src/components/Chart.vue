<template>
    <div id="chart">
        <v-card>
            <v-toolbar>
                <v-toolbar-title>Chart</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn color="yellow darken-3" @click="fetchTestStrategy">Test Strategy</v-btn>
            </v-toolbar>
            <v-card-text>
                <keep-alive :key="componentKey">
                    <div id="tv_chart_container" style="height: 85vh"></div>
                </keep-alive>
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
import axios from 'axios';
import { mapState } from "vuex";
import chartOverrides from "./overrides.mjs";
import DataProvider from "../datafeed/data-provider";
import { widget } from "../../vendor/charting_library";
import { drawArrow, drawOrderLine, drawTestOrderLine } from './chartingFunctions.mjs';

const appUrl = import.meta.env.VITE_SERVER_URL;
const datafeed = await DataProvider.create();

export default {
    data() {
        return {
            chart: null,
            testAsks: [],
            testBids: [],
            openOrders: [],
            userTrades: [],
            componentKey: 0,
            exchange: 'bitmart',
            drawnOrderShapes: [],
            selectedInterval: localStorage.getItem("selectedInterval") || "4h",
            selectedMarketId: localStorage.getItem("selectedMarket") || "BTC/USDT",
        }
    },

    computed: {
        ...mapState({
            orderBook: (state) => state.orderBook,
        }),

        ...mapState({
            exchangeObject: (state) => state.exchange,
        })
    },

    mounted() {
        const widgetOptions = {
            symbol: this.selectedMarketId,
            interval: this.selectedInterval,
            container: "tv_chart_container",
            datafeed: datafeed,
            library_path: "vendor/charting_library/",
            autosize: true,
            timezone: "Etc/UTC",
            theme: "dark",
            locale: "en",
            client_id: "tradingview.com",
            user_id: "public_user_id",
            theme: "dark",
            overrides: chartOverrides,
        };

        const tvWidget = new widget(widgetOptions);

        tvWidget.onChartReady(() => {
            this.chart = tvWidget.activeChart();

            this.chart.dataReady(async () => {
                await this.fetchUserTrades().then(() => {
                    this.userTrades.forEach((trade) => {
                        const shape = drawArrow(this.chart, trade);
                        this.drawnOrderShapes.push(shape);
                    });
                });

                await this.fetchOpenOrders().then(() => {
                    if (this.openOrders > 0) return;

                    this.openOrders.forEach((order) => drawOrderLine(this.chart, order));
                });
            });

            this.chart.onIntervalChanged().subscribe(null, (interval) => localStorage.setItem("selectedInterval", interval));
        });
    },

    watch: {
        testAsks: {
            handler(newVal, oldVal) {
                this.testAsks.forEach((price) => drawTestOrderLine(this.chart, price, "sell"));
            },
            deep: true
        },
        testBids: {
            handler(newVal, oldVal) {
                this.testBids.forEach((price) => drawTestOrderLine(this.chart, price, "buy"));
            },
            deep: true
        }
    },

    methods: {
        async fetchUserTrades() {
            try {
                const response = await axios.get(`${appUrl}api/get-orders/${this.exchange}/${this.selectedMarketId}`);
                this.userTrades = response.data.orders;
            } catch (error) {
                console.error(error);
            }
        },

        async fetchOpenOrders() {
            this.openOrders = await this.exchangeObject.fetchOpenOrders(this.selectedMarketId);
        },

        async fetchTestStrategy() {
            try {
                const response = await axios.get(`${appUrl}api/test-strategy/${this.selectedMarketId}`);
                this.testAsks = response.data.orders.asks;
                this.testBids = response.data.orders.bids;
            } catch (error) {
                console.log(error);
                alert(error.response.data.error);
            }
        },
    }
};
</script>
