/*
 * make-icons.js - writes the Word and Number Land icons with no dependencies.
 * Usage: node make-icons.js
 * Writes icons/icon-192.png, icons/icon-512.png, icons/apple-touch-icon.png (180).
 * An open book on purple next to a red apple on orange.
 */
'use strict';

var fs = require('fs');
var path = require('path');
var zlib = require('zlib');

var CRC_TABLE = (function () {
  var t = new Uint32Array(256);
  for (var n = 0; n < 256; n++) {
    var c = n;
    for (var k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(buf) {
  var c = 0xFFFFFFFF;
  for (var i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
  return (c ^ 0xFFFFFFFF) >>> 0;
}

function chunk(type, data) {
  var len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  var td = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  var crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(td), 0);
  return Buffer.concat([len, td, crc]);
}

function encodePNG(w, h, rgba) {
  var stride = w * 4 + 1;
  var raw = Buffer.alloc(stride * h);
  for (var y = 0; y < h; y++) {
    raw[y * stride] = 0;
    rgba.copy(raw, y * stride + 1, y * w * 4, (y + 1) * w * 4);
  }
  var ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0))
  ]);
}

function inRect(px, py, x0, y0, x1, y1) { return px >= x0 && px <= x1 && py >= y0 && py <= y1; }
function inCircle(px, py, cx, cy, r) { var dx = px - cx, dy = py - cy; return dx * dx + dy * dy <= r * r; }

function pixel(nx, ny) {
  var left = nx + (ny - 0.5) * 0.25 < 0.5;
  var r = left ? 123 : 255, g = left ? 97 : 159, b = left ? 255 : 28;
  // open book (left half): two white pages with a spine
  if (inRect(nx, ny, 0.08, 0.30, 0.25, 0.66) || inRect(nx, ny, 0.27, 0.30, 0.44, 0.66)) { r = 255; g = 255; b = 255; }
  if (inRect(nx, ny, 0.25, 0.30, 0.27, 0.68)) { r = 60; g = 40; b = 160; }
  for (var k = 0; k < 4; k++) {
    var y = 0.38 + k * 0.07;
    if (inRect(nx, ny, 0.11, y, 0.22, y + 0.015) || inRect(nx, ny, 0.30, y, 0.41, y + 0.015)) { r = 170; g = 160; b = 230; }
  }
  // apple (right half)
  if (inCircle(nx, ny, 0.66, 0.56, 0.13) || inCircle(nx, ny, 0.80, 0.56, 0.13) || inCircle(nx, ny, 0.73, 0.64, 0.14)) { r = 230; g = 57; b = 70; }
  if (inCircle(nx, ny, 0.68, 0.51, 0.035)) { r = 255; g = 140; b = 150; }
  if (inRect(nx, ny, 0.72, 0.34, 0.745, 0.45)) { r = 110; g = 70; b = 40; }
  if (inCircle(nx, ny, 0.80, 0.37, 0.05)) { r = 70; g = 190; b = 90; }
  return [r, g, b];
}

function makeIcon(size) {
  var buf = Buffer.alloc(size * size * 4);
  for (var y = 0; y < size; y++) {
    for (var x = 0; x < size; x++) {
      var i = (y * size + x) * 4;
      var p = pixel((x + 0.5) / size, (y + 0.5) / size);
      buf[i] = p[0]; buf[i + 1] = p[1]; buf[i + 2] = p[2]; buf[i + 3] = 255;
    }
  }
  return encodePNG(size, size, buf);
}

var dir = path.join(__dirname, 'icons');
if (!fs.existsSync(dir)) fs.mkdirSync(dir);
fs.writeFileSync(path.join(dir, 'icon-192.png'), makeIcon(192));
fs.writeFileSync(path.join(dir, 'icon-512.png'), makeIcon(512));
fs.writeFileSync(path.join(dir, 'apple-touch-icon.png'), makeIcon(180));
console.log('wrote icons/icon-192.png, icons/icon-512.png, icons/apple-touch-icon.png');
