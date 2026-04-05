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
      transition={{ delay: 0.3, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="absolute bottom-0 left-0 right-0 z-[800] px-5 pb-5"
    >
      <div className="rounded-2xl bg-white/90 backdrop-blur-xl border border-emerald-100 shadow-xl shadow-emerald-100/20 px-5 py-3.5 mx-auto" style={{ maxWidth: "calc(100% - 420px)" }}>
        <div className="flex items-center gap-3">
          {/* Play/Pause */}
          <button
            onClick={() => {
              if (!isPlaying && currentIndex >= sorted.length - 1) setCurrentIndex(0);
              setIsPlaying(!isPlaying);
            }}
            className="w-9 h-9 rounded-full bg-emerald-500 hover:bg-emerald-600 flex items-center justify-center transition-all duration-200 flex-shrink-0 shadow-sm shadow-emerald-200"
          >
            {isPlaying ? (
              <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </button>

          <span className="text-[10px] text-emerald-400 font-mono w-8 text-right flex-shrink-0">{minYear}</span>

          {/* Track */}
          <div className="flex-1 relative h-10 flex items-center">
            <div className="absolute left-0 right-0 h-[2px] bg-emerald-100 rounded-full" />
            <div
              className="absolute left-0 h-[3px] rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${((sorted[currentIndex]?.year || minYear) - minYear) / range * 100}%`,
                background: "linear-gradient(90deg, #059669, #10B981)",
                boxShadow: "0 0 8px rgba(16,185,129,0.3)",
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
                    className="rounded-full transition-all duration-300 border-2 border-white"
                    style={{
                      width: isActive ? 14 : event.highlight ? 10 : 8,
                      height: isActive ? 14 : event.highlight ? 10 : 8,
                      background: isActive ? "#059669" : event.highlight ? "#f59e0b" : isPast ? "#10B981" : "#d1fae5",
                      boxShadow: isActive ? "0 0 0 3px rgba(5,150,105,0.2), 0 2px 8px rgba(5,150,105,0.3)" : "0 1px 4px rgba(0,0,0,0.08)",
                    }}
                  />
                  {/* Hover label */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[9px] font-mono text-emerald-600 bg-white px-1.5 py-0.5 rounded shadow-sm border border-emerald-100 whitespace-nowrap">
                      {event.year}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <span className="text-[10px] text-emerald-400 font-mono w-8 flex-shrink-0">{maxYear}</span>
        </div>

        {sorted[currentIndex] && (
          <p className="text-center text-[11px] text-emerald-500/50 mt-1.5 truncate">
            <span className="font-mono text-emerald-400">{sorted[currentIndex].year}</span>
            <span className="mx-1.5 text-emerald-200">·</span>
            <span className="font-medium text-emerald-600/50">{sorted[currentIndex].title}</span>
          </p>
        )}
      </div>
    </motion.div>
  );
}
