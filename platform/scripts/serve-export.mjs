// Serves platform/out the way GitHub Pages does: correct MIME types,
// directory requests resolved to index.html. Used to test the production
// CSP, which the Next dev server cannot exercise.
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, extname, normalize, resolve } from "node:path";

const ROOT = resolve(process.argv[2]);
const PORT = Number(process.argv[3] || 4000);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".wasm": "application/wasm",
  ".woff2": "font/woff2",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".zip": "application/zip",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
};

createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");
  let path = join(ROOT, normalize(decodeURIComponent(url.pathname)));
  if (!path.startsWith(ROOT)) return res.writeHead(403).end();
  try {
    const info = await stat(path).catch(() => null);
    if (!info || info.isDirectory()) path = join(path, "index.html");
    const body = await readFile(path);
    res.writeHead(200, {
      "content-type": TYPES[extname(path)] || "application/octet-stream",
      "cache-control": "no-store",
    });
    res.end(body);
  } catch {
    const notFound = await readFile(join(ROOT, "404.html")).catch(() => null);
    res.writeHead(404, { "content-type": "text/html; charset=utf-8" });
    res.end(notFound ?? "404");
  }
}).listen(PORT, () => console.log(`export served on http://localhost:${PORT}`));
