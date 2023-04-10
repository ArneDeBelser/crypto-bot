/* Environment configuration */
import dotenv from 'dotenv';
dotenv.config();

import cssOnly from 'rollup-plugin-css-only';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import vue from '@vitejs/plugin-vue';

export default {
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm-bundler.js'
        }
    },
    build: {
        target: 'es2020', // set the target to ES2020 to enable modern syntax
        polyfillDynamicImport: false, // disable dynamic imports polyfill (optional)
        outDir: 'dist', // specify the output directory
        minify: true, // enable minification (optional)
        sourcemap: true, // enable sourcemaps (optional)
        cssCodeSplit: true, // enable CSS code splitting
        rollupOptions: {
            // include the necessary plugins for transpilation
            plugins: [
                require('@rollup/plugin-commonjs')(),
                require('@rollup/plugin-node-resolve').nodeResolve({
                    browser: true,
                    preferBuiltins: false,
                }),
                require('rollup-plugin-babel')({
                    presets: ['@babel/preset-env'],
                }),
            ],
        },
    },
    plugins: [
        vue(),
        cssOnly({
            output: 'styles.css',
        }),
        nodePolyfills({
            // Whether to polyfill `node:` protocol imports.
            protocolImports: true,
        }),
    ],
    optimizeDeps: {
        exclude: ['aws-sdk']
    }
};