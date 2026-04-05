import { motion, AnimatePresence } from "framer-motion";
import type { HistoricalEvent, PersonData } from "../types";

interface Props {
  person: PersonData | null;
  activeEvent: HistoricalEvent | null;
  onClose: () => void;
  onEventSelect: (event: HistoricalEvent) => void;
}

const TYPE_META: Record<string, { label: string; color: string }> = {
  birth: { label: "Birth", color: "#22c55e" },
  death: { label: "Death", color: "#64748b" },
  battle: { label: "Battle", color: "#ef4444" },
  coronation: { label: "Coronation", color: "#f59e0b" },
  meeting: { label: "Meeting", color: "#6366f1" },
  journey: { label: "Journey", color: "#8b5cf6" },
  achievement: { label: "Achievement", color: "#22c55e" },
  construction: { label: "Construction", color: "#f97316" },
};

const ease = "easeOut" as const;

export default function SidePanel({ person, activeEvent, onClose, onEventSelect }: Props) {
  if (!person) return null;
  const sorted = [...person.events].sort((a, b) => a.year - b.year);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 380, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 380, opacity: 0 }}
        transition={{ duration: 0.4, ease }}
        className="absolute top-0 right-0 bottom-0 w-[380px] z-[900] bg-[#0a0a0a] border-l border-white/[0.06] flex flex-col"
      >
        {/* Header */}
        <div className="p-5 pb-4 border-b border-white/[0.04]">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-[18px] font-semibold text-white/92 tracking-tight">{person.person}</h2>
              <p className="text-[12px] text-[#8b5cf6] mt-0.5 font-medium">{person.title}</p>
              <p className="text-[11px] text-white/25 mt-0.5 font-mono">{person.born} — {person.died}</p>
            </div>
            <button onClick={onClose} className="w-7 h-7 rounded-md bg-white/[0.03] hover:bg-white/[0.06] flex items-center justify-center text-white/30 hover:text-white/60 transition-colors duration-150 text-[12px]">
              ✕
            </button>
          </div>
          <p className="text-[13px] text-white/35 mt-3 leading-relaxed font-light">{person.summary}</p>
        </div>

        {/* Active event detail */}
        <AnimatePresence mode="wait">
          {activeEvent && (
            <motion.div
              key={activeEvent.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease }}
              className="mx-4 mt-4 p-4 rounded-lg bg-[#141414] border border-white/[0.04]"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: TYPE_META[activeEvent.type]?.color || "#8b5cf6" }} />
                <span className="text-[10px] font-medium tracking-wider uppercase" style={{ color: TYPE_META[activeEvent.type]?.color || "#8b5cf6" }}>
                  {TYPE_META[activeEvent.type]?.label || activeEvent.type}
                </span>
                <span className="text-[10px] text-white/20 font-mono ml-auto">{activeEvent.year}</span>
                {activeEvent.highlight && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/15 font-medium">
                    KEY
                  </span>
                )}
              </div>
              <h3 className="text-[14px] font-medium text-white/88 mb-1.5 leading-snug">{activeEvent.title}</h3>
              <p className="text-[12px] text-white/30 font-mono mb-2">{activeEvent.place}</p>
              <p className="text-[13px] text-white/40 leading-relaxed font-light">{activeEvent.description}</p>

              {activeEvent.people.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {activeEvent.people.map((p) => (
                    <span key={p} className="text-[10px] px-2 py-0.5 rounded-md bg-white/[0.03] text-white/40 border border-white/[0.04]">
                      {p}
                    </span>
                  ))}
                </div>
              )}

              {activeEvent.links.length > 0 && (
                <div className="mt-3">
                  {activeEvent.links.map((link, i) => (
                    <a key={i} href={link} target="_blank" rel="noopener noreferrer"
                      className="text-[11px] text-[#8b5cf6]/70 hover:text-[#8b5cf6] transition-colors duration-150">
                      Read more ↗
                    </a>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Events list */}
        <div className="flex-1 overflow-y-auto mt-3 px-4 pb-28">
          <p className="text-[10px] tracking-[0.12em] uppercase text-white/20 mb-2 font-medium">
            {sorted.length} Events
          </p>
          {sorted.map((event) => {
            const isActive = activeEvent?.id === event.id;
            const t = TYPE_META[event.type] || { label: event.type, color: "#8b5cf6" };
            return (
              <button
                key={event.id}
                onClick={() => onEventSelect(event)}
                className={`w-full text-left px-3 py-2.5 rounded-lg mb-0.5 transition-all duration-150 flex items-center gap-3 ${
                  isActive
                    ? "bg-[#1a1a1a] border-l-2 border-l-[#8b5cf6]"
                    : "hover:bg-[#141414] border-l-2 border-l-transparent"
                }`}
              >
                <span className="text-[11px] text-white/20 font-mono w-9 flex-shrink-0 text-right">
                  {event.year}
                </span>
                <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: t.color }} />
                <div className="min-w-0 flex-1">
                  <p className={`text-[13px] truncate ${isActive ? "text-white/85" : "text-white/55"} transition-colors`}>
                    {event.title}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
