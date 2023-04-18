// JavaScript CORS Proxy
// Save this in a file like cors.js and run with `node cors [port]`
// It will listen for your requests on the port you pass in command line or port 8080 by default
let port = (process.argv.length > 2) ? parseInt(process.argv[2]) : 8081; // default
const cors_proxy = require('cors-anywhere');
cors_proxy.createServer(function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    console.log(`[${new Date().toISOString()}] Access from: ${JSON.stringify(req.headers['origin'])}, Method: ${JSON.stringify(req.method)}, URL: ${JSON.stringify(req.url)}`);
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    // Proxy the request to the desired destination
    cors_proxy.request({
        url: req.headers['x-destination-url'] || req.url,
        method: req.method,
        headers: req.headers,
        body: req.body,
        encoding: null,
    }, function (error, response, body) {
        if (error) {
            console.error(`[${new Date().toISOString()}] Error occurred: ${error}`);
            res.writeHead(500);
            res.end();
            return;
        }
        res.writeHead(response.statusCode, response.headers);
        res.end(body);
    });
}).listen(port, 'localhost', function () {
    console.log(`[${new Date().toISOString()}] CORS Anywhere started on port ${port}`);
});
