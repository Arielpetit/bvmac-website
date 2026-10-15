"use client";

import { useEffect, useRef } from "react";
import type { Map as LeafletMap, LayerGroup } from "leaflet";
import "leaflet/dist/leaflet.css";
import { cn } from "@/lib/cn";

export type MapMarker = {
  id: string;
  lat: number;
  lon: number;
  label: string;
  // Bubble size grows with count; 0 shows a muted dot that cannot be selected.
  count?: number;
  active?: boolean;
};

// OpenStreetMap map with brand-coloured markers. Leaflet is loaded on the client only.
// Wheel zoom is off so the map never traps page scrolling; +/- buttons and pinch still work.
export function RealMap({
  markers,
  center,
  zoom = 5,
  fit = true,
  onSelect,
  label,
  className,
}: {
  markers: MapMarker[];
  center: [number, number];
  zoom?: number;
  fit?: boolean;
  onSelect?: (id: string) => void;
  label: string;
  className?: string;
}) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<LeafletMap | null>(null);
  const layer = useRef<LayerGroup | null>(null);
  const opts = useRef({ markers, zoom, fit, onSelect });

  useEffect(() => {
    opts.current = { markers, zoom, fit, onSelect };
    if (map.current && layer.current) import("leaflet").then((L) => draw(L, map.current, layer.current, opts.current));
  }, [markers, zoom, fit, onSelect]);

  useEffect(() => {
    let cancelled = false;
    import("leaflet").then((L) => {
      if (cancelled || !el.current || map.current) return;
      map.current = L.map(el.current, { center, zoom: opts.current.zoom, scrollWheelZoom: false });
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map.current);
      map.current.getPane("tilePane")!.style.filter = "sepia(0.18) saturate(0.85)";
      layer.current = L.layerGroup().addTo(map.current);
      draw(L, map.current, layer.current, opts.current);
    });
    return () => {
      cancelled = true;
      map.current?.remove();
      map.current = null;
    };
    // The map is created once; marker changes are handled by the effect above.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={el} role="region" aria-label={label} data-lenis-prevent className={cn("z-0 overflow-hidden bg-surface-alt", className)} />;
}

type DrawOptions = { markers: MapMarker[]; zoom: number; fit: boolean; onSelect?: (id: string) => void };

function draw(L: typeof import("leaflet"), map: LeafletMap | null, layer: LayerGroup | null, { markers, zoom, fit, onSelect }: DrawOptions) {
  if (!map || !layer) return;
  layer.clearLayers();
  const live = markers.filter((m) => m.count === undefined || m.count > 0);
  for (const m of markers) {
    const n = m.count;
    const size = n === undefined ? 22 : n ? Math.round(16 + Math.sqrt(n) * 7) : 12;
    const icon = L.divIcon({
      className: "",
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
      html: `<span style="${pinStyle(size, m.active, n === 0)}">${n ? `<b style="font-weight:600">${n}</b>` : ""}</span>`,
    });
    const marker = L.marker([m.lat, m.lon], { icon, keyboard: n !== 0, title: m.label, alt: m.label });
    marker.bindTooltip(m.label, { direction: "top", offset: [0, -size / 2] });
    if (n !== 0 && onSelect) marker.on("click keypress", () => onSelect(m.id));
    marker.addTo(layer);
  }
  if (fit && live.length > 1) map.fitBounds(L.latLngBounds(live.map((m) => [m.lat, m.lon])), { padding: [40, 40], maxZoom: 7 });
  else if (fit && live.length === 1) map.setView([live[0].lat, live[0].lon], Math.max(zoom, 7));
}

// Inline so markers look right regardless of global CSS: gold disc, dark when selected.
function pinStyle(size: number, active?: boolean, empty?: boolean) {
  const bg = active ? "#1c130b" : empty ? "#9b9285" : "#c9a23a";
  const fg = active ? "#ead18a" : "#1c130b";
  return `display:flex;align-items:center;justify-content:center;width:${size}px;height:${size}px;border-radius:9999px;background:${bg};color:${fg};border:2px solid #fff;box-shadow:0 2px 8px rgb(28 19 11 / .35);font-size:11px;transform:scale(${active ? 1.15 : 1});transition:transform .2s`;
}
