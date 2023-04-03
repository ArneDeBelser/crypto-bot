// import corsAnywhere from 'cors-anywhere';

// corsAnywhere.createServer({
//     // Set the allowed origin for requests
//     originWhitelist: ['http://localhost:5173'],
// }).listen(8080, 'localhost', function () {
//     console.log('CORS Anywhere server running on localhost:8080');
// });

export default {
    // server: {
    //     proxy: {
    //         '/api': {
    //             target: 'http://localhost:8081',
    //             changeOrigin: true,
    //             pathRewrite: {
    //                 '^/api': ''
    //             }
    //         }
    //     }
    // },
    build: {
        target: 'es2020', // set the target to ES2020 to enable modern syntax
        polyfillDynamicImport: false, // disable dynamic imports polyfill (optional)
        outDir: 'dist', // specify the output directory
        minify: true, // enable minification (optional)
        sourcemap: true, // enable sourcemaps (optional)
        rollupOptions: {
            // include the necessary plugins for transpilation
            plugins: [
                require('@rollup/plugin-commonjs')(),
                require('@rollup/plugin-node-resolve').nodeResolve({
                    browser: true,
                    preferBuiltins: false,
                }),
                require('rollup-plugin-babel')({
                    babelHelpers: 'bundled',
                    presets: ['@babel/preset-env'],
                }),
            ],
        },
    },
};