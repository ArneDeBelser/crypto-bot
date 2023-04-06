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

    actions: {
        async initStore({ commit }) {
            const exchangeName = "bitmart";
            const config = await import(`./exchanges/${exchangeName}/config.mjs`);
            const exchange = new ccxt[exchangeName](config.default);
            commit('setExchange', exchange);
        }
    }
});

export default store;
