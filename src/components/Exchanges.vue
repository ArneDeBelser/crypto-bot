<template>
    <div>
        <h2>Exchanges</h2>
        <div class="exchanges-list">
            <div v-for="(exchange, index) in exchanges" :key="index" @click="handleExchangeClick(exchange)">
                <span>{{ exchange.toLocaleUpperCase() }}</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            exchanges: [
                'bitmart',
                'bitget',
                'probit',
            ],
        };
    },

    methods: {
        handleExchangeClick(exchange) {
            console.log(exchange);
            localStorage.setItem('selectedExchange', exchange);
            localStorage.setItem('selectedMarket', 'BTC/USDT');
            location.reload();
        }
    }
};
</script>

<style>
.exchanges-list {
    display: flex;
    overflow-x: auto;
}

.exchanges-list>div {
    margin-right: 16px;
    cursor: pointer;
}
</style>
