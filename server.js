const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

function sendFile(res, filePath) {
  const ext = path.extname(filePath);
  const type = mimeTypes[ext] || 'application/octet-stream';
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': type });
    res.end(content);
  });
}

const server = http.createServer((req, res) => {
  const cleanUrl = decodeURIComponent(req.url.split('?')[0]);

  if (cleanUrl === '/' || cleanUrl === '/login') {
    return sendFile(res, path.join(PUBLIC_DIR, 'login.html'));
  }

  if (cleanUrl === '/dashboard') {
    return sendFile(res, path.join(PUBLIC_DIR, 'dashboard.html'));
  }

  const requested = path.join(PUBLIC_DIR, cleanUrl.replace(/^\//, ''));
  if (!requested.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('Forbidden');
  }

  sendFile(res, requested);
});

server.listen(PORT, () => {
  console.log(`Rob Meeting Intelligence Demo running on port ${PORT}`);
});
