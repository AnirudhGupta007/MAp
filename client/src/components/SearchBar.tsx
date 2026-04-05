import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

interface Props {
  onSearch: (name: string) => void;
  isLoading: boolean;
}

export default function SearchBar({ onSearch, isLoading }: Props) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filtered, setFiltered] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    axios.get("/api/suggestions").then((res) => setSuggestions(res.data));
  }, []);

  useEffect(() => {
    if (query.length > 0) {
      setFiltered(
        suggestions.filter((s) =>
          s.toLowerCase().includes(query.toLowerCase())
        )
      );
    } else {
      setFiltered(suggestions);
    }
  }, [query, suggestions]);

  const handleSubmit = (name?: string) => {
    const searchName = name || query;
    if (!searchName.trim()) return;
    setQuery(searchName);
    setShowSuggestions(false);
    onSearch(searchName.trim());
  };

  return (
    <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[1000] w-full max-w-lg px-4">
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative"
      >
        {/* Search input */}
        <div className="glass rounded-2xl overflow-hidden transition-all duration-300 focus-within:border-[rgba(0,212,255,0.3)] focus-within:shadow-[0_0_30px_rgba(0,212,255,0.1)]">
          <div className="flex items-center px-5 py-3.5">
            {/* Search icon */}
            <svg
              className="w-5 h-5 text-[#00d4ff] mr-3 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Search a historical figure..."
              className="bg-transparent w-full text-white/90 placeholder-white/25 outline-none text-[15px] font-light tracking-wide"
            />
            {isLoading && (
              <div className="w-5 h-5 border-2 border-[#00d4ff]/30 border-t-[#00d4ff] rounded-full animate-spin ml-3" />
            )}
            {!isLoading && query && (
              <button
                onClick={() => handleSubmit()}
                className="ml-3 px-4 py-1.5 bg-[#00d4ff]/10 hover:bg-[#00d4ff]/20 border border-[#00d4ff]/20 rounded-xl text-[#00d4ff] text-xs font-medium transition-all duration-200"
              >
                Explore
              </button>
            )}
          </div>
        </div>

        {/* Suggestions dropdown */}
        <AnimatePresence>
          {showSuggestions && filtered.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full mt-2 w-full glass rounded-xl overflow-hidden"
            >
              {filtered.slice(0, 6).map((name, i) => (
                <motion.button
                  key={name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => handleSubmit(name)}
                  className="w-full text-left px-5 py-3 text-sm text-white/70 hover:text-white hover:bg-[#00d4ff]/8 transition-all duration-200 flex items-center gap-3 border-b border-white/[0.03] last:border-0"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00d4ff]/40" />
                  {name}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Click outside to close */}
      {showSuggestions && (
        <div
          className="fixed inset-0 -z-10"
          onClick={() => setShowSuggestions(false)}
        />
      )}
    </div>
  );
}
