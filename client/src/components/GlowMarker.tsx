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
  const size = isActive ? 14 : highlight ? 14 : 12;
  return L.divIcon({
    className: "",
    html: `<div class="${cls}"></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

const TYPE_LABELS: Record<string, { label: string; color: string }> = {
  birth: { label: "Birth", color: "#22c55e" },
  death: { label: "Death", color: "#6b7280" },
  battle: { label: "Battle", color: "#ef4444" },
  coronation: { label: "Coronation", color: "#f59e0b" },
  meeting: { label: "Meeting", color: "#3b82f6" },
  journey: { label: "Journey", color: "#8b5cf6" },
  achievement: { label: "Achievement", color: "#059669" },
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

  const t = TYPE_LABELS[event.type] || { label: event.type, color: "#059669" };

  return (
    <Marker
      position={[event.lat, event.lng]}
      icon={createIcon(event.highlight, isActive)}
      eventHandlers={{ click: handleClick }}
    >
      <Popup className="custom-popup" closeButton={false} offset={[0, -8]}>
        <div className="rounded-xl px-4 py-3 min-w-[200px] bg-white border border-emerald-100 shadow-xl shadow-emerald-100/20">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: t.color }} />
            <span className="text-[10px] font-semibold tracking-wider uppercase" style={{ color: t.color }}>
              {t.label}
            </span>
            <span className="text-[10px] text-emerald-400 font-mono ml-auto">{event.year}</span>
          </div>
          <p className="text-emerald-900 text-[13px] font-semibold leading-snug">{event.title}</p>
          <p className="text-emerald-500/50 text-[11px] mt-0.5">{event.place}</p>
        </div>
      </Popup>
    </Marker>
  );
}
