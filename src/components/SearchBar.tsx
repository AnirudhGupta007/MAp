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
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[900] w-full max-w-sm px-4">
      <form onSubmit={handleSubmit} className="relative">
        <div className={`flex items-center gap-3 bg-white/95 backdrop-blur-md rounded-full h-11 px-4 shadow-lg transition-all ${focused ? "ring-2 ring-teal-400 shadow-xl" : "border border-stone-200/80"}`}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a8a29e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 200)}
            placeholder="Search historical figure..."
            className="flex-1 bg-transparent text-stone-900 placeholder:text-stone-400 text-sm outline-none"
            disabled={isLoading}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="text-stone-300 hover:text-stone-500 transition-colors flex-shrink-0"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          )}
        </div>

        <AnimatePresence>
          {focused && filtered.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full mt-2 w-full bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-stone-100 overflow-hidden"
            >
              {filtered.map((name) => (
                <button
                  key={name}
                  type="button"
                  onMouseDown={() => handleSelect(name)}
                  className="w-full text-left px-4 py-2.5 text-sm text-stone-600 hover:bg-teal-50 hover:text-teal-700 transition-colors flex items-center gap-3"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-stone-300 flex-shrink-0">
                    <circle cx="12" cy="10" r="3" />
                    <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 7 8 11.7Z" />
                  </svg>
                  {name}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}
