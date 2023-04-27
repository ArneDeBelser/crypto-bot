<template>
    <div>
        <div>
            <v-list dense>
                <v-list-item v-for="(item, index) in configz" :key="index" @click="showModal(index)"
                    @mouseleave="hideModal">
                    <v-list-item-content>
                        <v-list-item-title>
                            {{ item.symbol }}
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </div>

        <v-dialog v-model="modalOpen" @mouseenter="cancelHideModal">
            <v-card>
                <v-card-title>{{ selectedItem.symbol }}</v-card-title>
                <v-card-text>
                    <p><strong>Exchange:</strong> {{ selectedItem.exchange }}</p>
                    <p><strong>Interval:</strong> {{ millisecondsToStr(selectedItem.interval) }}</p>
                    <p><strong>Base USDT Amount:</strong> {{ selectedItem.baseUsdtAmount }}</p>
                    <p><strong>Min USDT Amount:</strong> {{ selectedItem.minUsdtAmount }}</p>
                    <p><strong>Max USDT Amount:</strong> {{ selectedItem.maxUsdtAmount }}</p>
                    <p><strong>Ignore:</strong> {{ selectedItem.ignore ? 'Yes' : 'No' }}</p>
                    <p><strong>Strategy:</strong></p>
                    <div style="margin-left: 20px;" v-for="(value, key) in selectedItem.strategy" :key="key">
                        <p><strong>{{ key }}:</strong> {{ value }}</p>
                    </div>
                </v-card-text>
            </v-card>
            <div class="modal-background" v-on:click="hideModal"></div>
        </v-dialog>
    </div>
</template>

<script>
import { config } from '../config/pairs.mjs';

export default {
    data() {
        return {
            config,
            modalOpen: false,
            selectedItem: null,
        };
    },

    computed: {
        configz() {
            return config.filter(
                (configurationItem) =>
                    configurationItem.ignore == false ||
                    configurationItem.ignore == undefined ||
                    !configurationItem.hasOwnProperty('ignore')
            );
        },
    },

    methods: {
        showModal(index) {
            this.selectedItem = this.configz[index];
            this.modalOpen = true;
        },

        hideModal() {
            this.hideTimeout = setTimeout(() => {
                this.modalOpen = false;
                this.selectedItem = null;
            }, 100);
        },

        cancelHideModal() {
            clearTimeout(this.hideTimeout);
        },

        millisecondsToStr(milliseconds) {
            // TIP: to find current time in milliseconds, use:
            // var  current_time_milliseconds = new Date().getTime();

            function numberEnding(number) {
                return (number > 1) ? 's' : '';
            }

            var temp = Math.floor(milliseconds / 1000);
            var years = Math.floor(temp / 31536000);
            if (years) {
                return years + ' year' + numberEnding(years);
            }
            //TODO: Months! Maybe weeks? 
            var days = Math.floor((temp %= 31536000) / 86400);
            if (days) {
                return days + ' day' + numberEnding(days);
            }
            var hours = Math.floor((temp %= 86400) / 3600);
            if (hours) {
                return hours + ' hour' + numberEnding(hours);
            }
            var minutes = Math.floor((temp %= 3600) / 60);
            if (minutes) {
                return minutes + ' minute' + numberEnding(minutes);
            }
            var seconds = temp % 60;
            if (seconds) {
                return seconds + ' second' + numberEnding(seconds);
            }
            return 'less than a second'; //'just now' //or other string you like;
        }
    },
};
</script>

<style>
.modal-background {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
}

.v-dialog--active {
    z-index: 9999 !important;
}
</style>
