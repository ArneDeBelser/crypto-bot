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

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState({
      exchange: state => state.exchange
    }),

    filteredMarkets() {
      return this.markets.filter(market => market.symbol.includes(this.search.toUpperCase()));
    },

    totalPages() {
      return Math.ceil(this.filteredMarkets.length / this.pageSize);
    },

    paginatedMarkets() {
      const startIndex = this.page * this.pageSize;
      const endIndex = (this.page + 1) * this.pageSize;
      return this.filteredMarkets.slice(startIndex, endIndex);
    }
  },

  data() {
    return {
      page: 0,
      pageSize: 50,
      markets: [],
      search: '',
    };
  },

  methods: {
    onMarketClick(market) {
      console.log(market.symbol);
      localStorage.setItem('selectedMarket', market.id);
      // eventBus.emit('refresh-chart');
      location.reload();
    }
  },

  mounted() {
    setTimeout(async () => {
      await this.exchange.loadMarkets();
      this.markets = Object.values(this.exchange.markets);
    }, 1000);
  }
};
</script>
