// JavaScript CORS Proxy
// Save this in a file like cors.js and run with `node cors [port]`
// It will listen for your requests on the port you pass in command line or port 8080 by default
const minimist = require('minimist');
const options = minimist(process.argv.slice(2));
const fs = require('fs');

let port = options['https-port'] || 8080;

// Sanitize key and cert file paths
const sanitizedKeyPath = options['https-key'].replace(/[^a-zA-Z0-9/]+/g, '');
const sanitizedCertPath = options['https-cert'].replace(/[^a-zA-Z0-9/]+/g, '');

require('cors-anywhere').createServer({
    httpsOptions: {
        key: fs.readFileSync(sanitizedKeyPath),
        cert: fs.readFileSync(sanitizedCertPath),
    }
}).listen(port, 'localhost');
