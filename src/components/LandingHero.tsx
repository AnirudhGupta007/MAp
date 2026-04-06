import { useState } from "react";
import { motion } from "motion/react";
import { SUGGESTIONS } from "../lib/constants";

interface Props {
  onSearch: (name: string) => void;
  isLoading: boolean;
  error: string | null;
}

export default function LandingHero({ onSearch, isLoading }: Props) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) onSearch(query);
  };

  return (
    <motion.div
      className="h-full w-full gradient-mesh flex flex-col items-center justify-center px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="flex flex-col items-center gap-8 max-w-2xl w-full"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.12 } },
        }}
      >
        {/* Logo / Title */}
        <motion.div
          className="flex flex-col items-center gap-2"
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
        >
          <div className="w-14 h-14 rounded-2xl bg-teal-600 flex items-center justify-center shadow-lg shadow-teal-600/20 mb-2">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="10" r="3" />
              <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 7 8 11.7Z" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-stone-900">
            GeoTimeline
          </h1>
          <p className="text-stone-500 text-lg text-center">
            Explore the journeys of history's greatest figures on an interactive map
          </p>
        </motion.div>

        {/* Search */}
        <motion.form
          onSubmit={handleSubmit}
          className="w-full"
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
        >
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search any historical figure..."
              className="w-full h-14 pl-12 pr-14 rounded-2xl bg-white border border-stone-200 shadow-lg shadow-stone-200/50 text-stone-900 placeholder:text-stone-400 text-lg outline-none transition-all focus:ring-2 focus:ring-teal-400 focus:border-teal-400"
              disabled={isLoading}
            />
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center hover:bg-teal-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </button>
          </div>
        </motion.form>

        {/* Suggestion chips */}
        <motion.div
          className="flex flex-wrap justify-center gap-2"
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
        >
          <span className="text-stone-400 text-sm mr-1 self-center">Try:</span>
          {SUGGESTIONS.slice(0, 6).map((name) => (
            <motion.button
              key={name}
              onClick={() => onSearch(name)}
              className="px-3.5 py-1.5 rounded-full bg-white border border-stone-200 text-stone-600 text-sm font-medium hover:bg-teal-50 hover:border-teal-300 hover:text-teal-700 transition-all shadow-sm"
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              {name}
            </motion.button>
          ))}
        </motion.div>

        {/* How it works */}
        <motion.div
          className="flex gap-8 mt-4"
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
        >
          {[
            { icon: "M21 21l-4.3-4.3M11 19a8 8 0 100-16 8 8 0 000 16z", label: "Search", desc: "Any historical figure" },
            { icon: "M12 21.7C17.3 17 20 13 20 10a8 8 0 10-16 0c0 3 2.7 7 8 11.7Z", label: "Explore", desc: "Events on the map" },
            { icon: "M12 8v4l3 3M3 12a9 9 0 1018 0 9 9 0 00-18 0z", label: "Discover", desc: "Travel through time" },
          ].map((step) => (
            <div key={step.label} className="flex flex-col items-center gap-1.5 text-center">
              <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#78716c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={step.icon} />
                </svg>
              </div>
              <span className="text-sm font-semibold text-stone-700">{step.label}</span>
              <span className="text-xs text-stone-400">{step.desc}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
