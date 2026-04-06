import { useEffect, useRef } from "react";
import { Marker, useMap } from "react-leaflet";
import L from "leaflet";
import type { HistoricalEvent } from "../types";
import { EVENT_COLORS } from "../lib/constants";

interface Props {
  event: HistoricalEvent;
  isActive: boolean;
  index: number;
  onClick: () => void;
}

function createMarkerIcon(event: HistoricalEvent, isActive: boolean): L.DivIcon {
  const color = EVENT_COLORS[event.type] || "#78716c";
  const size = isActive ? 18 : event.highlight ? 12 : 9;
  const outer = size + 12;

  return L.divIcon({
    className: "",
    iconSize: [outer, outer],
    iconAnchor: [outer / 2, outer / 2],
    html: `
      <div style="width:${outer}px;height:${outer}px;display:flex;align-items:center;justify-content:center;cursor:pointer;" class="${isActive ? "marker-active" : "marker-enter"}">
        ${isActive ? `<div style="position:absolute;width:${outer}px;height:${outer}px;border-radius:50%;background:${color};opacity:0.12;"></div>` : ""}
        <div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 1px 6px rgba(0,0,0,0.12);transition:all 0.3s ease;"></div>
      </div>
    `,
  });
}

export default function GlowMarker({ event, isActive, onClick }: Props) {
  const map = useMap();
  const markerRef = useRef<L.Marker>(null);

  useEffect(() => {
    if (isActive && markerRef.current) {
      map.flyTo([event.lat, event.lng], Math.max(map.getZoom(), 7), {
        duration: 1.2,
      });
    }
  }, [isActive, event.lat, event.lng, map]);

  return (
    <Marker
      ref={markerRef}
      position={[event.lat, event.lng]}
      icon={createMarkerIcon(event, isActive)}
      eventHandlers={{ click: onClick }}
    />
  );
}
