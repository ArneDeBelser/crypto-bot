<template>
    <v-card>
        <v-card-title>Trading Report</v-card-title>
        <v-card-text>
            <v-row>
                <v-col cols="12" sm="6">
                    <v-text-field v-model="from" label="From" type="datetime-local" outlined></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                    <v-text-field v-model="to" label="To" type="datetime-local" outlined></v-text-field>
                </v-col>
            </v-row>
            <v-divider></v-divider>
            <v-row v-if="orders.length">
                <v-col cols="12" sm="6">
                    <v-card>
                        <v-card-text>
                            <div>Break-even price: {{ breakEvenPrice }}</div>
                            <div>Average entry price: {{ avgEntryPrice }}</div>
                            <div>Amount of trades: {{ buyTrades }} (buys), {{ sellTrades }} (sells)</div>
                            <div>Total USDT bought: {{ totalUsdtBought }}</div>
                            <div>Total USDT sold: {{ totalUsdtSold }}</div>
                        </v-card-text>
                    </v-card>
                </v-col>
                <v-col cols="12" sm="6">
                    <v-card>
                        <v-card-text>
                            <div>Realized PNL: {{ realizedPnlPercentage }}% ({{ realizedPnlUsdt }} USDT)</div>
                            <div>Unrealized PNL: {{ unrealizedPnlPercentage }}% ({{ unrealizedPnlUsdt }} USDT)</div>
                            <div>Net PNL: {{ netPnlPercentage }}% ({{ netPnlUsdt }} USDT)</div>
                            <div>Fees paid: {{ feesPaidPercentage }}% ({{ feesPaidUsdt }} USDT)</div>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
            <v-row v-else>
                <v-col>
                    <v-card>
                        <v-card-text>No orders found</v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script>
export default {
    data() {
        return {
            from: "",
            to: "",
            filteredOrders: [],
        };
    },

    computed: {
        orders() {
            return this.$store.state.orders
        },

        avgBuyPrice() {
            let totalCost = 0;
            let totalAmount = 0;

            for (let i = 0; i < this.orders.length; i++) {
                const purchase = this.orders[i];
                if (purchase.side === 'buy' && purchase.amount !== 0) {
                    totalCost += purchase.cost;
                    totalAmount += purchase.amount;
                }
            }

            const avgBuyPrice = totalCost / totalAmount;
            return avgBuyPrice;
        },

        breakEvenPrice() {
            let totalCost = 0;
            let totalFees = 0;
            let totalAmount = 0;


            this.orders.forEach((order) => {
                if (order.side === 'buy') {
                    totalCost += order.cost;
                    totalFees += order.fee_cost;
                    totalAmount += order.amount;
                } else if (order.side === 'sell') {
                    totalCost -= order.cost;
                    totalFees += order.fee_cost;
                    totalAmount -= order.amount;
                }
            });

            console.log('totalCost', totalCost);
            console.log('totalFees', totalFees);
            console.log('totalAmount', totalAmount);

            const netCost = totalCost + totalFees;
            console.log('netCost', netCost);
            console.log('sum', netCost / totalAmount);

            return this.convertScientificToFloat(netCost / totalAmount);
        },

        avgEntryPrice() {
            let totalCost = 0;
            let totalAmount = 0;
            this.orders.forEach((order) => {
                totalCost += order.cost;
                totalAmount += order.amount;
            });

            return this.convertScientificToFloat(totalCost / totalAmount);
        },

        buyTrades() {
            return this.orders.filter((order) => order.side === "buy").length;
        },

        sellTrades() {
            return this.orders.filter((order) => order.side === "sell").length;
        },

        totalUsdtBought() {
            return this.orders
                .filter((order) => order.side === "buy")
                .reduce((total, order) => total + order.cost, 0);
        },

        totalAmountBought() {
            return this.orders
                .filter((order) => order.side === "buy")
                .reduce((total, order) => total + order.amount, 0);
        },

        totalUsdtSold() {
            return this.orders
                .filter((order) => order.side === "sell")
                .reduce((total, order) => total + order.cost, 0);
        },

        totalAmountSold() {
            return this.orders
                .filter((order) => order.side === "sell")
                .reduce((total, order) => total + order.amount, 0);
        },

        realizedPnlPercentage() {
            let realizedPnl = 0;
            let totalEntryCost = 0;
            const buys = [];
            const sells = [];

            this.orders.forEach((order) => {
                if (order.side === "buy") {
                    buys.push(order);
                } else {
                    sells.push(order);
                }
            });

            for (const sell of sells) {
                while (sell.amount > 0 && buys.length > 0) {
                    const buy = buys[0];
                    const sellAmount = Math.min(buy.amount, sell.amount);

                    const entryCost = sellAmount * buy.price_avg;
                    const exitCost = sellAmount * sell.price_avg;

                    realizedPnl += exitCost - entryCost - sellAmount * sell.fee_cost;
                    totalEntryCost += entryCost;

                    buy.amount -= sellAmount;
                    sell.amount -= sellAmount;

                    if (buy.amount === 0) {
                        buys.shift();
                    }
                }
            }

            return (realizedPnl / totalEntryCost) * 100;
        },

        realizedPnlUsdt() {
            let realizedPnl = 0;
            const buys = [];
            const sells = [];

            this.orders.forEach((order) => {
                if (order.side === "buy") {
                    buys.push(order);
                } else {
                    sells.push(order);
                }
            });

            for (const sell of sells) {
                while (sell.amount > 0 && buys.length > 0) {
                    const buy = buys[0];
                    const sellAmount = Math.min(buy.amount, sell.amount);

                    const entryCost = sellAmount * buy.price_avg;
                    const exitCost = sellAmount * sell.price_avg;

                    realizedPnl += exitCost - entryCost - sellAmount * sell.fee_cost;

                    buy.amount -= sellAmount;
                    sell.amount -= sellAmount;

                    if (buy.amount === 0) {
                        buys.shift();
                    }
                }
            }

            return realizedPnl;
        },

        unrealizedPnlPercentage() {
            let unrealizedPnl = 0;
            let totalEntryCost = 0;
            const buys = [];
            const sells = [];
            const currentPrice = 0; // Replace this with the current price of the trading pair

            this.orders.forEach((order) => {
                if (order.side === "buy") {
                    buys.push(order);
                } else {
                    sells.push(order);
                }
            });

            // Match buys and sells using FIFO method
            for (const sell of sells) {
                while (sell.amount > 0 && buys.length > 0) {
                    const buy = buys[0];
                    const sellAmount = Math.min(buy.amount, sell.amount);
                    buy.amount -= sellAmount;
                    sell.amount -= sellAmount;

                    if (buy.amount === 0) {
                        buys.shift();
                    }
                }
            }

            // Calculate unrealized PNL for remaining buy orders
            for (const buy of buys) {
                const entryCost = buy.amount * buy.price_avg;
                const exitCost = buy.amount * currentPrice;
                unrealizedPnl += exitCost - entryCost;
                totalEntryCost += entryCost;
            }

            return (unrealizedPnl / totalEntryCost) * 100;
        },

        unrealizedPnlUsdt() {
            let unrealizedPnl = 0;
            const buys = [];
            const sells = [];
            const currentPrice = 0; // Replace this with the current price of the trading pair

            this.orders.forEach((order) => {
                if (order.side === "buy") {
                    buys.push(order);
                } else {
                    sells.push(order);
                }
            });

            // Match buys and sells using FIFO method
            for (const sell of sells) {
                while (sell.amount > 0 && buys.length > 0) {
                    const buy = buys[0];
                    const sellAmount = Math.min(buy.amount, sell.amount);
                    buy.amount -= sellAmount;
                    sell.amount -= sellAmount;

                    if (buy.amount === 0) {
                        buys.shift();
                    }
                }
            }

            // Calculate unrealized PNL for remaining buy orders
            for (const buy of buys) {
                const entryCost = buy.amount * buy.price_avg;
                const exitCost = buy.amount * currentPrice;
                unrealizedPnl += exitCost - entryCost;
            }

            return unrealizedPnl;
        },

        netPnlPercentage() {
            const realizedPnlPercentage = this.realizedPnlPercentage;
            const unrealizedPnlPercentage = this.unrealizedPnlPercentage;

            // Calculate the total entry cost
            let totalEntryCost = 0;
            this.orders.forEach((order) => {
                if (order.side === "buy") {
                    totalEntryCost += order.cost;
                }
            });

            // Calculate the net PNL in USDT
            const realizedPnlUsdt = (realizedPnlPercentage / 100) * totalEntryCost;
            const unrealizedPnlUsdt = (unrealizedPnlPercentage / 100) * totalEntryCost;
            const netPnlUsdt = realizedPnlUsdt + unrealizedPnlUsdt;

            // Calculate the net PNL percentage
            return (netPnlUsdt / totalEntryCost) * 100;
        },

        netPnlUsdt() {
            const realizedPnlUsdt = this.realizedPnlUsdt;
            const unrealizedPnlUsdt = this.unrealizedPnlUsdt;

            // Calculate the net PNL in USDT
            return realizedPnlUsdt + unrealizedPnlUsdt;
        },

        feesPaidPercentage() {
            const totalFees = this.orders.reduce(
                (total, order) => total + order.fee_cost,
                0
            );
            const totalCost = this.orders.reduce(
                (total, order) => total + order.cost,
                0
            );
            return (totalFees / totalCost) * 100;
        },

        feesPaidUsdt() {
            return this.orders.reduce(
                (total, order) => total + order.fee_cost,
                0
            );
        },
    },

    methods: {
        getFilteredOrders() {
            if (this.from || this.to) {
                const fromDate = new Date(this.from).getTime();
                const toDate = new Date(this.to).getTime();
                this.filteredOrders = this.orders.filter(
                    (order) =>
                        new Date(order.datetime).getTime() >= fromDate &&
                        new Date(order.datetime).getTime() <= toDate
                );
            } else {
                this.filteredOrders = this.orders;
            }
        },

        convertScientificToFloat(num) {
            // If the number is not in scientific notation return it as it is.
            if (!/\d+\.?\d*e[+-]*\d+/i.test(num)) {
                return num;
            }

            // Remove the sign.
            const numberSign = Math.sign(Number(num));
            num = Math.abs(Number(num)).toString();

            // Parse into coefficient and exponent.
            const [coefficient, exponent] = num.toLowerCase().split("e");
            let zeros = Math.abs(Number(exponent));
            const exponentSign = Math.sign(Number(exponent));
            const [integer, decimals] = (coefficient.indexOf(".") != -1 ? coefficient : `${coefficient}.`).split(".");

            if (exponentSign === -1) {
                zeros -= integer.length;
                num =
                    zeros < 0
                        ? integer.slice(0, zeros) + "." + integer.slice(zeros) + decimals
                        : "0." + "0".repeat(zeros) + integer + decimals;
            } else {
                if (decimals) zeros -= decimals.length;
                num =
                    zeros < 0
                        ? integer + decimals.slice(0, zeros) + "." + decimals.slice(zeros)
                        : integer + decimals + "0".repeat(zeros);
            }

            return numberSign < 0 ? "-" + num : num;
        }
    },
};
</script>

<style scoped>
/* Add your component styles here */
</style>

