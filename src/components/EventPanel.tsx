import { useMemo } from "react";
import { motion } from "motion/react";
import type { HistoricalEvent, PersonData } from "../types";
import { EVENT_COLORS, EVENT_BG_COLORS } from "../lib/constants";

interface Props {
  person: PersonData;
  event: HistoricalEvent;
  position: { x: number; y: number };
  onClose: () => void;
}

const CARD_W = 300;
const CARD_H = 320;
const OFFSET = 24;

export default function EventPanel({ person, event, position, onClose }: Props) {
  const color = EVENT_COLORS[event.type] || "#78716c";
  const bgColor = EVENT_BG_COLORS[event.type] || "#f5f5f4";

  // Position card to the right of the marker, or left if too close to right edge
  const pos = useMemo(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let x = position.x + OFFSET;
    let y = position.y - CARD_H / 2;

    // Flip to left side if overflows right
    if (x + CARD_W > vw - 20) {
      x = position.x - CARD_W - OFFSET;
    }

    // Clamp vertical
    if (y < 60) y = 60;
    if (y + CARD_H > vh - 100) y = vh - 100 - CARD_H;

    return { x, y };
  }, [position]);

  const opensRight = pos.x > position.x;

  return (
    <motion.div
      key={event.id}
      initial={{ opacity: 0, x: opensRight ? -15 : 15, scale: 0.96 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ type: "spring", stiffness: 500, damping: 35 }}
      className="absolute z-[850] pointer-events-auto"
      style={{ left: pos.x, top: pos.y, width: CARD_W }}
    >
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-stone-100 overflow-hidden">
        {/* Person header */}
        <div className="px-4 pt-3.5 pb-2.5 flex items-center justify-between border-b border-stone-100">
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-bold text-stone-900 truncate" style={{ fontFamily: "var(--font-display)" }}>
              {person.person}
            </h2>
            <p className="text-[11px] text-stone-400">{person.title} &middot; <span className="font-mono">{person.born}–{person.died}</span></p>
          </div>
          <button
            onClick={onClose}
            className="w-6 h-6 rounded-full flex items-center justify-center text-stone-300 hover:text-stone-500 hover:bg-stone-50 transition-all flex-shrink-0 ml-2"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        {/* Event content */}
        <div className="px-4 py-3.5">
          {/* Type + year */}
          <div className="flex items-center gap-2 mb-2">
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full capitalize tracking-wide"
              style={{ background: bgColor, color }}
            >
              {event.type}
            </span>
            <span className="text-[11px] font-mono font-bold text-teal-600">{event.year}</span>
            {event.highlight && (
              <span className="text-[10px] text-amber-500">★</span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-[14px] font-bold text-stone-900 leading-snug mb-1" style={{ fontFamily: "var(--font-display)" }}>
            {event.title}
          </h3>

          {/* Place */}
          <div className="flex items-center gap-1.5 mb-2.5">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#a8a29e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
              <circle cx="12" cy="10" r="3" />
              <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 7 8 11.7Z" />
            </svg>
            <span className="text-[11px] text-stone-400">{event.place}</span>
          </div>

          {/* Description */}
          <p className="text-[12px] text-stone-500 leading-relaxed mb-3">{event.description}</p>

          {/* People */}
          {event.people && event.people.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {event.people.map((p) => (
                <span key={p} className="text-[10px] bg-stone-50 text-stone-500 px-2 py-0.5 rounded-full border border-stone-100">
                  {p}
                </span>
              ))}
            </div>
          )}

          {/* Link */}
          {event.links && event.links.length > 0 && (
            <a
              href={event.links[0]}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] text-teal-600 hover:text-teal-700 font-medium transition-colors"
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              Read more
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
