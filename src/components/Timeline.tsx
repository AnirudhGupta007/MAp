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
      className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[800] w-[calc(100%-2rem)] max-w-3xl"
    >
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-stone-200 px-4 py-3">
        {/* Person info bar */}
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={togglePlay}
            className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center hover:bg-teal-700 transition-colors flex-shrink-0"
          >
            {isPlaying ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="6,4 20,12 6,20" />
              </svg>
            )}
          </button>

          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-stone-900 truncate">{person.person}</div>
            <div className="text-xs text-stone-400 font-mono">
              {person.born} &mdash; {person.died}
            </div>
          </div>

          {activeEvent && (
            <div className="text-right flex-shrink-0">
              <div className="text-xs font-semibold text-teal-600 font-mono">{activeEvent.year}</div>
              <div className="text-xs text-stone-400 truncate max-w-[120px]">{activeEvent.place}</div>
            </div>
          )}
        </div>

        {/* Timeline track */}
        <div className="relative h-8 flex items-center">
          {/* Background track */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1 bg-stone-100 rounded-full" />

          {/* Progress fill */}
          <motion.div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-teal-500 rounded-full"
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />

          {/* Event dots */}
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
                whileHover={{ scale: 1.3 }}
                whileTap={{ scale: 0.9 }}
              >
                <motion.div
                  animate={{
                    width: isActive ? 14 : event.highlight ? 10 : 7,
                    height: isActive ? 14 : event.highlight ? 10 : 7,
                  }}
                  className="rounded-full border-2 border-white shadow-sm"
                  style={{ background: isActive ? color : event.highlight ? "#d97706" : "#d6d3d1" }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                />

                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="bg-stone-800 text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap shadow-lg">
                    {event.title}
                    <div className="text-stone-400 font-mono text-[10px]">{event.year}</div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Year labels */}
        <div className="flex justify-between mt-0.5">
          <span className="text-[10px] font-mono text-stone-400">{minYear}</span>
          <span className="text-[10px] font-mono text-stone-400">{maxYear}</span>
        </div>
      </div>
    </motion.div>
  );
}
