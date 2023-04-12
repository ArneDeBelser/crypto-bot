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
                <v-list ref="list" dense>
                    <v-list-item v-for="(row, index) in orderBookAsks" :key="'ask-' + index" :class="[row.type]"
                        style="padding: 2px;">
                        <v-row no-gutters :style="{ height: `${row.totalPercentage}%`, background: row.background }">
                            <v-col :class="[row.type + '-price', 'text-left']" style="font-size: 12px;">{{ row.price
                            }}</v-col>
                            <v-col :class="[row.type + '-amount', 'text-right']" style="font-size: 12px;">{{ row.amount
                            }}</v-col>
                            <v-col :class="[row.type + '-total', 'text-center']" style="font-size: 12px;">
                                {{ row.total }}
                            </v-col>
                        </v-row>
                    </v-list-item>
                </v-list>
            </div>
        </div>

        <div class="bid-orders">
            <div class="bid-scroll">
                <v-list dense>
                    <v-list-item v-for="(row, index) in orderBookBids" :key="'bid-' + index" :class="[row.type]"
                        style="padding: 2px;">
                        <v-row no-gutters :style="{ height: `${row.totalPercentage}%`, background: row.background }">
                            <v-col :class="[row.type + '-price', 'text-left']" style="font-size: 12px;">{{ row.price
                            }}</v-col>
                            <v-col :class="[row.type + '-amount', 'text-right']" style="font-size: 12px;">{{ row.amount
                            }}</v-col>
                            <v-col :class="[row.type + '-total', 'text-center']" style="font-size: 12px;">
                                {{ row.total }}
                            </v-col>
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

        orderBookAsks() {
            const asks = this.orderbook.asks || [];
            let total = 0;

            return asks.map((ask, index) => {
                const price = ask[0];
                const amount = ask[1];
                const totalAmount = price * amount;
                total += totalAmount;

                return {
                    type: 'ask',
                    price: price,
                    amount: amount,
                    total: totalAmount.toFixed(2),
                    totalPercentage: ((total / this.totalOrderBookAmount) * 100).toFixed(2),
                    background: {
                        width: `${(totalAmount / this.maxOrderBookAmount) * 100}%`,
                        backgroundColor: '#FF5252',
                        opacity: '0.2',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        bottom: 0,
                    },
                    id: `ask-${index}`,
                };
            }).reverse();
        },

        orderBookBids() {
            const bids = this.orderbook.bids || [];
            let total = 0;

            return bids.map((bid, index) => {
                const price = bid[0];
                const amount = bid[1];
                const totalAmount = price * amount;
                total += totalAmount;

                return {
                    type: 'bid',
                    price: price,
                    amount: amount,
                    total: totalAmount.toFixed(2),
                    totalPercentage: ((total / this.totalOrderBookAmount) * 100).toFixed(2),
                    background: {
                        width: `${(totalAmount / this.maxOrderBookAmount) * 100}%`,
                        backgroundColor: '#4CAF50',
                        opacity: '0.2',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        bottom: 0,
                    },
                    id: `bid-${index}`,
                };
            });
        },

        totalOrderBookAmount() {
            const asks = this.orderbook.asks || [];
            const bids = this.orderbook.bids || [];
            const totalAmount = asks.concat(bids).reduce((total, order) => total + order[1], 0);
            return totalAmount.toFixed(2);
        },

        maxOrderBookAmount() {
            const asks = this.orderbook.asks || [];
            const bids = this.orderbook.bids || [];
            const maxAmount = Math.max(...asks.concat(bids).map((order) => order[1]));
            return maxAmount;
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

        scrollToBottom() {
            this.$nextTick(() => {
                const askOrdersDiv = document.querySelector('.ask-orders');
                const lastChild = askOrdersDiv.lastElementChild;
                lastChild.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
            });
        },
    },

    async mounted() {
        await this.fetchData();

        this.scrollToBottom();
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
    color: #089981;
}

.ask-price,
.ask-amount,
.ask-total {
    color: #F23644;
}
</style>