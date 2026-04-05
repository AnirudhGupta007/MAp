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
      setFiltered(suggestions.filter((s) => s.toLowerCase().includes(query.toLowerCase())));
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
    <div className="absolute top-5 left-1/2 -translate-x-1/2 z-[1000] w-full max-w-md px-4">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative"
      >
        <div className="flex items-center px-4 py-2.5 rounded-full bg-white/90 backdrop-blur-xl border border-emerald-100 shadow-lg shadow-emerald-100/20 hover:border-emerald-200 focus-within:border-emerald-300 focus-within:shadow-emerald-200/30 transition-all duration-200">
          <svg className="w-4 h-4 text-emerald-400 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setShowSuggestions(true); }}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Search a historical figure..."
            className="bg-transparent w-full text-emerald-900 placeholder-emerald-300 outline-none text-[14px]"
          />
          {isLoading && (
            <div className="w-4 h-4 border-2 border-emerald-100 border-t-emerald-500 rounded-full animate-spin ml-2" />
          )}
          {!isLoading && query && (
            <button
              onClick={() => handleSubmit()}
              className="ml-2 px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 rounded-full text-white text-[12px] font-medium transition-colors duration-150 shadow-sm"
            >
              Go
            </button>
          )}
        </div>

        <AnimatePresence>
          {showSuggestions && filtered.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full mt-2 w-full rounded-2xl bg-white border border-emerald-100 overflow-hidden shadow-xl shadow-emerald-100/20"
            >
              {filtered.slice(0, 6).map((name) => (
                <button
                  key={name}
                  onClick={() => handleSubmit(name)}
                  className="w-full text-left px-4 py-2.5 text-[13px] text-emerald-700/60 hover:text-emerald-800 hover:bg-emerald-50 transition-colors duration-150 border-b border-emerald-50 last:border-0 flex items-center gap-2"
                >
                  <span className="w-1 h-1 rounded-full bg-emerald-300" />
                  {name}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {showSuggestions && (
        <div className="fixed inset-0 -z-10" onClick={() => setShowSuggestions(false)} />
      )}
    </div>
  );
}
