import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import MapView from "./components/MapView";
import SearchBar from "./components/SearchBar";
import SidePanel from "./components/SidePanel";
import Timeline from "./components/Timeline";
import type { PersonData, HistoricalEvent } from "./types";

function App() {
  const [person, setPerson] = useState<PersonData | null>(null);
  const [activeEvent, setActiveEvent] = useState<HistoricalEvent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showLanding, setShowLanding] = useState(true);

  const handleSearch = useCallback(async (name: string) => {
    setIsLoading(true);
    setActiveEvent(null);
    try {
      const res = await axios.get(`/api/search?name=${encodeURIComponent(name)}`);
      setPerson(res.data);
      setShowLanding(false);
      // Auto-select first highlighted event, or first event
      const firstHighlight = res.data.events.find((e: HistoricalEvent) => e.highlight);
      if (firstHighlight) {
        setTimeout(() => setActiveEvent(firstHighlight), 1500);
      }
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleEventClick = useCallback((event: HistoricalEvent) => {
    setActiveEvent(event);
  }, []);

  const handleClosePanel = useCallback(() => {
    setActiveEvent(null);
    setPerson(null);
    setShowLanding(true);
  }, []);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#06060a]">
      {/* Map (always visible) */}
      <MapView
        events={person?.events || []}
        activeEventId={activeEvent?.id || null}
        onEventClick={handleEventClick}
      />

      {/* Landing hero overlay */}
      <AnimatePresence>
        {showLanding && !isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 z-[500] flex items-center justify-center pointer-events-none"
          >
            <div className="text-center">
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-6xl font-bold text-white/90 tracking-tight"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Geo
                <span className="text-[#00d4ff]">Timeline</span>
              </motion.h1>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-white/25 text-lg mt-4 font-light tracking-wide"
              >
                Explore history through space and time
              </motion.p>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="mt-8 flex items-center justify-center gap-6 text-white/15 text-sm"
              >
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00d4ff]/40" />
                  Search a figure
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#ffb800]/40" />
                  Explore events
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#ff3d5a]/40" />
                  Discover stories
                </span>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[600] flex items-center justify-center"
          >
            <div className="text-center">
              <div className="w-12 h-12 border-2 border-[#00d4ff]/20 border-t-[#00d4ff] rounded-full animate-spin mx-auto" />
              <p className="text-white/30 text-sm mt-4 font-light">
                Exploring history...
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search bar */}
      <SearchBar onSearch={handleSearch} isLoading={isLoading} />

      {/* Side panel */}
      <AnimatePresence>
        {person && (
          <SidePanel
            person={person}
            activeEvent={activeEvent}
            onClose={handleClosePanel}
            onEventSelect={handleEventClick}
          />
        )}
      </AnimatePresence>

      {/* Timeline */}
      {person && person.events.length > 0 && (
        <Timeline
          events={person.events}
          activeEventId={activeEvent?.id || null}
          onEventSelect={handleEventClick}
        />
      )}

      {/* Ambient brand mark */}
      <div className="absolute bottom-4 left-4 z-[500] text-white/[0.06] text-[10px] tracking-[0.3em] uppercase font-light">
        GeoTimeline v1.0
      </div>
    </div>
  );
}

export default App;
