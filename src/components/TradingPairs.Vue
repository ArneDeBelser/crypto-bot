<template>
    <div>
        <div>
            <ul>
                <li v-for="(item, index) in configz" :key="index" @mouseover="showModal(index)" @mouseleave="hideModal">
                    <span>
                        {{ item.symbol }}
                    </span>
                </li>
            </ul>
        </div>

        <v-dialog v-model="modalOpen">
            <v-card>
                <v-card-title>{{ selectedItem.symbol }}</v-card-title>
                <v-card-text>
                    <p><strong>Exchange:</strong> {{ selectedItem.exchange }}</p>
                    <p><strong>Interval:</strong> {{ selectedItem.interval }}</p>
                    <p><strong>Base USDT Amount:</strong> {{ selectedItem.baseUsdtAmount }}</p>
                    <p><strong>Min USDT Amount:</strong> {{ selectedItem.minUsdtAmount }}</p>
                    <p><strong>Max USDT Amount:</strong> {{ selectedItem.maxUsdtAmount }}</p>
                    <p><strong>Ignore:</strong> {{ selectedItem.ignore ? 'Yes' : 'No' }}</p>
                    <p><strong>Strategy:</strong></p>
                    <div v-for="(value, key) in selectedItem.strategy" :key="key">
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
            this.modalOpen = false;
            this.selectedItem = null;
        },
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
