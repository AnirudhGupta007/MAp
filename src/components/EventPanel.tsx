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

const CARD_W = 320;
const CARD_H = 340;
const OFFSET = 28;

export default function EventPanel({ person, event, position, onClose }: Props) {
  const color = EVENT_COLORS[event.type] || "#78716c";
  const bgColor = EVENT_BG_COLORS[event.type] || "#f5f5f4";

  const pos = useMemo(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let x = position.x + OFFSET;
    let y = position.y - CARD_H / 2;

    if (x + CARD_W > vw - 20) {
      x = position.x - CARD_W - OFFSET;
    }

    if (y < 60) y = 60;
    if (y + CARD_H > vh - 100) y = vh - 100 - CARD_H;

    return { x, y };
  }, [position]);

  const opensRight = pos.x > position.x;

  return (
    <motion.div
      key={event.id}
      initial={{ opacity: 0, x: opensRight ? -20 : 20, scale: 0.92, filter: "blur(8px)" }}
      animate={{ opacity: 1, x: 0, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.92, filter: "blur(8px)" }}
      transition={{ type: "spring", stiffness: 450, damping: 32 }}
      className="absolute z-[850] pointer-events-auto"
      style={{ left: pos.x, top: pos.y, width: CARD_W }}
    >
      {/* Subtle glow behind card */}
      <div
        className="absolute -inset-3 rounded-3xl blur-2xl opacity-20"
        style={{ background: `radial-gradient(circle, ${color}40, transparent 70%)` }}
      />

      <div className="relative glass-strong rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06),0_12px_48px_rgba(0,0,0,0.04)] overflow-hidden">
        {/* Top accent line */}
        <div className="h-[2px] w-full" style={{ background: `linear-gradient(90deg, transparent, ${color}60, transparent)` }} />

        {/* Person header */}
        <div className="px-4 pt-3.5 pb-2.5 flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-bold text-stone-800 truncate" style={{ fontFamily: "var(--font-display)" }}>
              {person.person}
            </h2>
            <p className="text-[11px] text-stone-400 mt-0.5">
              {person.title} &middot; <span className="font-mono text-stone-350">{person.born}–{person.died}</span>
            </p>
          </div>
          <motion.button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-stone-300 hover:text-stone-600 hover:bg-stone-100/80 transition-all flex-shrink-0 ml-2"
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.85 }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </motion.button>
        </div>

        {/* Divider */}
        <div className="mx-4 h-px bg-stone-100/80" />

        {/* Event content */}
        <div className="px-4 py-3.5">
          {/* Type + year badges */}
          <div className="flex items-center gap-2 mb-2.5">
            <motion.span
              className="text-[10px] font-bold px-2.5 py-1 rounded-lg capitalize tracking-wide"
              style={{ background: bgColor, color }}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 25, delay: 0.1 }}
            >
              {event.type}
            </motion.span>
            <span className="text-[11px] font-mono font-bold text-teal-600 bg-teal-50/60 px-2 py-0.5 rounded-md">
              {event.year}
            </span>
            {event.highlight && (
              <motion.span
                className="text-[11px] text-amber-500"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ repeat: Infinity, duration: 2, repeatDelay: 1 }}
              >
                ★
              </motion.span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-[15px] font-bold text-stone-800 leading-snug mb-1.5" style={{ fontFamily: "var(--font-display)" }}>
            {event.title}
          </h3>

          {/* Place */}
          <div className="flex items-center gap-1.5 mb-3">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#a8a29e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
              <circle cx="12" cy="10" r="3" />
              <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 7 8 11.7Z" />
            </svg>
            <span className="text-[11px] text-stone-400 font-medium">{event.place}</span>
          </div>

          {/* Description */}
          <p className="text-[12px] text-stone-500 leading-[1.7] mb-3">{event.description}</p>

          {/* People tags */}
          {event.people && event.people.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {event.people.map((p, i) => (
                <motion.span
                  key={p}
                  className="text-[10px] bg-stone-50/80 text-stone-500 px-2.5 py-0.5 rounded-lg border border-stone-100/60 font-medium"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15 + i * 0.03 }}
                >
                  {p}
                </motion.span>
              ))}
            </div>
          )}

          {/* Link */}
          {event.links && event.links.length > 0 && (
            <motion.a
              href={event.links[0]}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[11px] text-teal-600 hover:text-teal-700 font-semibold transition-colors"
              whileHover={{ x: 3 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              Read more
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </motion.a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
