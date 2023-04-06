<template>
    <v-app app>
        <v-main>
            <TopBar />
            <v-container>
                <v-row no-gutters>
                    <Sidebar />
                    <Suspense>
                        <Chart />
                    </Suspense>
                    <Orderbook />
                </v-row>
            </v-container>
        </v-main>
    </v-app>
</template>

<script>
import { defineComponent } from "vue";
import TopBar from "./TopBar.vue";
import Sidebar from "./Sidebar.vue";
import Chart from "./Chart.vue";
import Orderbook from "./Orderbook.vue";

export default defineComponent({
    name: "App",

    components: {
        Chart,
        TopBar,
        Sidebar,
        Orderbook,
    },
});
</script>
