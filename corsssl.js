// JavaScript CORS Proxy
// Save this in a file like cors.js and run with `node cors [port]`
// It will listen for your requests on the port you pass in command line or port 8080 by default
const minimist = require('minimist');
const options = minimist(process.argv.slice(2));
const fs = require('fs');

console.log('https-port:', options['https-port']);
console.log('https-key:', options['https-key']);
console.log('https-cert:', options['https-cert']);

let port = options['https-port'] || 8080;
require('cors-anywhere').createServer({
    httpsOptions: {
        key: fs.readFileSync(options['https-key']),
        cert: fs.readFileSync(options['https-cert']),
    }
}).listen(port, 'localhost');
