<template>
    <v-card class="orderbook" style="max-height: calc(100vh - 88px);">
        <v-card-title style="font-size: 14px;">Order Book</v-card-title>
        <v-card-subtitle class="orderbook-header" style="padding: 2px; position: sticky;">
            <v-row>
                <v-col class="orderbook-header-item" style="font-size: 12px;">Price (USD)</v-col>
                <v-col class="orderbook-header-item" style="font-size: 12px;">Amount</v-col>
                <v-col class="orderbook-header-item" style="font-size: 12px;">Total (USD)</v-col>
            </v-row>
        </v-card-subtitle>

        <div class="ask-orders">
            <div class="ask-scroll">
                <v-list>
                    <v-list-item v-for="(row, index) in orderBookAsks" :key="'ask-' + index" :class="[row.type]"
                        style="padding: 2px;">
                        <v-row>
                            <v-col :class="[row.type + '-price']" style="font-size: 12px;">{{ row.price }}</v-col>
                            <v-col :class="[row.type + '-amount']" style="font-size: 12px;">{{ row.amount }}</v-col>
                            <v-col :class="[row.type + '-total']" style="font-size: 12px;">{{ (row.price *
                                row.amount).toFixed(2) }}</v-col>
                        </v-row>
                    </v-list-item>
                </v-list>
            </div>
        </div>

        <div class="bid-orders">
            <div class="bid-scroll">
                <v-list>
                    <v-list-item v-for="(row, index) in orderBookBids" :key="'bid-' + index" :class="[row.type]"
                        style="padding: 2px;">
                        <v-row>
                            <v-col :class="[row.type + '-price']" style="font-size: 12px;">{{ row.price }}</v-col>
                            <v-col :class="[row.type + '-amount']" style="font-size: 12px;">{{ row.amount }}</v-col>
                            <v-col :class="[row.type + '-total']" style="font-size: 12px;">{{ (row.price *
                                row.amount).toFixed(2) }}</v-col>
                        </v-row>
                    </v-list-item>
                </v-list>
            </div>
        </div>
    </v-card>
</template>
<script>
import { mapState } from 'vuex';

export default {
    data() {
        return {
            orderbook: [],
        };
    },

    computed: {
        ...mapState(['exchange']),
        orderBookBids() {
            const bids = this.orderbook.bids || [];
            return bids.map((bid, index) => ({
                type: 'bid',
                price: bid[0],
                amount: bid[1],
                total: bid[0] * bid[1],
                id: `bid-${index}`,
            })).reverse();
        },
        orderBookAsks() {
            const asks = this.orderbook.asks || [];
            return asks.map((ask, index) => ({
                type: 'ask',
                price: ask[0],
                amount: ask[1],
                total: ask[0] * ask[1],
                id: `ask-${index}`,
            }));
        },
    },

    methods: {
        async fetchData() {
            try {
                const selectedMarketId = localStorage.getItem('selectedMarket') || 'BTC/USDT';
                await this.$nextTick();

                const orderbookData = await this.exchange.fetchOrderBook(selectedMarketId);

                this.orderbook = orderbookData;

                this.$store.commit('setOrderBook', orderbookData);
            } catch (error) {
                console.error(error);
            }
        },
    },

    async mounted() {
        await this.fetchData();
    },
};
</script>

<style scoped>
.orderbook-header {
    border-bottom: 1px solid #e5e5e5;
}

.orderbook-header-item {
    font-size: 14px;
    font-weight: 500;
    text-transform: uppercase;
    color: #999999;
}

.orderbook-body {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 0;
}

.bid-orders {
    height: 50%;
}

.ask-orders {
    height: 50%;
    overflow-y: scroll;
}

.bid-scroll {
    overflow-y: auto;
    height: 100%;
}

.ask-scroll {
    overflow-y: auto;
    width: 100%;
    display: flex;
}

.ask-scroll div {
    overflow-y: auto;
    width: 100%;
}

.bid-price,
.bid-amount,
.bid-total {
    color: green;
}

.ask-price,
.ask-amount,
.ask-total {
    color: red;
}
</style>