<template>
    <v-app app>
        <v-main>
            <TopBar />
            <v-container>
                <v-row no-gutters>
                    <Sidebar />
                    <v-col cols="12">
                        <v-row no-gutters>
                            <v-col cols="9">
                                <v-row no-gutters>
                                    <Suspense>
                                        <Chart />
                                    </Suspense>
                                </v-row>
                            </v-col>
                            <v-col cols="3">
                                <v-row no-gutters>
                                    <Orderbook />
                                </v-row>
                            </v-col>
                        </v-row>

                        <v-row no-gutters>
                            <BreakEvenCalc />
                        </v-row>
                    </v-col>
                </v-row>
            </v-container>
        </v-main>
    </v-app>
</template>

<script>
import Chart from "./Chart.vue";
import TopBar from "./TopBar.vue";
import Sidebar from "./Sidebar.vue";
import { defineComponent } from "vue";
import Orderbook from "./Orderbook.vue";
import BreakEvenCalc from "./BreakEvenCalc.vue";

export default defineComponent({
    name: "App",

    components: {
        Chart,
        TopBar,
        Sidebar,
        Orderbook,
        BreakEvenCalc,
    },
});
</script>
