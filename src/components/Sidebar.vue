<template>
  <v-navigation-drawer permanent>
    <v-list color="transparent">
      <v-list-item prepend-icon="mdi-view-dashboard" title="Dashboard"></v-list-item>
      <v-list-item prepend-icon="mdi-account-box" title="Account"></v-list-item>
      <v-list-item prepend-icon="mdi-gavel" title="Admin"></v-list-item>
      <v-divider></v-divider>
      <v-list-item v-for="market in markets" :key="market.symbol" @click="onMarketClick(market)">
        <v-list-item-title>{{ market.symbol }}</v-list-item-title>
      </v-list-item>
    </v-list>

    <template v-slot:append>
      <div class="pa-2">
        <v-btn block color="blue">Logout</v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script setup>
import { onMounted, ref, computed, getCurrentInstance } from 'vue';
import eventBus from './eventBus.mjs';

const instance = getCurrentInstance();
const markets = ref([]);

const exchange = computed(() => {
  return instance.appContext.config.globalProperties.$store.state.exchange;
});

onMounted(async () => {
  // await exchange.value.loadMarkets();
  // console.log(exchange.value);
  // markets.value = Object.values(exchange.value.markets);
});

function onMarketClick(market) {
  console.log('Clicked on ', market.symbol);
  localStorage.setItem('selectedMarket', market.id);
  eventBus.emit('refresh-chart');
}
</script>
