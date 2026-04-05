import { Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import type { HistoricalEvent } from "../types";

interface Props {
  event: HistoricalEvent;
  isActive: boolean;
  onClick: () => void;
}

function createIcon(highlight: boolean, isActive: boolean) {
  const cls = `geo-marker${highlight ? " highlight" : ""}${isActive ? " active" : ""}`;
  const size = isActive ? 12 : highlight ? 12 : 10;
  return L.divIcon({
    className: "",
    html: `<div class="${cls}"></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

const TYPE_LABELS: Record<string, { label: string; color: string }> = {
  birth: { label: "Birth", color: "#22c55e" },
  death: { label: "Death", color: "#64748b" },
  battle: { label: "Battle", color: "#ef4444" },
  coronation: { label: "Coronation", color: "#f59e0b" },
  meeting: { label: "Meeting", color: "#6366f1" },
  journey: { label: "Journey", color: "#5E6AD2" },
  achievement: { label: "Achievement", color: "#22c55e" },
  construction: { label: "Construction", color: "#f97316" },
};

export default function GlowMarker({ event, isActive, onClick }: Props) {
  const map = useMap();

  const handleClick = () => {
    onClick();
    map.flyTo([event.lat, event.lng], Math.max(map.getZoom(), 7), {
      duration: 1.2,
      easeLinearity: 0.3,
    });
  };

  const t = TYPE_LABELS[event.type] || { label: event.type, color: "#5E6AD2" };

  return (
    <Marker
      position={[event.lat, event.lng]}
      icon={createIcon(event.highlight, isActive)}
      eventHandlers={{ click: handleClick }}
    >
      <Popup className="custom-popup" closeButton={false} offset={[0, -6]}>
        <div className="rounded-lg px-3.5 py-2.5 min-w-[180px]" style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: t.color }} />
            <span className="text-[10px] font-medium tracking-wider uppercase" style={{ color: t.color }}>
              {t.label}
            </span>
            <span className="text-[10px] text-white/25 font-mono ml-auto">{event.year}</span>
          </div>
          <p className="text-white/90 text-[13px] font-medium leading-snug">{event.title}</p>
          <p className="text-white/30 text-[11px] mt-0.5">{event.place}</p>
        </div>
      </Popup>
    </Marker>
  );
}
