<template>
    <v-card class="orderbook">
        <v-card-title>Order Book</v-card-title>
        <v-card-subtitle class="orderbook-header">
            <v-row>
                <v-col class="orderbook-header-item">Price (USD)</v-col>
                <v-col class="orderbook-header-item">Amount</v-col>
                <v-col class="orderbook-header-item">Total (USD)</v-col>
            </v-row>
        </v-card-subtitle>
        <v-list class="orderbook-body">
                <v-list-item
                    v-for="row in orderBookRows"
                    :key="row.id"
                    :class="[row.type]"
                >
                    <v-row>
                        <v-col :class="[row.type + '-price']">{{
                            row.price
                        }}</v-col>
                        <v-col :class="[row.type + '-amount']">{{
                            row.amount
                        }}</v-col>
                        <v-col :class="[row.type + '-total']">{{
                            row.total
                        }}</v-col>
                    </v-row>
                </v-list-item>
        </v-list>
    </v-card>
</template>

<script setup>
import { ref } from "vue";

const orderBookRows = ref([
    {
        id: 1,
        type: "bid",
        price: "58,238.56",
        amount: "0.05854",
        total: "3,406.33",
    },
    {
        id: 2,
        type: "bid",
        price: "58,238.55",
        amount: "0.10000",
        total: "5,823.85",
    },
    {
        id: 3,
        type: "ask",
        price: "58,238.57",
        amount: "0.45000",
        total: "26,207.85",
    },
    {
        id: 4,
        type: "ask",
        price: "58,238.58",
        amount: "0.10000",
        total: "5,823.85",
    },
]);
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
    padding: 0;
}

.orderbook-body .v-list-item {
    border-bottom: 1px solid #e5e5e5;
    cursor: pointer;
    padding: 8px 0;
}

.orderbook-body .v-list-item:last-child {
    border-bottom: none;
}

.orderbook-body .v-list-item--active {
    background-color: #f7f7f7;
}

.bid {
    color: #41a84f;
}

.ask {
    color: #d22d2d;
}

.bid-price,
.bid-amount,
.bid-total {
    text-align: right;
}

.ask-price,
.ask-amount,
.ask-total {
    text-align: right;
}
</style>
