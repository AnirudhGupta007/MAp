import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import LandingPage from "./components/LandingPage";
import MapView from "./components/MapView";
import SearchBar from "./components/SearchBar";
import SidePanel from "./components/SidePanel";
import Timeline from "./components/Timeline";
import type { PersonData, HistoricalEvent } from "./types";

const ease = [0.16, 1, 0.3, 1] as const;

function App() {
  const [person, setPerson] = useState<PersonData | null>(null);
  const [activeEvent, setActiveEvent] = useState<HistoricalEvent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [appMode, setAppMode] = useState(false);

  const handleSearch = useCallback(async (name: string) => {
    setIsLoading(true);
    setActiveEvent(null);
    try {
      const res = await axios.get(`/api/search?name=${encodeURIComponent(name)}`);
      setPerson(res.data);
      const firstHighlight = res.data.events.find((e: HistoricalEvent) => e.highlight);
      if (firstHighlight) setTimeout(() => setActiveEvent(firstHighlight), 1200);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleEventClick = useCallback((event: HistoricalEvent) => setActiveEvent(event), []);

  const handleClosePanel = useCallback(() => {
    setActiveEvent(null);
    setPerson(null);
  }, []);

  const handleBackToLanding = useCallback(() => {
    setAppMode(false);
    setPerson(null);
    setActiveEvent(null);
  }, []);

  if (!appMode) {
    return (
      <AnimatePresence mode="wait">
        <motion.div key="landing" exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
          <LandingPage onEnterApp={() => setAppMode(true)} />
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <motion.div
      key="app"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease }}
      className="relative h-screen w-screen overflow-hidden bg-[#F0FDF4]"
    >
      <MapView events={person?.events || []} activeEventId={activeEvent?.id || null} onEventClick={handleEventClick} />

      {/* Top loading bar */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="absolute top-0 left-0 right-0 h-[3px] z-[1100] origin-left rounded-full"
            style={{ background: "linear-gradient(90deg, #059669, #10B981, #34D399)" }}
          />
        )}
      </AnimatePresence>

      {/* Back button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        onClick={handleBackToLanding}
        className="absolute top-5 left-5 z-[1000] px-4 py-2 rounded-full bg-white/90 backdrop-blur-xl border border-emerald-100 hover:border-emerald-200 text-emerald-600 hover:text-emerald-800 transition-all duration-200 text-[12px] font-medium shadow-sm shadow-emerald-100/20"
      >
        ← Home
      </motion.button>

      <SearchBar onSearch={handleSearch} isLoading={isLoading} />

      <AnimatePresence>
        {person && (
          <SidePanel person={person} activeEvent={activeEvent} onClose={handleClosePanel} onEventSelect={handleEventClick} />
        )}
      </AnimatePresence>

      {person && person.events.length > 0 && (
        <Timeline events={person.events} activeEventId={activeEvent?.id || null} onEventSelect={handleEventClick} />
      )}
    </motion.div>
  );
}

export default App;
