import { createStore } from 'vuex';

const store = createStore({
    state: {
        exchange: {},
    },
    mutations: {
        setExchange(state, exchange) {
            state.exchange = exchange;
        },
    },
});

export default store;
