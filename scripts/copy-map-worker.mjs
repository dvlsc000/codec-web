// Copies MapLibre's web worker into /public so the map can load it from the site
// itself (bundlers can't resolve the worker's relative URL). Runs on `npm install`.
import { copyFileSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);
try {
  const pkg = require.resolve("maplibre-gl/package.json");
  const src = path.join(path.dirname(pkg), "dist", "maplibre-gl-worker.mjs");
  mkdirSync("public/vendor", { recursive: true });
  copyFileSync(src, "public/vendor/maplibre-gl-worker.mjs");
  console.log("[postinstall] map worker copied to public/vendor");
} catch (e) {
  console.warn("[postinstall] could not copy map worker:", e.message);
}
