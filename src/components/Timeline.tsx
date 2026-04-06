import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "motion/react";
import type { HistoricalEvent, PersonData } from "../types";
import { EVENT_COLORS } from "../lib/constants";

interface Props {
  person: PersonData;
  events: HistoricalEvent[];
  activeEvent: HistoricalEvent | null;
  onEventSelect: (event: HistoricalEvent) => void;
}

export default function Timeline({ person, events, activeEvent, onEventSelect }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const currentIndex = activeEvent ? events.findIndex((e) => e.id === activeEvent.id) : -1;

  const minYear = events.length > 0 ? events[0].year : 0;
  const maxYear = events.length > 0 ? events[events.length - 1].year : 1;
  const range = maxYear - minYear || 1;

  const playNext = useCallback(() => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < events.length) {
      onEventSelect(events[nextIndex]);
    } else {
      setIsPlaying(false);
    }
  }, [currentIndex, events, onEventSelect]);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(playNext, 2500);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, playNext]);

  const togglePlay = () => {
    if (!isPlaying && currentIndex === events.length - 1) {
      onEventSelect(events[0]);
    }
    setIsPlaying(!isPlaying);
  };

  const progressPct = currentIndex >= 0 ? ((events[currentIndex].year - minYear) / range) * 100 : 0;

  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3, type: "spring", stiffness: 300, damping: 30 }}
      className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[800] w-[calc(100%-2rem)] max-w-2xl"
    >
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-stone-100 px-5 py-3">
        {/* Top row: play + person name centered + active event */}
        <div className="flex items-center gap-3 mb-2.5">
          <button
            onClick={togglePlay}
            className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center hover:bg-teal-700 active:scale-90 transition-all flex-shrink-0"
          >
            {isPlaying ? (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="7,4 20,12 7,20" />
              </svg>
            )}
          </button>

          <div className="flex-1 text-center min-w-0">
            <span className="text-sm font-bold text-stone-800" style={{ fontFamily: "var(--font-display)" }}>
              {person.person}
            </span>
            <span className="text-xs text-stone-300 font-mono ml-2">{person.born}–{person.died}</span>
          </div>

          {activeEvent ? (
            <div className="text-right flex-shrink-0">
              <span className="text-xs font-mono font-bold text-teal-600">{activeEvent.year}</span>
            </div>
          ) : (
            <div className="w-8" />
          )}
        </div>

        {/* Timeline track */}
        <div className="relative h-6 flex items-center">
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[3px] bg-stone-100 rounded-full" />

          <motion.div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-[3px] bg-teal-500/60 rounded-full"
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />

          {events.map((event) => {
            const leftPct = ((event.year - minYear) / range) * 100;
            const isActive = activeEvent?.id === event.id;
            const color = EVENT_COLORS[event.type] || "#78716c";

            return (
              <motion.button
                key={event.id}
                onClick={() => onEventSelect(event)}
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 group"
                style={{ left: `${leftPct}%` }}
                whileHover={{ scale: 1.4 }}
                whileTap={{ scale: 0.9 }}
              >
                <motion.div
                  animate={{
                    width: isActive ? 12 : event.highlight ? 8 : 6,
                    height: isActive ? 12 : event.highlight ? 8 : 6,
                  }}
                  className="rounded-full border-2 border-white"
                  style={{
                    background: isActive ? color : event.highlight ? "#d97706" : "#d6d3d1",
                    boxShadow: isActive ? `0 0 0 3px ${color}20` : "0 1px 3px rgba(0,0,0,0.08)",
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                />

                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="bg-stone-800 text-white text-[11px] px-2 py-1 rounded-lg whitespace-nowrap shadow-lg">
                    {event.title}
                    <span className="text-stone-400 font-mono ml-1">{event.year}</span>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Year labels */}
        <div className="flex justify-between mt-1">
          <span className="text-[10px] font-mono text-stone-300">{minYear}</span>
          <span className="text-[10px] font-mono text-stone-300">{maxYear}</span>
        </div>
      </div>
    </motion.div>
  );
}
