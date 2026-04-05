import { MapContainer, TileLayer, Polyline, useMap } from "react-leaflet";
import { useEffect, useMemo } from "react";
import GlowMarker from "./GlowMarker";
import type { HistoricalEvent } from "../types";

interface Props {
  events: HistoricalEvent[];
  activeEventId: number | null;
  onEventClick: (event: HistoricalEvent) => void;
}

// Spread out markers that share the same lat/lng so all are visible
function spreadOverlappingEvents(events: HistoricalEvent[]): (HistoricalEvent & { displayLat: number; displayLng: number })[] {
  const groups: Record<string, HistoricalEvent[]> = {};

  // Group events by their coordinates
  for (const event of events) {
    const key = `${event.lat.toFixed(4)},${event.lng.toFixed(4)}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(event);
  }

  const result: (HistoricalEvent & { displayLat: number; displayLng: number })[] = [];

  for (const key in groups) {
    const group = groups[key];
    if (group.length === 1) {
      result.push({ ...group[0], displayLat: group[0].lat, displayLng: group[0].lng });
    } else {
      // Spread markers in a circle around the original point
      const radius = 0.15 + group.length * 0.03; // degrees offset, scales with count
      group.forEach((event, i) => {
        const angle = (2 * Math.PI * i) / group.length - Math.PI / 2;
        result.push({
          ...event,
          displayLat: event.lat + radius * Math.sin(angle),
          displayLng: event.lng + radius * Math.cos(angle),
        });
      });
    }
  }

  return result;
}

function FitBounds({ events }: { events: (HistoricalEvent & { displayLat: number; displayLng: number })[] }) {
  const map = useMap();
  useEffect(() => {
    if (events.length > 0) {
      const bounds = events.map(
        (e) => [e.displayLat, e.displayLng] as [number, number]
      );
      map.flyToBounds(bounds, {
        padding: [80, 80],
        duration: 2,
        easeLinearity: 0.25,
        maxZoom: 8,
      });
    }
  }, [events, map]);
  return null;
}

export default function MapView({ events, activeEventId, onEventClick }: Props) {
  const spreadEvents = useMemo(() => spreadOverlappingEvents(events), [events]);
  const sortedEvents = [...spreadEvents].sort((a, b) => a.year - b.year);
  const polylinePositions = sortedEvents.map(
    (e) => [e.displayLat, e.displayLng] as [number, number]
  );

  return (
    <div className="absolute inset-0">
      <MapContainer
        center={[22, 78]}
        zoom={5}
        zoomControl={true}
        attributionControl={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          maxZoom={19}
        />
        <FitBounds events={spreadEvents} />

        {/* Connection polyline */}
        {polylinePositions.length > 1 && (
          <Polyline
            positions={polylinePositions}
            pathOptions={{
              color: "#00d4ff",
              weight: 1.5,
              opacity: 0.3,
              dashArray: "8 12",
              lineCap: "round",
            }}
          />
        )}

        {/* Event markers */}
        {spreadEvents.map((event) => (
          <GlowMarker
            key={event.id}
            event={{ ...event, lat: event.displayLat, lng: event.displayLng }}
            isActive={event.id === activeEventId}
            onClick={() => onEventClick(event)}
          />
        ))}
      </MapContainer>

      {/* Edge gradients for cinematic feel */}
      <div className="map-gradient-top absolute top-0 left-0 right-0 h-24 pointer-events-none z-[400]" />
      <div className="map-gradient-bottom absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-[400]" />
      <div className="map-gradient-left absolute top-0 left-0 bottom-0 w-16 pointer-events-none z-[400]" />
    </div>
  );
}
