const http = require('http');
const fs = require('fs');
const path = require('path');

const port = Number(process.env.PORT) || 8080;
const publicDirectory = path.resolve(__dirname, 'dist', 'rockX');
const indexFile = path.join(publicDirectory, 'index.html');

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp'
};

function sendFile(response, filePath) {
  fs.stat(filePath, (statError, stats) => {
    if (statError || !stats.isFile()) {
      if (filePath !== indexFile) {
        sendFile(response, indexFile);
        return;
      }

      response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('Portal build not found.');
      return;
    }

    const extension = path.extname(filePath).toLowerCase();
    const headers = {
      'Content-Type': contentTypes[extension] || 'application/octet-stream',
      'X-Content-Type-Options': 'nosniff'
    };

    if (filePath !== indexFile) {
      headers['Cache-Control'] = 'public, max-age=31536000, immutable';
    } else {
      headers['Cache-Control'] = 'no-cache';
    }

    response.writeHead(200, headers);
    fs.createReadStream(filePath).pipe(response);
  });
}

const server = http.createServer((request, response) => {
  const requestUrl = new URL(request.url, 'http://localhost');
  let pathname;

  try {
    pathname = decodeURIComponent(requestUrl.pathname);
  } catch (error) {
    response.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Invalid request path.');
    return;
  }

  const requestedFile = pathname === '/'
    ? indexFile
    : path.resolve(publicDirectory, `.${pathname}`);

  if (requestedFile !== publicDirectory && !requestedFile.startsWith(`${publicDirectory}${path.sep}`)) {
    response.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Forbidden.');
    return;
  }

  sendFile(response, requestedFile);
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Portal Search Desk listening on port ${port}`);
});

function shutdown() {
  server.close(() => process.exit(0));
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
