/*
 * serve.js - zero-dependency static server for local testing.
 * Usage: node serve.js            (port 8082)
 *        PORT=9000 node serve.js
 * Serves this folder. Binds all interfaces so the iPad can reach it over Wi-Fi.
 * Note: the service worker only registers on localhost or https, so test
 * PWA install and offline on the GitHub Pages URL, not over the LAN.
 */
'use strict';

var http = require('http');
var fs = require('fs');
var path = require('path');
var os = require('os');

var PORT = parseInt(process.env.PORT, 10) || 8082;
var ROOT = __dirname;
var MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.md': 'text/plain; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8'
};

function send(res, code, type, body) {
  res.writeHead(code, { 'Content-Type': type, 'Cache-Control': 'no-store', 'Content-Length': Buffer.byteLength(body) });
  res.end(body);
}

http.createServer(function (req, res) {
  var urlPath;
  try {
    urlPath = decodeURIComponent(req.url.split('?')[0]);
  } catch (e) {
    return send(res, 400, 'text/plain', 'Bad request');
  }
  if (urlPath.slice(-1) === '/') urlPath += 'index.html';
  var file = path.resolve(ROOT, '.' + urlPath);
  if (file !== ROOT && file.indexOf(ROOT + path.sep) !== 0) return send(res, 403, 'text/plain', 'Forbidden');
  fs.readFile(file, function (err, data) {
    if (err) return send(res, 404, 'text/plain', 'Not found: ' + urlPath);
    var type = MIME[path.extname(file).toLowerCase()] || 'application/octet-stream';
    send(res, 200, type, data);
  });
}).listen(PORT, '0.0.0.0', function () {
  console.log('Word and Number Land local server');
  console.log('  PC:   http://localhost:' + PORT);
  var ifaces = os.networkInterfaces();
  Object.keys(ifaces).forEach(function (name) {
    ifaces[name].forEach(function (addr) {
      if (addr.family === 'IPv4' && !addr.internal) console.log('  iPad: http://' + addr.address + ':' + PORT + '   (' + name + ')');
    });
  });
});
