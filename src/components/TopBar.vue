<template>
    <v-app-bar dense>
        <v-toolbar-title>CryptAlyze Bot</v-toolbar-title>
        <v-spacer></v-spacer>
        <Exchanges />
        <v-spacer></v-spacer>
        <v-btn icon @click="start" :disabled="bot.status === 'Running'">
            <v-icon>mdi-play</v-icon>
        </v-btn>
        <v-btn icon @click="stop" :disabled="bot.status !== 'Running'">
            <v-icon>mdi-stop</v-icon>
        </v-btn>
        <v-chip v-if="bot.status === 'Running'" color="green">Running</v-chip>
        <v-chip v-if="bot.status !== 'Running'" color="red">Stopped</v-chip>
    </v-app-bar>
</template>

<script>
import axios from 'axios';
import { reactive } from 'vue';
import Exchanges from "./Exchanges.vue";
import { apiStartBot, apiStopBot, apiPollBotStatus } from '../helpers/request.mjs';

const appUrl = import.meta.env.VITE_SERVER_URL;

export default {
    components: {
        Exchanges,
    },

    setup() {
        const bot = reactive({
            pid: null,
            status: null,
        });

        async function start() {
            apiStartBot();
        }

        async function stop() {
            apiStopBot();
        }

        setInterval(async () => {
            try {
                const { data } = await axios.get(`${appUrl}api/bot-status`);
                bot.status = data.status;
                console.log("TopBar.vue: Current bot status:", bot.status);
            }
            catch (error) {
                console.error("TopBar.vue: Failed to get bot status:", error);
            }
        }, 5000);

        return {
            bot,
            start,
            stop,
        };
    },
};
</script>
