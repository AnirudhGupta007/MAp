import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import LandingPage from "./components/LandingPage";
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
  const [appMode, setAppMode] = useState(false); // false = landing page, true = map explorer

  const handleSearch = useCallback(async (name: string) => {
    setIsLoading(true);
    setActiveEvent(null);
    try {
      const res = await axios.get(`/api/search?name=${encodeURIComponent(name)}`);
      setPerson(res.data);
      setShowLanding(false);
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

  const handleEnterApp = useCallback(() => {
    setAppMode(true);
  }, []);

  const handleBackToLanding = useCallback(() => {
    setAppMode(false);
    setPerson(null);
    setActiveEvent(null);
    setShowLanding(true);
  }, []);

  // ═══════════ LANDING PAGE ═══════════
  if (!appMode) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="landing"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <LandingPage onEnterApp={handleEnterApp} />
        </motion.div>
      </AnimatePresence>
    );
  }

  // ═══════════ MAP EXPLORER ═══════════
  return (
    <motion.div
      key="app"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="relative h-screen w-screen overflow-hidden bg-[#06060a]"
    >
      {/* Map */}
      <MapView
        events={person?.events || []}
        activeEventId={activeEvent?.id || null}
        onEventClick={handleEventClick}
      />

      {/* Landing hero overlay (before search) */}
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
                <span
                  style={{
                    background: "linear-gradient(135deg, #00d4ff, #a78bfa)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Timeline
                </span>
              </motion.h1>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-white/25 text-lg mt-4 font-light tracking-wide"
              >
                Search a historical figure to begin
              </motion.p>
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
            className="absolute inset-0 z-[600] flex items-center justify-center bg-[#06060a]/60 backdrop-blur-sm"
          >
            <div className="text-center">
              <motion.div
                className="w-14 h-14 border-2 border-[#00d4ff]/20 border-t-[#00d4ff] rounded-full mx-auto"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <p className="text-white/30 text-sm mt-4 font-light tracking-wide">
                Exploring history...
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back to landing button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        onClick={handleBackToLanding}
        className="absolute top-6 left-6 z-[1000] glass rounded-xl px-3 py-2 text-white/40 hover:text-white/80 transition-all duration-200 text-sm flex items-center gap-2"
      >
        <span>←</span>
        <span className="text-xs">Home</span>
      </motion.button>

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
    </motion.div>
  );
}

export default App;
