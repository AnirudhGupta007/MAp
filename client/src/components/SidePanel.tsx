import { motion, AnimatePresence } from "framer-motion";
import type { HistoricalEvent, PersonData } from "../types";

interface Props {
  person: PersonData | null;
  activeEvent: HistoricalEvent | null;
  onClose: () => void;
  onEventSelect: (event: HistoricalEvent) => void;
}

export default function SidePanel({ person, activeEvent, onClose, onEventSelect }: Props) {
  if (!person) return null;

  const typeEmoji: Record<string, string> = {
    birth: "👶",
    death: "⚰️",
    battle: "⚔️",
    coronation: "👑",
    meeting: "🤝",
    journey: "🧭",
    achievement: "🏆",
    construction: "🏗️",
  };

  const typeColor: Record<string, string> = {
    birth: "#4ade80",
    death: "#94a3b8",
    battle: "#f87171",
    coronation: "#fbbf24",
    meeting: "#60a5fa",
    journey: "#a78bfa",
    achievement: "#34d399",
    construction: "#fb923c",
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 400, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 400, opacity: 0 }}
        transition={{ type: "spring", damping: 28, stiffness: 200 }}
        className="absolute top-0 right-0 bottom-0 w-[420px] z-[900] flex flex-col"
      >
        {/* Glass background */}
        <div className="absolute inset-0 glass border-l border-white/[0.06]" />

        {/* Content */}
        <div className="relative h-full flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-6 pb-4 border-b border-white/[0.06]">
            <div className="flex items-start justify-between">
              <div>
                <motion.h2
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-2xl font-semibold text-white"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {person.person}
                </motion.h2>
                <motion.p
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.15 }}
                  className="text-[#00d4ff] text-sm mt-1 font-light"
                >
                  {person.title}
                </motion.p>
                <motion.p
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-white/30 text-xs mt-1"
                >
                  {person.born} — {person.died}
                </motion.p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white/80 transition-all"
              >
                ✕
              </button>
            </div>

            {/* Summary */}
            <motion.p
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="text-white/50 text-sm mt-4 leading-relaxed font-light"
            >
              {person.summary}
            </motion.p>
          </div>

          {/* Active event detail */}
          <AnimatePresence mode="wait">
            {activeEvent && (
              <motion.div
                key={activeEvent.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="mx-4 mt-4 p-4 rounded-xl border"
                style={{
                  background: `linear-gradient(135deg, ${typeColor[activeEvent.type] || "#00d4ff"}10, transparent)`,
                  borderColor: `${typeColor[activeEvent.type] || "#00d4ff"}25`,
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{typeEmoji[activeEvent.type] || "📍"}</span>
                  <span
                    className="text-xs font-bold tracking-widest uppercase"
                    style={{ color: activeEvent.highlight ? "#ffb800" : "#00d4ff" }}
                  >
                    {activeEvent.year} • {activeEvent.place}
                  </span>
                  {activeEvent.highlight && (
                    <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-[#ffb800]/15 text-[#ffb800] border border-[#ffb800]/20 font-medium">
                      FEATURED
                    </span>
                  )}
                </div>
                <h3 className="text-white text-base font-semibold mb-2">
                  {activeEvent.title}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed font-light">
                  {activeEvent.description}
                </p>

                {/* People tags */}
                {activeEvent.people.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {activeEvent.people.map((p) => (
                      <span
                        key={p}
                        className="text-[11px] px-2.5 py-1 rounded-full bg-white/5 text-white/50 border border-white/[0.06]"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                )}

                {/* Links */}
                {activeEvent.links.length > 0 && (
                  <div className="mt-3 flex gap-2">
                    {activeEvent.links.map((link, i) => (
                      <a
                        key={i}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-[#00d4ff]/70 hover:text-[#00d4ff] underline underline-offset-2 transition-colors"
                      >
                        Wikipedia ↗
                      </a>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Events list */}
          <div className="flex-1 overflow-y-auto mt-4 px-4 pb-32">
            <p className="text-[10px] tracking-[0.2em] uppercase text-white/20 mb-3 ml-1">
              All Events
            </p>
            {[...person.events]
              .sort((a, b) => a.year - b.year)
              .map((event, i) => (
                <motion.button
                  key={event.id}
                  initial={{ x: 30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 + i * 0.04 }}
                  onClick={() => onEventSelect(event)}
                  className={`w-full text-left p-3 rounded-lg mb-1.5 transition-all duration-200 group flex items-start gap-3 ${
                    activeEvent?.id === event.id
                      ? "bg-white/[0.06] border border-white/[0.08]"
                      : "hover:bg-white/[0.03] border border-transparent"
                  }`}
                >
                  {/* Timeline dot and line */}
                  <div className="flex flex-col items-center pt-1 flex-shrink-0">
                    <div
                      className="w-2.5 h-2.5 rounded-full border-2"
                      style={{
                        borderColor: event.highlight
                          ? "#ffb800"
                          : typeColor[event.type] || "#00d4ff",
                        backgroundColor:
                          activeEvent?.id === event.id
                            ? event.highlight
                              ? "#ffb800"
                              : typeColor[event.type] || "#00d4ff"
                            : "transparent",
                      }}
                    />
                    {i < person.events.length - 1 && (
                      <div className="w-px h-8 bg-white/[0.06] mt-1" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-white/30 font-mono">
                        {event.year}
                      </span>
                      <span className="text-sm">{typeEmoji[event.type] || "📍"}</span>
                    </div>
                    <p className="text-sm text-white/80 group-hover:text-white transition-colors truncate">
                      {event.title}
                    </p>
                    <p className="text-xs text-white/30 mt-0.5">{event.place}</p>
                  </div>
                </motion.button>
              ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
