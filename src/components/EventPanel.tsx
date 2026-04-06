import { motion } from "motion/react";
import type { HistoricalEvent, PersonData } from "../types";
import { EVENT_COLORS, EVENT_BG_COLORS } from "../lib/constants";

interface Props {
  person: PersonData;
  event: HistoricalEvent;
  onClose: () => void;
}

export default function EventPanel({ person, event, onClose }: Props) {
  const color = EVENT_COLORS[event.type] || "#78716c";
  const bgColor = EVENT_BG_COLORS[event.type] || "#f5f5f4";

  return (
    <motion.div
      key={event.id}
      initial={{ opacity: 0, x: -20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -20, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="absolute top-4 left-4 z-[850] w-[320px]"
    >
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-stone-100 overflow-hidden">
        {/* Person header */}
        <div className="px-5 pt-4 pb-3 flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-bold text-stone-900 truncate" style={{ fontFamily: "var(--font-display)" }}>
              {person.person}
            </h2>
            <p className="text-xs text-stone-400 mt-0.5">{person.title} &middot; <span className="font-mono">{person.born}–{person.died}</span></p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center text-stone-300 hover:text-stone-500 hover:bg-stone-100 transition-all flex-shrink-0 ml-2"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        {/* Divider */}
        <div className="h-px bg-stone-100 mx-5" />

        {/* Event content */}
        <div className="px-5 py-4">
          {/* Type + year row */}
          <div className="flex items-center gap-2 mb-2.5">
            <span
              className="text-[11px] font-semibold px-2 py-0.5 rounded-full capitalize"
              style={{ background: bgColor, color }}
            >
              {event.type}
            </span>
            <span className="text-xs font-mono font-semibold text-teal-600">{event.year}</span>
            {event.highlight && (
              <span className="text-[10px] font-medium text-amber-500">★</span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-[15px] font-bold text-stone-900 leading-snug mb-1" style={{ fontFamily: "var(--font-display)" }}>
            {event.title}
          </h3>

          {/* Place */}
          <div className="flex items-center gap-1 mb-3">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#a8a29e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="10" r="3" />
              <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 7 8 11.7Z" />
            </svg>
            <span className="text-xs text-stone-400">{event.place}</span>
          </div>

          {/* Description */}
          <p className="text-[13px] text-stone-500 leading-relaxed mb-3">{event.description}</p>

          {/* People tags */}
          {event.people && event.people.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {event.people.map((p) => (
                <span key={p} className="text-[11px] bg-stone-50 text-stone-500 px-2 py-0.5 rounded-full border border-stone-100">
                  {p}
                </span>
              ))}
            </div>
          )}

          {/* Wiki link */}
          {event.links && event.links.length > 0 && (
            <a
              href={event.links[0]}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-teal-600 hover:text-teal-700 transition-colors"
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
