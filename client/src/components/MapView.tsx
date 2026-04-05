import { MapContainer, TileLayer, Polyline, useMap } from "react-leaflet";
import { useEffect } from "react";
import GlowMarker from "./GlowMarker";
import type { HistoricalEvent } from "../types";

interface Props {
  events: HistoricalEvent[];
  activeEventId: number | null;
  onEventClick: (event: HistoricalEvent) => void;
}

function FitBounds({ events }: { events: HistoricalEvent[] }) {
  const map = useMap();
  useEffect(() => {
    if (events.length > 0) {
      const bounds = events.map(
        (e) => [e.lat, e.lng] as [number, number]
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
  const sortedEvents = [...events].sort((a, b) => a.year - b.year);
  const polylinePositions = sortedEvents.map(
    (e) => [e.lat, e.lng] as [number, number]
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
        <FitBounds events={events} />

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
        {events.map((event) => (
          <GlowMarker
            key={event.id}
            event={event}
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
