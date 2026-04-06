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
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="absolute top-4 right-4 bottom-20 z-[850] w-[360px]"
    >
      <div className="h-full bg-white rounded-2xl shadow-xl border border-stone-200 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-stone-100">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-stone-900 leading-snug">{person.person}</h2>
              <p className="text-sm text-stone-500 mt-0.5">{person.title}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-xs font-mono text-teal-600 bg-teal-50 px-2 py-0.5 rounded-md">
                  {person.born} &mdash; {person.died}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-all"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-stone-500 mt-2 leading-relaxed line-clamp-3">{person.summary}</p>
        </div>

        {/* Event detail */}
        <div className="flex-1 overflow-y-auto p-5">
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Event type badge */}
            <div className="flex items-center gap-2 mb-3">
              <span
                className="text-xs font-semibold px-2.5 py-1 rounded-full capitalize"
                style={{ background: bgColor, color }}
              >
                {event.type}
              </span>
              {event.highlight && (
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200">
                  Key Event
                </span>
              )}
            </div>

            {/* Event title & meta */}
            <h3 className="text-xl font-bold text-stone-900 leading-snug">{event.title}</h3>
            <div className="flex items-center gap-2 mt-1.5 mb-4">
              <span className="text-sm font-mono text-teal-600 font-medium">{event.year}</span>
              <span className="text-stone-300">&middot;</span>
              <span className="text-sm text-stone-500">{event.place}</span>
            </div>

            {/* Description */}
            <p className="text-sm text-stone-600 leading-relaxed mb-4">{event.description}</p>

            {/* People involved */}
            {event.people && event.people.length > 0 && (
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">People Involved</h4>
                <div className="flex flex-wrap gap-1.5">
                  {event.people.map((p) => (
                    <span key={p} className="text-xs bg-stone-100 text-stone-600 px-2.5 py-1 rounded-full">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Links */}
            {event.links && event.links.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">Learn More</h4>
                <div className="flex flex-col gap-1">
                  {event.links.map((link) => (
                    <a
                      key={link}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-teal-600 hover:text-teal-700 hover:underline truncate flex items-center gap-1"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                      Wikipedia
                    </a>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
