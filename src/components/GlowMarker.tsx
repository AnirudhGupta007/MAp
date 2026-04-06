import { useEffect, useRef } from "react";
import { Marker, Popup, useMap } from "react-leaflet";
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
  const size = isActive ? 20 : event.highlight ? 14 : 10;
  const ringSize = size + 10;

  return L.divIcon({
    className: "",
    iconSize: [ringSize, ringSize],
    iconAnchor: [ringSize / 2, ringSize / 2],
    popupAnchor: [0, -ringSize / 2],
    html: `
      <div style="width:${ringSize}px;height:${ringSize}px;display:flex;align-items:center;justify-content:center;" class="${isActive ? "marker-active" : "marker-enter"}">
        ${isActive ? `<div style="position:absolute;width:${ringSize}px;height:${ringSize}px;border-radius:50%;background:${color};opacity:0.15;"></div>` : ""}
        <div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:2.5px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.15);transition:all 0.3s ease;"></div>
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
    >
      <Popup>
        <div className="p-3 min-w-[180px]">
          <div className="font-semibold text-stone-900 text-sm">{event.title}</div>
          <div className="text-xs text-teal-600 font-mono mt-0.5">{event.year} &middot; {event.place}</div>
          <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">{event.description}</p>
        </div>
      </Popup>
    </Marker>
  );
}
