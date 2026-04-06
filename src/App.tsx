import { useState, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
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
    setTimeout(() => updatePanelPosition(event), 100);
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
          <motion.div
            key="app"
            className="h-full w-full relative"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
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

            {/* Error toast */}
            <AnimatePresence>
              {error && (
                <motion.div
                  className="absolute top-20 left-1/2 -translate-x-1/2 z-[900]"
                  initial={{ y: -10, opacity: 0, scale: 0.95 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: -10, opacity: 0, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <div className="glass-strong px-5 py-2.5 rounded-xl text-sm text-red-600 border border-red-100/60 shadow-lg font-medium">
                    {error}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Loading overlay */}
            <AnimatePresence>
              {isLoading && (
                <motion.div
                  className="absolute inset-0 bg-white/50 backdrop-blur-md flex items-center justify-center z-[1000]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    className="flex flex-col items-center gap-4"
                    initial={{ scale: 0.9, y: 10 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  >
                    <div className="relative">
                      <div className="w-10 h-10 border-[2.5px] border-stone-100 border-t-teal-500 rounded-full animate-spin" />
                      <div className="absolute inset-0 w-10 h-10 border-[2.5px] border-transparent border-b-teal-300/40 rounded-full animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
                    </div>
                    <span className="text-stone-400 text-sm font-medium">Exploring history...</span>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
