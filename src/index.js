/* Exchanges */
import './exchanges/bitmart/bitmart.js';

/* CSS */
import './styles/main.scss';

import { createApp } from 'vue/dist/vue.esm-bundler';
import App from './components/App.vue';
import store from './store';
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { fa } from "vuetify/iconsets/fa";
import { aliases, mdi } from "vuetify/lib/iconsets/mdi";
// make sure to also import the coresponding css
import "@mdi/font/css/materialdesignicons.css"; // Ensure you are using css-loader
import "@fortawesome/fontawesome-free/css/all.css"; // Ensure your project is capable of handling css files

const vuetify = createVuetify({
    icons: {
        defaultSet: "mdi",
        aliases,
        sets: {
            mdi,
            fa,
        },
    },
    theme: {
        defaultTheme: 'dark'
    },
    components,
    directives,
})

const app = createApp(App);
app.use(vuetify);
app.use(store);
app.mount('#app');
