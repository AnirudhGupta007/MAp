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
          if (next >= sorted.length) { setIsPlaying(false); return prev; }
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
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="absolute bottom-0 left-0 right-0 z-[800] px-5 pb-5"
    >
      <div className="rounded-xl bg-[#141414]/80 backdrop-blur-md border border-white/[0.04] px-5 py-3 mx-auto" style={{ maxWidth: "calc(100% - 400px)" }}>
        <div className="flex items-center gap-3">
          {/* Play/Pause */}
          <button
            onClick={() => {
              if (!isPlaying && currentIndex >= sorted.length - 1) setCurrentIndex(0);
              setIsPlaying(!isPlaying);
            }}
            className="w-8 h-8 rounded-md border border-white/[0.06] hover:border-white/[0.1] flex items-center justify-center transition-colors duration-150 flex-shrink-0"
          >
            {isPlaying ? (
              <svg className="w-3 h-3 text-white/60" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>
              </svg>
            ) : (
              <svg className="w-3 h-3 text-white/60 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </button>

          <span className="text-[10px] text-white/20 font-mono w-8 text-right flex-shrink-0">{minYear}</span>

          {/* Track */}
          <div className="flex-1 relative h-8 flex items-center">
            <div className="absolute left-0 right-0 h-px bg-white/[0.06]" />
            <div
              className="absolute left-0 h-[2px] rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${((sorted[currentIndex]?.year || minYear) - minYear) / range * 100}%`,
                background: "linear-gradient(90deg, #8b5cf6, #6366f1)",
                boxShadow: "0 0 6px rgba(139,92,246,0.3)",
              }}
            />
            {sorted.map((event, i) => {
              const pos = ((event.year - minYear) / range) * 100;
              const isActive = event.id === activeEventId;
              const isPast = i <= currentIndex;
              return (
                <button
                  key={event.id}
                  onClick={() => { setCurrentIndex(i); onEventSelect(event); }}
                  className="absolute -translate-x-1/2 group"
                  style={{ left: `${pos}%` }}
                >
                  <div
                    className="rounded-full transition-all duration-200"
                    style={{
                      width: isActive ? 10 : event.highlight ? 8 : 6,
                      height: isActive ? 10 : event.highlight ? 8 : 6,
                      background: isActive ? "#fff" : event.highlight ? "#f59e0b" : isPast ? "#8b5cf6" : "rgba(255,255,255,0.1)",
                      boxShadow: isActive ? "0 0 8px rgba(139,92,246,0.4)" : "none",
                    }}
                  />
                </button>
              );
            })}
          </div>

          <span className="text-[10px] text-white/20 font-mono w-8 flex-shrink-0">{maxYear}</span>
        </div>

        {sorted[currentIndex] && (
          <p className="text-center text-[11px] text-white/25 mt-1 font-light truncate">
            <span className="font-mono text-white/20">{sorted[currentIndex].year}</span>
            <span className="mx-1.5 text-white/10">·</span>
            {sorted[currentIndex].title}
          </p>
        )}
      </div>
    </motion.div>
  );
}
