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
  const size = isActive ? 20 : event.highlight ? 13 : 9;
  const outer = size + 16;

  return L.divIcon({
    className: "",
    iconSize: [outer, outer],
    iconAnchor: [outer / 2, outer / 2],
    html: `
      <div style="width:${outer}px;height:${outer}px;display:flex;align-items:center;justify-content:center;cursor:pointer;" class="${isActive ? "marker-active" : "marker-enter"}">
        ${isActive ? `
          <div class="marker-ring" style="position:absolute;width:${outer}px;height:${outer}px;border-radius:50%;border:2px solid ${color};opacity:0.3;"></div>
          <div style="position:absolute;width:${outer - 4}px;height:${outer - 4}px;border-radius:50%;background:${color};opacity:0.08;"></div>
        ` : ""}
        <div style="
          width:${size}px;
          height:${size}px;
          border-radius:50%;
          background: radial-gradient(circle at 35% 35%, ${color}ee, ${color});
          border:2.5px solid white;
          box-shadow: 0 2px 8px ${isActive ? color + "40" : "rgba(0,0,0,0.1)"}, 0 0 0 ${isActive ? "3" : "0"}px ${color}15;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        "></div>
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
