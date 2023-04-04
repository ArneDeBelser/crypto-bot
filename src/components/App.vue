<template>
    <v-app app>
        <v-main>
            <TopBar />
            <v-container>
                <v-row no-gutters>
                    <Sidebar />
                    <Chart />
                    <Orderbook />
                </v-row>
            </v-container>
        </v-main>
    </v-app>
</template>

<script>
import { defineComponent, ref, watch, onMounted } from "vue";
import ccxt from "ccxt";
import TopBar from "./TopBar.vue";
import Sidebar from "./Sidebar.vue";
import Chart from "./Chart.vue";
import Orderbook from "./Orderbook.vue";
import { useStore } from "vuex";

const exchangeName = "bitmart";
const config = await import(`../exchanges/${exchangeName}/config.js`);

export default defineComponent({
    name: "App",

    components: {
        TopBar,
        Sidebar,
        Chart,
        Orderbook,
    },

    setup() {
        const store = useStore();

        onMounted(async () => {
            const exchangeName = "bitmart";
            const config = await import(
                `../exchanges/${exchangeName}/config.js`
            );
            const exchange = new ccxt[exchangeName](config.default);
            store.commit("setExchange", exchange);
        });
    },
});
</script>
