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
      initial={{ y: 60, opacity: 0, filter: "blur(10px)" }}
      animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
      transition={{ delay: 0.2, type: "spring", stiffness: 250, damping: 28 }}
      className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[800] w-[calc(100%-2rem)] max-w-2xl"
    >
      {/* Subtle glow behind */}
      <div className="absolute -inset-2 bg-gradient-to-t from-white/50 to-transparent rounded-3xl blur-xl" />

      <div className="relative glass-strong rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.05),0_12px_48px_rgba(0,0,0,0.03)] px-5 py-3.5">
        {/* Top row: play + person name + active event year */}
        <div className="flex items-center gap-3 mb-3">
          <motion.button
            onClick={togglePlay}
            className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 text-white flex items-center justify-center flex-shrink-0 cursor-pointer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.85 }}
            transition={{ type: "spring", stiffness: 400, damping: 18 }}
            style={{ boxShadow: "0 4px 14px rgba(13,148,136,0.2)" }}
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
          </motion.button>

          <div className="flex-1 text-center min-w-0">
            <span className="text-sm font-bold text-stone-700" style={{ fontFamily: "var(--font-display)" }}>
              {person.person}
            </span>
            <span className="text-[11px] text-stone-300 font-mono ml-2">{person.born}–{person.died}</span>
          </div>

          {activeEvent ? (
            <motion.div
              className="flex-shrink-0 bg-teal-50/60 px-2.5 py-1 rounded-lg"
              key={activeEvent.year}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
            >
              <span className="text-xs font-mono font-bold text-teal-600">{activeEvent.year}</span>
            </motion.div>
          ) : (
            <div className="w-12" />
          )}
        </div>

        {/* Timeline track */}
        <div className="relative h-8 flex items-center">
          {/* Background track */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[3px] bg-stone-100 rounded-full overflow-hidden">
            {/* Shimmer effect on track */}
            <div className="absolute inset-0 shimmer-line" />
          </div>

          {/* Progress fill */}
          <motion.div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-[3px] rounded-full"
            style={{ background: "linear-gradient(90deg, #0d9488, #14b8a6)" }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
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
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 group cursor-pointer z-10"
                style={{ left: `${leftPct}%` }}
                whileHover={{ scale: 1.5 }}
                whileTap={{ scale: 0.85 }}
              >
                {/* Active ring */}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{ background: color }}
                    initial={{ scale: 1, opacity: 0.25 }}
                    animate={{ scale: 2.5, opacity: 0 }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }}
                  />
                )}

                <motion.div
                  animate={{
                    width: isActive ? 14 : event.highlight ? 9 : 6,
                    height: isActive ? 14 : event.highlight ? 9 : 6,
                  }}
                  className="rounded-full border-2 border-white relative"
                  style={{
                    background: isActive ? color : event.highlight ? "#d97706" : "#d6d3d1",
                    boxShadow: isActive
                      ? `0 0 0 3px ${color}20, 0 2px 8px ${color}30`
                      : "0 1px 4px rgba(0,0,0,0.06)",
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 22 }}
                />

                {/* Tooltip */}
                <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none scale-90 group-hover:scale-100">
                  <div className="bg-stone-800/95 backdrop-blur-sm text-white text-[11px] px-3 py-1.5 rounded-xl whitespace-nowrap shadow-lg font-medium">
                    {event.title}
                    <span className="text-stone-400 font-mono ml-1.5">{event.year}</span>
                  </div>
                  {/* Tooltip arrow */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-stone-800/95" />
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Year labels */}
        <div className="flex justify-between mt-1.5 px-0.5">
          <span className="text-[10px] font-mono text-stone-300 font-medium">{minYear}</span>
          <span className="text-[10px] font-mono text-stone-300 font-medium">{maxYear}</span>
        </div>
      </div>
    </motion.div>
  );
}
