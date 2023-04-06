<template>
    <div id="chart">
        <v-card>
            <v-card-title>Chart</v-card-title>
            <v-card-text>
                <keep-alive :key="componentKey">
                    <div id="tv_chart_container" style="height: 85vh"></div>
                </keep-alive>
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
import { widget } from "../../vendor/charting_library";
import DataProvider from "../datafeed/data-provider";
import eventBus from "./eventBus.mjs";
import { mapState } from "vuex";
import { parse } from '../helpers/parse.mjs';
import chartOverrides from "./overrides.mjs";
// import { findLargePriceGaps, addOrdersAboveGaps } from '../strategies/findgap.mjs';

const selectedMarketId =
    localStorage.getItem("selectedMarket") || "BTC/USDT";
const selectedInterval =
    localStorage.getItem("selectedInterval") || "4h";
const datafeed = await DataProvider.create();

export default {
    data() {
        return {
            componentKey: 0,
        }
    },

    computed: {
        ...mapState({
            orderBook: (state) => state.orderBook,
        }),
    },

    mounted() {
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
            theme: "dark",
            custom_css_url: "./themed.css",
            overrides: chartOverrides,
        };

        const tvWidget = new widget(widgetOptions);

        tvWidget.onChartReady(() => {
            const activeChart = tvWidget.activeChart();

            activeChart.dataReady(async () => {
                console.log("Chart Ready");
                const bids = parse(this.orderBook).bids;
                const gaps = await this.findLargePriceGaps(this.getZeroValues(bids));
                const orders = this.addOrdersAboveGaps(gaps, 'buy');

                orders.forEach(order => {
                    this.createOrderLine(activeChart, order, 100, "limit", "buy");
                })
                console.log(orders);
            });

            activeChart.onIntervalChanged().subscribe(null, (interval) => {
                console.log(`Interval changed to ${interval}`);
                localStorage.setItem("selectedInterval", interval);
            });
        });
    },

    methods: {
        async findLargePriceGaps(orderbookData) {
            let prices = orderbookData;
            console.log(prices);
            const priceRange = Math.max(...prices) - Math.min(...prices);
            const threshold = priceRange * 0.05; // 10% of the price range
            const gaps = [];

            for (let i = 1; i < prices.length; i++) {
                const prevPrice = prices[i - 1];
                const currPrice = prices[i];
                const priceGap = Math.abs(currPrice - prevPrice);

                if (priceGap > threshold) {
                    const gap = {
                        price: (prevPrice + currPrice) / 2,
                        highestprice: Math.max(prevPrice, currPrice),
                        lowestprice: Math.min(prevPrice, currPrice),
                    };
                    gaps.push(gap);
                    console.log(`Large price gap detected: ${prevPrice} to ${currPrice} (${priceGap})`);
                }
            }

            return gaps;
        },

        addOrdersAboveGaps(gaps, orderType) {
            const newOrders = [];

            gaps.forEach((gap) => {
                let orderPrice;

                if (orderType === "buy") {
                    orderPrice = gap.highestprice * 0.99; // 1% above the highest price in the gap
                } else if (orderType === "sell") {
                    orderPrice = gap.lowestprice * 1.01; // 1% below the lowest price in the gap: ;
                } else {
                    throw new Error("Invalid order type provided. Please provide either 'buy' or 'sell'.");
                }

                console.log(`Adding ${orderType} order at ${orderPrice}`);

                newOrders.push(orderPrice);
            });

            return newOrders;
        },

        createOrderLine(chart, price, quantity, orderType, orderSide) {
            let orderLine = chart.createOrderLine({
                disableUndo: true,
            });

            orderLine
                .setPrice(price)
                .setQuantity(quantity)
                .setText("buy")

            return orderLine;
        },

        getZeroValues(arr) {
            return arr.map(function (innerArr) {
                return innerArr[0];
            });
        },

        getParameterByName(name) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
            return results === null
                ? ""
                : decodeURIComponent(results[1].replace(/\+/g, " "));
        },
    }
};
</script>
