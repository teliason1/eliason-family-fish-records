"use client";

import { useEffect, useRef } from "react";
import type { Concept, FishRecord } from "@/lib/types";
import { useRouter } from "next/navigation";

export default function FishMap({ records, concept }: { records: FishRecord[]; concept: Concept }) {
  const node = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const router = useRouter();

  useEffect(() => {
    let active = true;
    import("leaflet").then((L) => {
      if (!active || !node.current) return;
      if (mapRef.current) mapRef.current.remove();
      const points = records.filter((r) => r.lat !== null && r.lng !== null);
      const map = L.map(node.current, { zoomControl: true, scrollWheelZoom: true, minZoom: 2 });
      mapRef.current = map;
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors', maxZoom: 18 }).addTo(map);
      const markers: import("leaflet").Marker[] = [];
      points.forEach((record) => {
        const color = record.status === "current" ? "#e97532" : record.status === "micro" ? "#69a36f" : "#315e75";
        const estimated = record.coordinateAccuracy === "estimated";
        const icon = L.divIcon({ className: "fish-marker-wrap", html: `<span class="fish-marker${estimated ? " estimated-marker" : ""}" style="--marker:${color}"></span>`, iconSize: [22, 22], iconAnchor: [11, 11] });
        const preview = record.photo
          ? `<img src="${escapeHtml(record.photo)}" alt="" loading="lazy" />`
          : `<span class="map-preview-placeholder" aria-hidden="true">No photo</span>`;
        const tooltip = `<span class="map-preview">${preview}<span class="map-preview-copy"><strong>${escapeHtml(record.species)}</strong><span>${escapeHtml(record.angler)}</span>${estimated ? "<em>Approximate location</em>" : ""}</span></span>`;
        const marker = L.marker([record.lat!, record.lng!], { icon }).addTo(map).bindTooltip(tooltip, { direction: "top", className: "fish-map-tooltip", opacity: 1, offset: [0, -8] });
        marker.on("click", () => router.push(`/concepts/${concept}/records/${record.id}`));
        markers.push(marker);
      });
      if (markers.length) {
        const bounds = L.featureGroup(markers).getBounds();
        map.fitBounds(bounds, { padding: [35, 35], maxZoom: 8 });
      } else map.setView([39, -96], 4);
    });
    return () => { active = false; if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; } };
  }, [records, concept, router]);

  return <div className="map-canvas" ref={node} aria-label={`Map showing ${records.filter((r) => r.lat !== null).length} catches`} />;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]!);
}
