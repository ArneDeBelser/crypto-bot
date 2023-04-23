import { createStore } from 'vuex';

const store = createStore({
    state: {
        exchange: {},
        orderBook: {},
        orders: {}
    },

    mutations: {
        setExchange(state, exchange) {
            state.exchange = exchange;
        },

        setOrderBook(state, orderBook) {
            state.orderBook = orderBook;
        },

        setOrders(state, orders) {
            state.orders = orders;
        }
    }
});

export default store;
