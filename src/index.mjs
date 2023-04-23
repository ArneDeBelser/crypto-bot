/* CSS */
import './styles/main.scss';

/* Vue */
import { createApp } from 'vue/dist/vue.esm-bundler';
import App from './components/App.vue';
import store from './store.mjs';

/* Vuetify */
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { fa } from "vuetify/iconsets/fa";
import { aliases, mdi } from "vuetify/lib/iconsets/mdi";
import "@mdi/font/css/materialdesignicons.css";
import "@fortawesome/fontawesome-free/css/all.css";

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

/* Vue Plugins */
app.use(vuetify);
app.use(store);

const vm = app.mount('#app');
