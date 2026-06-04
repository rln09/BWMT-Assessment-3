// Pantry Perth — mock stock API
//
// You don't need to edit this file. It's just a stand-in server so the
// stock page has something to talk to — start it and leave it running.
// Nothing you need to fix for the site lives in here.
//
// Tiny standalone Node server (no dependencies). Stands in for the real
// stock service the charity hasn't built yet. Run it with:
//
//     node mock-api/server.js
//
// Then the Stock page (stock.html -> assets/js/stock.js) can fetch
// http://localhost:4000/api/stock

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 4000;
const STOCK_FILE = path.join(__dirname, 'data', 'stock.json');

function corsHeaders() {
    // The static site runs on a different port (or file://), so the
    // browser treats this as cross-origin. Allow it through.
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-API-Key'
    };
}

const server = http.createServer((req, res) => {
    const { method } = req;
    const url = req.url.split('?')[0];

    if (method === 'OPTIONS') {
        res.writeHead(204, corsHeaders());
        res.end();
        return;
    }

    if (method === 'GET' && url === '/api/stock') {
        // Note: we don't actually check the X-API-Key header. The "key"
        // in the front-end JS doesn't gate anything here yet.
        fs.readFile(STOCK_FILE, 'utf8', (err, raw) => {
            if (err) {
                res.writeHead(500, { ...corsHeaders(), 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Could not read stock data' }));
                return;
            }
            // Small delay so it behaves a bit like a real network call.
            setTimeout(() => {
                res.writeHead(200, { ...corsHeaders(), 'Content-Type': 'application/json' });
                res.end(raw);
            }, 300);
        });
        return;
    }

    if (method === 'GET' && (url === '/' || url === '/health')) {
        res.writeHead(200, { ...corsHeaders(), 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok', endpoint: '/api/stock' }));
        return;
    }

    res.writeHead(404, { ...corsHeaders(), 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Stop whatever is using it, or run with a different port: PORT=4001 node mock-api/server.js`);
        process.exit(1);
    }
    throw err;
});

server.listen(PORT, () => {
    console.log(`Pantry Perth mock stock API running at http://localhost:${PORT}`);
    console.log(`  GET http://localhost:${PORT}/api/stock`);
    console.log('Press Ctrl+C to stop.');
});
