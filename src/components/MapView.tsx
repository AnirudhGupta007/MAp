import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import type { Map as LeafletMap } from "leaflet";
import type { HistoricalEvent } from "../types";
import { MAP_CENTER, MAP_ZOOM, TILE_URL, TILE_ATTRIBUTION } from "../lib/constants";
import GlowMarker from "./GlowMarker";

interface Props {
  events: HistoricalEvent[];
  activeEvent: HistoricalEvent | null;
  onEventClick: (event: HistoricalEvent) => void;
}

function spreadOverlapping(events: HistoricalEvent[]): HistoricalEvent[] {
  const spread: HistoricalEvent[] = [];
  const seen = new Map<string, number>();

  for (const evt of events) {
    const key = `${evt.lat.toFixed(2)},${evt.lng.toFixed(2)}`;
    const count = seen.get(key) || 0;
    if (count > 0) {
      const angle = (count * 2 * Math.PI) / 6;
      const offset = 0.15;
      spread.push({
        ...evt,
        lat: evt.lat + offset * Math.cos(angle),
        lng: evt.lng + offset * Math.sin(angle),
      });
    } else {
      spread.push(evt);
    }
    seen.set(key, count + 1);
  }
  return spread;
}

export default function MapView({ events, activeEvent, onEventClick }: Props) {
  const mapRef = useRef<LeafletMap | null>(null);
  const spreadEvents = spreadOverlapping(events);
  const polylinePoints = spreadEvents.map((e) => [e.lat, e.lng] as [number, number]);

  useEffect(() => {
    if (mapRef.current && spreadEvents.length > 0) {
      const bounds = spreadEvents.map((e) => [e.lat, e.lng] as [number, number]);
      mapRef.current.flyToBounds(bounds, { padding: [60, 60], duration: 1.5 });
    }
  }, [events]);

  return (
    <MapContainer
      center={MAP_CENTER}
      zoom={MAP_ZOOM}
      className="h-full w-full"
      zoomControl={true}
      ref={mapRef}
    >
      <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} />

      {polylinePoints.length > 1 && (
        <Polyline
          positions={polylinePoints}
          pathOptions={{
            color: "#a8a29e",
            weight: 2,
            dashArray: "6 8",
            opacity: 0.6,
          }}
        />
      )}

      {spreadEvents.map((event, i) => (
        <GlowMarker
          key={event.id}
          event={event}
          isActive={activeEvent?.id === event.id}
          index={i}
          onClick={() => onEventClick(event)}
        />
      ))}
    </MapContainer>
  );
}
