import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type { HistoricalEvent } from "../types";

interface Props {
  events: HistoricalEvent[];
  activeEventId: number | null;
  onEventSelect: (event: HistoricalEvent) => void;
}

export default function Timeline({ events, activeEventId, onEventSelect }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const sorted = [...events].sort((a, b) => a.year - b.year);

  useEffect(() => {
    if (activeEventId !== null) {
      const idx = sorted.findIndex((e) => e.id === activeEventId);
      if (idx >= 0) setCurrentIndex(idx);
    }
  }, [activeEventId]);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => {
          const next = prev + 1;
          if (next >= sorted.length) {
            setIsPlaying(false);
            return prev;
          }
          onEventSelect(sorted[next]);
          return next;
        });
      }, 2500);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, sorted]);

  if (events.length === 0) return null;

  const minYear = sorted[0]?.year || 0;
  const maxYear = sorted[sorted.length - 1]?.year || 0;
  const range = maxYear - minYear || 1;

  return (
    <motion.div
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="absolute bottom-0 left-0 right-0 z-[800] px-6 pb-6"
    >
      <div
        className="glass rounded-2xl px-6 py-4 mx-auto"
        style={{ maxWidth: "calc(100% - 440px)" }}
      >
        <div className="flex items-center gap-4">
          {/* Play/Pause */}
          <button
            onClick={() => {
              if (!isPlaying && currentIndex >= sorted.length - 1)
                setCurrentIndex(0);
              setIsPlaying(!isPlaying);
            }}
            className="w-10 h-10 rounded-xl bg-[#00d4ff]/10 hover:bg-[#00d4ff]/20 border border-[#00d4ff]/20 flex items-center justify-center transition-all duration-200 flex-shrink-0"
          >
            {isPlaying ? (
              <svg className="w-4 h-4 text-[#00d4ff]" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-[#00d4ff] ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          {/* Year labels */}
          <span className="text-xs text-white/30 font-mono w-10 text-right flex-shrink-0">
            {minYear}
          </span>

          {/* Timeline track */}
          <div className="flex-1 relative h-10 flex items-center">
            {/* Track line */}
            <div className="absolute left-0 right-0 h-px bg-white/[0.08]" />

            {/* Progress line */}
            <div
              className="absolute left-0 h-px transition-all duration-500 ease-out"
              style={{
                width: `${((sorted[currentIndex]?.year || minYear) - minYear) / range * 100}%`,
                background: "linear-gradient(90deg, #00d4ff, #00d4ff80)",
                boxShadow: "0 0 10px rgba(0, 212, 255, 0.4)",
              }}
            />

            {/* Event dots */}
            {sorted.map((event, i) => {
              const pos = ((event.year - minYear) / range) * 100;
              const isActive = event.id === activeEventId;
              const isPast = i <= currentIndex;

              return (
                <button
                  key={event.id}
                  onClick={() => {
                    setCurrentIndex(i);
                    onEventSelect(event);
                  }}
                  className="absolute -translate-x-1/2 group flex flex-col items-center"
                  style={{ left: `${pos}%` }}
                >
                  {/* Dot */}
                  <div
                    className="rounded-full transition-all duration-300 cursor-pointer"
                    style={{
                      width: isActive ? 14 : event.highlight ? 10 : 8,
                      height: isActive ? 14 : event.highlight ? 10 : 8,
                      background: isActive
                        ? "#fff"
                        : event.highlight
                        ? "#ffb800"
                        : isPast
                        ? "#00d4ff"
                        : "rgba(255,255,255,0.15)",
                      boxShadow: isActive
                        ? "0 0 16px rgba(0, 212, 255, 0.6)"
                        : event.highlight
                        ? "0 0 12px rgba(255, 184, 0, 0.4)"
                        : "none",
                      border: isActive ? "2px solid #00d4ff" : "none",
                    }}
                  />

                  {/* Year label on hover */}
                  <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <span className="text-[10px] text-white/60 font-mono whitespace-nowrap bg-black/60 px-1.5 py-0.5 rounded">
                      {event.year}
                    </span>
                  </div>

                  {/* Title on hover */}
                  <div className="absolute top-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <span className="text-[10px] text-white/40 whitespace-nowrap max-w-[100px] truncate block">
                      {event.title}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <span className="text-xs text-white/30 font-mono w-10 flex-shrink-0">
            {maxYear}
          </span>
        </div>

        {/* Current event label */}
        {sorted[currentIndex] && (
          <div className="mt-2 text-center">
            <span className="text-xs text-[#00d4ff]/60 font-light">
              {sorted[currentIndex].year} — {sorted[currentIndex].title}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
