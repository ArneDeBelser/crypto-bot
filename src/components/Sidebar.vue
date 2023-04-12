<template>
  <v-navigation-drawer permanent>
    <v-list color="transparent">
      <v-divider></v-divider>
      <v-text-field v-model="search" :label="'Search'" outlined dense style="position: sticky;"></v-text-field>
      <v-pagination v-model="page" :length="totalPages" style="align-self: flex-end"></v-pagination>
      <v-list-item v-for="market in paginatedMarkets" :key="market.symbol" @click="onMarketClick(market)">
        <v-list-item-title>{{ market.symbol }}</v-list-item-title>
      </v-list-item>
      <v-pagination v-model="page" :length="totalPages"></v-pagination>
    </v-list>

    <template v-slot:append>
      <div class="pa-2">
        <v-btn block color="blue">Logout</v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import eventBus from './eventBus.mjs';

const markets = ref([]);
const exchange = computed(() => {
  return store.state.exchange;
});

const store = useStore();
const search = ref('');
const page = ref(0);
const pageSize = ref(50);

const filteredMarkets = computed(() => {
  return markets.value.filter(market => market.symbol.includes(search.value.toUpperCase()));
});

const totalPages = computed(() => {
  return Math.ceil(filteredMarkets.value.length / pageSize.value);
});

const paginatedMarkets = computed(() => {
  const startIndex = page.value * pageSize.value;
  const endIndex = (page.value + 1) * pageSize.value;
  return filteredMarkets.value.slice(startIndex, endIndex);
});

const onMarketClick = (market) => {
  console.log(market.symbol);
  localStorage.setItem('selectedMarket', market.id);
  // eventBus.emit('refresh-chart');
  location.reload();
};

onMounted(() => {
  setTimeout(async () => {
    await exchange.value.loadMarkets();
    markets.value = Object.values(exchange.value.markets);
  }, 1000)
});
</script>