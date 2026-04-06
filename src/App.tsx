import { useState, useRef } from "react";
import { AnimatePresence } from "motion/react";
import type { HistoricalEvent } from "./types";
import type { Map as LeafletMap } from "leaflet";
import { useSearch } from "./hooks/useSearch";
import LandingHero from "./components/LandingHero";
import MapView from "./components/MapView";
import SearchBar from "./components/SearchBar";
import Timeline from "./components/Timeline";
import EventPanel from "./components/EventPanel";

export default function App() {
  const { person, isLoading, error, search } = useSearch();
  const [activeEvent, setActiveEvent] = useState<HistoricalEvent | null>(null);
  const [showPanel, setShowPanel] = useState(false);
  const [panelPos, setPanelPos] = useState<{ x: number; y: number } | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);

  const handleSearch = async (name: string) => {
    setActiveEvent(null);
    setShowPanel(false);
    setPanelPos(null);
    await search(name);
  };

  const updatePanelPosition = (event: HistoricalEvent) => {
    if (mapRef.current) {
      const point = mapRef.current.latLngToContainerPoint([event.lat, event.lng]);
      setPanelPos({ x: point.x, y: point.y });
    }
  };

  const handleEventSelect = (event: HistoricalEvent) => {
    setActiveEvent(event);
    setShowPanel(true);
    // Small delay to let flyTo start, then position
    setTimeout(() => updatePanelPosition(event), 100);
    // Update again after flyTo completes
    setTimeout(() => updatePanelPosition(event), 1400);
  };

  const handleClosePanel = () => {
    setShowPanel(false);
    setPanelPos(null);
  };

  return (
    <div className="h-full w-full relative">
      <AnimatePresence mode="wait">
        {!person && !isLoading ? (
          <LandingHero key="landing" onSearch={handleSearch} isLoading={isLoading} error={error} />
        ) : (
          <div key="app" className="h-full w-full relative">
            <MapView
              events={person?.events || []}
              activeEvent={activeEvent}
              onEventClick={handleEventSelect}
              mapRef={mapRef}
            />

            <SearchBar
              onSearch={handleSearch}
              isLoading={isLoading}
            />

            {person && (
              <Timeline
                person={person}
                events={person.events}
                activeEvent={activeEvent}
                onEventSelect={handleEventSelect}
              />
            )}

            <AnimatePresence>
              {showPanel && activeEvent && person && panelPos && (
                <EventPanel
                  person={person}
                  event={activeEvent}
                  position={panelPos}
                  onClose={handleClosePanel}
                />
              )}
            </AnimatePresence>

            {error && (
              <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-red-50 text-red-600 px-4 py-2 rounded-xl text-sm border border-red-200 shadow-sm z-[900]">
                {error}
              </div>
            )}

            {isLoading && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-[1000]">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-10 h-10 border-3 border-stone-200 border-t-teal-600 rounded-full animate-spin" />
                  <span className="text-stone-500 text-sm font-medium">Exploring history...</span>
                </div>
              </div>
            )}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
