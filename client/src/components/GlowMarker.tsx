import { Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import type { HistoricalEvent } from "../types";

interface Props {
  event: HistoricalEvent;
  isActive: boolean;
  onClick: () => void;
}

function createGlowIcon(highlight: boolean, isActive: boolean) {
  const className = `glow-marker${highlight ? " highlight" : ""}${isActive ? " active" : ""}`;
  const size = highlight ? 18 : 14;
  return L.divIcon({
    className: "",
    html: `
      <div class="${className}" style="position:relative">
        <div class="marker-ring"></div>
        ${highlight ? '<div class="marker-ring" style="animation-delay:1s"></div>' : ""}
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

export default function GlowMarker({ event, isActive, onClick }: Props) {
  const map = useMap();

  const handleClick = () => {
    onClick();
    map.flyTo([event.lat, event.lng], Math.max(map.getZoom(), 7), {
      duration: 1.5,
      easeLinearity: 0.25,
    });
  };

  const typeEmoji: Record<string, string> = {
    birth: "👶",
    death: "⚰️",
    battle: "⚔️",
    coronation: "👑",
    meeting: "🤝",
    journey: "🧭",
    achievement: "🏆",
    construction: "🏗️",
  };

  return (
    <Marker
      position={[event.lat, event.lng]}
      icon={createGlowIcon(event.highlight, isActive)}
      eventHandlers={{ click: handleClick }}
    >
      <Popup
        className="custom-popup"
        closeButton={false}
        offset={[0, -8]}
      >
        <div
          className="glass rounded-xl px-4 py-3 min-w-[200px]"
          style={{
            background: "rgba(13, 13, 20, 0.9)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base">{typeEmoji[event.type] || "📍"}</span>
            <span
              className="text-xs font-medium tracking-wider uppercase"
              style={{ color: event.highlight ? "#ffb800" : "#00d4ff" }}
            >
              {event.year}
            </span>
          </div>
          <div className="text-white text-sm font-medium">{event.title}</div>
          <div className="text-white/50 text-xs mt-1">{event.place}</div>
        </div>
      </Popup>
    </Marker>
  );
}
