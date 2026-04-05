import { motion, AnimatePresence } from "framer-motion";
import type { HistoricalEvent, PersonData } from "../types";

interface Props {
  person: PersonData | null;
  activeEvent: HistoricalEvent | null;
  onClose: () => void;
  onEventSelect: (event: HistoricalEvent) => void;
}

const TYPE_META: Record<string, { label: string; color: string; bg: string }> = {
  birth: { label: "Birth", color: "#16a34a", bg: "#f0fdf4" },
  death: { label: "Death", color: "#6b7280", bg: "#f9fafb" },
  battle: { label: "Battle", color: "#dc2626", bg: "#fef2f2" },
  coronation: { label: "Coronation", color: "#d97706", bg: "#fffbeb" },
  meeting: { label: "Meeting", color: "#2563eb", bg: "#eff6ff" },
  journey: { label: "Journey", color: "#7c3aed", bg: "#f5f3ff" },
  achievement: { label: "Achievement", color: "#059669", bg: "#ecfdf5" },
  construction: { label: "Construction", color: "#ea580c", bg: "#fff7ed" },
};

const ease = [0.16, 1, 0.3, 1] as const;

export default function SidePanel({ person, activeEvent, onClose, onEventSelect }: Props) {
  if (!person) return null;
  const sorted = [...person.events].sort((a, b) => a.year - b.year);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 400, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 400, opacity: 0 }}
        transition={{ duration: 0.4, ease }}
        className="absolute top-0 right-0 bottom-0 w-[380px] z-[900] bg-white/95 backdrop-blur-xl border-l border-emerald-100 flex flex-col"
      >
        {/* Header */}
        <div className="p-5 pb-4 border-b border-emerald-50">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-[20px] font-bold text-emerald-950 tracking-tight">{person.person}</h2>
              <p className="text-[12px] text-emerald-600 mt-0.5 font-medium">{person.title}</p>
              <p className="text-[11px] text-emerald-400 mt-0.5 font-mono">{person.born} — {person.died}</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-lg bg-emerald-50 hover:bg-emerald-100 flex items-center justify-center text-emerald-400 hover:text-emerald-600 transition-colors duration-150 text-[13px]">
              ✕
            </button>
          </div>
          <p className="text-[13px] text-emerald-700/45 mt-3 leading-relaxed">{person.summary}</p>
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
              className="mx-4 mt-4 p-4 rounded-xl border border-emerald-100"
              style={{ background: TYPE_META[activeEvent.type]?.bg || "#ecfdf5" }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full" style={{ background: TYPE_META[activeEvent.type]?.color || "#059669" }} />
                <span className="text-[10px] font-semibold tracking-wider uppercase" style={{ color: TYPE_META[activeEvent.type]?.color || "#059669" }}>
                  {TYPE_META[activeEvent.type]?.label || activeEvent.type}
                </span>
                <span className="text-[10px] text-emerald-400 font-mono ml-auto">{activeEvent.year}</span>
                {activeEvent.highlight && (
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200 font-semibold">
                    KEY EVENT
                  </span>
                )}
              </div>
              <h3 className="text-[15px] font-semibold text-emerald-900 mb-1.5 leading-snug">{activeEvent.title}</h3>
              <p className="text-[12px] text-emerald-500 font-mono mb-2">{activeEvent.place}</p>
              <p className="text-[13px] text-emerald-700/50 leading-relaxed">{activeEvent.description}</p>

              {activeEvent.people.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {activeEvent.people.map((p) => (
                    <span key={p} className="text-[10px] px-2.5 py-1 rounded-full bg-white text-emerald-600 border border-emerald-100 font-medium">
                      {p}
                    </span>
                  ))}
                </div>
              )}

              {activeEvent.links.length > 0 && (
                <div className="mt-3">
                  {activeEvent.links.map((link, i) => (
                    <a key={i} href={link} target="_blank" rel="noopener noreferrer"
                      className="text-[11px] text-emerald-500 hover:text-emerald-700 font-medium transition-colors">
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
          <p className="text-[10px] tracking-[0.12em] uppercase text-emerald-300 mb-2 font-semibold">
            {sorted.length} Events
          </p>
          {sorted.map((event) => {
            const isActive = activeEvent?.id === event.id;
            const t = TYPE_META[event.type] || { label: event.type, color: "#059669", bg: "#ecfdf5" };
            return (
              <button
                key={event.id}
                onClick={() => onEventSelect(event)}
                className={`w-full text-left px-3 py-3 rounded-xl mb-1 transition-all duration-200 flex items-center gap-3 ${
                  isActive
                    ? "bg-emerald-50 border border-emerald-200 shadow-sm"
                    : "hover:bg-emerald-50/50 border border-transparent"
                }`}
              >
                <span className="text-[11px] text-emerald-400 font-mono w-9 flex-shrink-0 text-right">
                  {event.year}
                </span>
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: t.color }} />
                <div className="min-w-0 flex-1">
                  <p className={`text-[13px] truncate transition-colors ${isActive ? "text-emerald-900 font-medium" : "text-emerald-700/60"}`}>
                    {event.title}
                  </p>
                </div>
                {event.highlight && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />}
              </button>
            );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
