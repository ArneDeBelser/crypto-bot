import { createStore } from 'vuex';

const store = createStore({
    state: {
        exchange: {},
        orderBook: {}
    },

    mutations: {
        setExchange(state, exchange) {
            state.exchange = exchange;
        },

        setOrderBook(state, orderBook) {
            state.orderBook = orderBook;
        }
    }
});

export default store;
