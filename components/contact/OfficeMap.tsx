"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef, useState } from "react";
import type { Map as MapLibreMap, StyleSpecification } from "maplibre-gl";
import { Icon } from "@/components/ui/Icon";

/** Free vector tiles (OpenStreetMap data), no API key needed. */
const STYLE_URL = "https://tiles.openfreemap.org/styles/dark";

const C = {
  bg: "#111215",
  land: "#16171b",
  park: "#171d1a",
  water: "#0c0d10",
  building: "#1e2026",
  buildingTop: "#25282f",
  roadMinor: "#24262d",
  roadMajor: "#33363f",
  roadMotorway: "#4a3328",
  rail: "#2a2c33",
  label: "#8a8f9a",
  labelMajor: "#b9bdc6",
  halo: "#111215",
};

export interface OfficeMapLabels {
  zoomIn: string;
  zoomOut: string;
  recenter: string;
  unavailable: string;
  touch: string;
  wheel: string;
  mac: string;
}

/**
 * Dark, brand-tinted vector map of the office.
 * Loads only when near the viewport, flies in from a city view to the office
 * with a slight 3D tilt, and shows a pulsing Codec pixel pin. Uses cooperative
 * gestures so it never hijacks page scrolling. If tiles can't load, a styled
 * fallback stays visible instead of a blank box.
 */
export function OfficeMap({ lat, lng, title, subtitle, labels }: { lat: number; lng: number; title: string; subtitle: string; labels: OfficeMapLabels }) {
  const wrap = useRef<HTMLDivElement>(null);
  const holder = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const [state, setState] = useState<"idle" | "loading" | "ready" | "error">("idle");

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    let cancelled = false;

    const start = async () => {
      setState("loading");
      try {
        const maplibre = await import("maplibre-gl");
        // Worker is served from /public (copied on install by scripts/copy-map-worker.mjs).
        maplibre.setWorkerUrl("/vendor/maplibre-gl-worker.mjs");
        if (cancelled || !holder.current) return;

        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const target: [number, number] = [lng, lat];

        const map = new maplibre.Map({
          container: holder.current,
          style: STYLE_URL,
          center: reduce ? target : [lng - 0.035, lat + 0.012],
          zoom: reduce ? 16 : 12.2,
          pitch: reduce ? 40 : 0,
          bearing: reduce ? -18 : 0,
          attributionControl: { compact: true },
          cooperativeGestures: true,
          locale: {
            "CooperativeGesturesHandler.WindowsHelpText": labels.wheel,
            "CooperativeGesturesHandler.MacHelpText": labels.mac,
            "CooperativeGesturesHandler.MobileHelpText": labels.touch,
          },
          maxPitch: 60,
        });
        mapRef.current = map;

        const fail = window.setTimeout(() => !map.loaded() && setState((s) => (s === "ready" ? s : "error")), 12000);

        map.on("style.load", () => recolor(map));
        map.on("load", () => {
          window.clearTimeout(fail);
          addBuildings(map);
          setState("ready");

          // The Codec pin: pixel + pulse rings + label.
          const pin = document.createElement("div");
          pin.className = "codec-pin";
          pin.innerHTML = `
            <span class="codec-pin__ring"></span>
            <span class="codec-pin__ring codec-pin__ring--2"></span>
            <span class="codec-pin__dot"></span>
            <span class="codec-pin__label"><strong>${escapeHtml(title)}</strong><span>${escapeHtml(subtitle)}</span></span>`;
          new maplibre.Marker({ element: pin, anchor: "center" }).setLngLat(target).addTo(map);

          if (!reduce) {
            map.flyTo({ center: target, zoom: 16.4, pitch: 52, bearing: -22, duration: 3200, curve: 1.5, essential: true });
          }
        });
        // Individual tile errors are harmless; if the style itself never loads, the timeout above shows the fallback message.
      } catch {
        if (!cancelled) setState("error");
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          io.disconnect();
          start();
        }
      },
      { rootMargin: "300px" },
    );
    io.observe(el);

    return () => {
      cancelled = true;
      io.disconnect();
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [lat, lng, title, subtitle, labels]);

  const zoom = (d: number) => mapRef.current?.easeTo({ zoom: mapRef.current.getZoom() + d, duration: 400 });
  const recenter = () => mapRef.current?.flyTo({ center: [lng, lat], zoom: 16.4, pitch: 52, bearing: -22, duration: 1400 });

  return (
    <div ref={wrap} className="relative h-full w-full overflow-hidden bg-night">
      {/* Fallback / loading layer: always rendered underneath */}
      <div aria-hidden={state === "ready"} className="absolute inset-0">
        <div className="pixel-grid absolute inset-0 opacity-70" />
        <svg className="absolute inset-0 h-full w-full opacity-40" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <g fill="none" stroke="#33363f" strokeWidth="10" strokeLinecap="round">
            <path d="M-20 330 C 180 300 300 360 520 300 S 760 240 840 260" />
            <path d="M260 -20 C 300 120 360 220 400 250 S 470 420 450 520" />
          </g>
          <g fill="none" stroke="#24262d" strokeWidth="5">
            <path d="M-20 140 L 840 190" />
            <path d="M120 -20 L 180 520" />
            <path d="M620 -20 L 560 520" />
            <path d="M-20 450 L 840 410" />
          </g>
        </svg>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <span className="codec-pin codec-pin--static">
            <span className="codec-pin__ring" />
            <span className="codec-pin__ring codec-pin__ring--2" />
            <span className="codec-pin__dot" />
          </span>
        </div>
        {state === "error" && (
          <p className="absolute inset-x-0 bottom-24 text-center text-sm text-muted">{labels.unavailable}</p>
        )}
      </div>

      {/* The live map fades in over the fallback */}
      <div ref={holder} className={`absolute inset-0 transition-opacity duration-1000 ${state === "ready" ? "opacity-100" : "opacity-0"}`} />

      {/* Edge vignette so the map melts into the panel */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 shadow-[inset_0_0_120px_40px_rgb(17_18_21/0.85)]" />

      {/* Controls */}
      {state === "ready" && (
        <div className="absolute right-4 top-4 flex flex-col overflow-hidden rounded-[12px] border border-line-strong bg-night-2/90 backdrop-blur">
          <MapButton label={labels.zoomIn} onClick={() => zoom(1)} icon="plus" />
          <span className="h-px bg-line" />
          <MapButton label={labels.zoomOut} onClick={() => zoom(-1)} icon="minus" />
          <span className="h-px bg-line" />
          <MapButton label={labels.recenter} onClick={recenter} icon="pin" />
        </div>
      )}

      <style>{PIN_CSS}</style>
    </div>
  );
}

function MapButton({ label, onClick, icon }: { label: string; onClick: () => void; icon: "plus" | "minus" | "pin" }) {
  return (
    <button type="button" onClick={onClick} aria-label={label} title={label} className="grid size-10 place-items-center text-fg/80 transition-colors hover:bg-white/[0.06] hover:text-ember">
      {icon === "minus" ? <span className="block h-[1.6px] w-3.5 rounded bg-current" /> : <Icon name={icon} size={17} />}
    </button>
  );
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

/** Repaint whatever dark style loads into Codec's graphite palette. */
function recolor(map: MapLibreMap) {
  const style = map.getStyle() as StyleSpecification;
  for (const layer of style.layers) {
    const id = layer.id.toLowerCase();
    const set = (prop: string, value: unknown) => {
      try {
        map.setPaintProperty(layer.id, prop as never, value as never);
      } catch {
        /* property not valid for this layer */
      }
    };
    if (layer.type === "background") set("background-color", C.bg);
    else if (layer.type === "fill") {
      if (id.includes("water")) set("fill-color", C.water);
      else if (id.includes("park") || id.includes("wood") || id.includes("grass") || id.includes("landcover")) set("fill-color", C.park);
      else if (id.includes("building")) {
        set("fill-color", C.building);
        set("fill-outline-color", C.buildingTop);
      } else set("fill-color", C.land);
    } else if (layer.type === "line") {
      if (id.includes("water") || id.includes("river")) set("line-color", C.water);
      else if (id.includes("rail") || id.includes("transit")) set("line-color", C.rail);
      else if (id.includes("motorway") || id.includes("trunk")) set("line-color", C.roadMotorway);
      else if (id.includes("primary") || id.includes("secondary") || id.includes("major")) set("line-color", C.roadMajor);
      else if (id.includes("boundary") || id.includes("admin")) set("line-opacity", 0.25);
      else set("line-color", C.roadMinor);
    } else if (layer.type === "symbol") {
      if (id.includes("poi")) {
        try {
          map.setLayoutProperty(layer.id, "visibility", "none");
        } catch {
          /* ignore */
        }
      } else {
        const major = id.includes("place") || id.includes("city") || id.includes("road_major") || id.includes("highway-name-major");
        set("text-color", major ? C.labelMajor : C.label);
        set("text-halo-color", C.halo);
        set("text-halo-width", 1.2);
      }
    }
  }
}

/** Soft 3D buildings near the office (if the tile source provides heights). */
function addBuildings(map: MapLibreMap) {
  const sourceId = Object.keys(map.getStyle().sources ?? {}).find((k) => k.includes("openmaptiles")) ?? "openmaptiles";
  if (!map.getSource(sourceId) || map.getLayer("codec-3d-buildings")) return;
  try {
    const firstSymbol = map.getStyle().layers.find((l) => l.type === "symbol")?.id;
    map.addLayer(
      {
        id: "codec-3d-buildings",
        type: "fill-extrusion",
        source: sourceId,
        "source-layer": "building",
        minzoom: 14.5,
        paint: {
          "fill-extrusion-color": ["interpolate", ["linear"], ["coalesce", ["get", "render_height"], 8], 0, "#1c1e23", 40, "#2a2d35"],
          "fill-extrusion-height": ["coalesce", ["get", "render_height"], 8],
          "fill-extrusion-base": ["coalesce", ["get", "render_min_height"], 0],
          "fill-extrusion-opacity": ["interpolate", ["linear"], ["zoom"], 14.5, 0, 15.5, 0.85],
        },
      },
      firstSymbol,
    );
  } catch {
    /* no building data — the flat map still looks right */
  }
}

const PIN_CSS = `
.codec-pin { position: relative; width: 22px; height: 22px; display: grid; place-items: center; }
.codec-pin__dot { position: relative; z-index: 2; width: 16px; height: 16px; border-radius: 3px; background: #ff5a1f;
  box-shadow: 0 0 0 3px #111215, 0 0 0 4px rgb(255 90 31 / .6), 0 8px 24px -4px rgb(255 90 31 / .8); }
.codec-pin__ring { position: absolute; inset: -6px; border-radius: 8px; border: 1.5px solid rgb(255 90 31 / .7);
  animation: codec-pin-pulse 2.6s cubic-bezier(.16,1,.3,1) infinite; }
.codec-pin__ring--2 { animation-delay: 1.3s; }
.codec-pin__label { position: absolute; left: 30px; top: 50%; transform: translateY(-50%); white-space: nowrap;
  display: flex; flex-direction: column; gap: 1px; padding: 8px 12px; border-radius: 10px;
  background: rgb(22 23 27 / .92); border: 1px solid rgb(211 214 220 / .18); backdrop-filter: blur(8px);
  box-shadow: 0 16px 34px -14px rgb(0 0 0 / .9); font: 500 13px/1.25 var(--font-sans); color: #f1f2f4;
  animation: codec-pin-label .7s ease 2.9s both; }
.codec-pin__label strong { font-weight: 600; }
.codec-pin__label span { color: #a3a7b0; font-size: 12px; }
.codec-pin--static .codec-pin__label { display: none; }
@keyframes codec-pin-pulse { 0% { transform: scale(.6); opacity: 1; } 100% { transform: scale(2.6); opacity: 0; } }
@keyframes codec-pin-label { from { opacity: 0; } to { opacity: 1; } }
@media (max-width: 640px) {
  .codec-pin__label { left: 50%; top: auto; bottom: 30px; transform: translateX(-50%); align-items: center; padding: 7px 11px; }
}
@media (prefers-reduced-motion: reduce) { .codec-pin__ring { animation: none; opacity: .5; } .codec-pin__label { animation: none; } }
.maplibregl-ctrl-attrib { background: rgb(17 18 21 / .75) !important; color: #757a85 !important; font-size: 10px; }
.maplibregl-ctrl-attrib a { color: #a3a7b0 !important; }
.maplibregl-ctrl-attrib-button { filter: invert(1) opacity(.6); }
.maplibregl-cooperative-gesture-screen { background: rgb(17 18 21 / .7) !important; color: #f1f2f4 !important; font: 500 15px var(--font-sans) !important; }
`;
