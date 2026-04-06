import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SUGGESTIONS } from "../lib/constants";

interface Props {
  onSearch: (name: string) => void;
  isLoading: boolean;
}

export default function SearchBar({ onSearch, isLoading }: Props) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [filtered, setFiltered] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (query.trim()) {
      setFiltered(
        SUGGESTIONS.filter((s) =>
          s.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5)
      );
    } else {
      setFiltered(SUGGESTIONS.slice(0, 5));
    }
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
      setFocused(false);
      inputRef.current?.blur();
    }
  };

  const handleSelect = (name: string) => {
    setQuery(name);
    setFocused(false);
    onSearch(name);
  };

  return (
    <motion.div
      className="absolute top-4 left-1/2 -translate-x-1/2 z-[900] w-full max-w-sm px-4"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.1 }}
    >
      <form onSubmit={handleSubmit} className="relative">
        {/* Glow effect */}
        <motion.div
          className="absolute -inset-1.5 rounded-[22px] bg-gradient-to-r from-teal-400/15 via-cyan-300/10 to-emerald-400/15 blur-xl"
          animate={{ opacity: focused ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        <motion.div
          className={`relative flex items-center gap-3 rounded-[18px] h-11 px-4 transition-all duration-300 ${
            focused
              ? "glass-strong ring-2 ring-teal-400/25 shadow-[0_8px_30px_rgba(13,148,136,0.1)]"
              : "glass shadow-[0_2px_16px_rgba(0,0,0,0.05)]"
          }`}
          layout
        >
          <motion.svg
            width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke={focused ? "#0d9488" : "#a8a29e"}
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className="flex-shrink-0 transition-colors duration-200"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </motion.svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 200)}
            placeholder="Search historical figure..."
            className="flex-1 bg-transparent text-stone-800 placeholder:text-stone-350 text-sm outline-none font-medium"
            disabled={isLoading}
          />
          {query && (
            <motion.button
              type="button"
              onClick={() => setQuery("")}
              className="text-stone-300 hover:text-stone-500 transition-colors flex-shrink-0"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileTap={{ scale: 0.8 }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </motion.button>
          )}
        </motion.div>

        <AnimatePresence>
          {focused && filtered.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="absolute top-full mt-2.5 w-full glass-strong rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.08)] overflow-hidden"
            >
              {filtered.map((name, i) => (
                <motion.button
                  key={name}
                  type="button"
                  onMouseDown={() => handleSelect(name)}
                  className="w-full text-left px-4 py-2.5 text-sm text-stone-500 hover:bg-teal-50/60 hover:text-teal-700 transition-all duration-150 flex items-center gap-3 font-medium"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <div className="w-6 h-6 rounded-lg bg-stone-50 flex items-center justify-center flex-shrink-0">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-stone-300">
                      <circle cx="12" cy="10" r="3" />
                      <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 7 8 11.7Z" />
                    </svg>
                  </div>
                  {name}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </motion.div>
  );
}
