import { useState } from "react";
import { AnimatePresence } from "motion/react";
import type { HistoricalEvent } from "./types";
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

  const handleSearch = async (name: string) => {
    setActiveEvent(null);
    setShowPanel(false);
    await search(name);
  };

  const handleEventSelect = (event: HistoricalEvent) => {
    setActiveEvent(event);
    setShowPanel(true);
  };

  const handleClosePanel = () => {
    setShowPanel(false);
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
              {showPanel && activeEvent && person && (
                <EventPanel
                  person={person}
                  event={activeEvent}
                  onClose={handleClosePanel}
                />
              )}
            </AnimatePresence>

            {error && (
              <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-red-50 text-red-600 px-4 py-2 rounded-xl text-sm border border-red-200 shadow-sm">
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
