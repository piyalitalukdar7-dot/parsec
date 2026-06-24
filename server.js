// Simple PARSEC backend using native Node.js HTTP
const http = require('http');
const url = require('url');

let state = { count: 0 };

const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // GET /state
  if (pathname === '/state' && req.method === 'GET') {
    res.writeHead(200);
    res.end(JSON.stringify(state));
    return;
  }

  // POST /actions/increment
  if (pathname === '/actions/increment' && req.method === 'POST') {
    state.count++;
    res.writeHead(200);
    res.end(JSON.stringify({ state }));
    return;
  }

  // POST /actions/decrement
  if (pathname === '/actions/decrement' && req.method === 'POST') {
    state.count--;
    res.writeHead(200);
    res.end(JSON.stringify({ state }));
    return;
  }

  // POST /actions/reset
  if (pathname === '/actions/reset' && req.method === 'POST') {
    state.count = 0;
    res.writeHead(200);
    res.end(JSON.stringify({ state }));
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(8000, () => {
  console.log('✓ PARSEC backend running on http://localhost:8000');
  console.log(`  Current state: ${JSON.stringify(state)}`);
  console.log('');
  console.log('  Endpoints:');
  console.log('    GET  /state');
  console.log('    POST /actions/increment');
  console.log('    POST /actions/decrement');
  console.log('    POST /actions/reset');
});
