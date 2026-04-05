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
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        className="relative"
      >
        <div className="flex items-center px-4 py-2.5 rounded-xl bg-[#141414]/80 backdrop-blur-md border border-white/[0.06] hover:border-white/[0.1] focus-within:border-[#5E6AD2]/30 transition-colors duration-200">
          <svg className="w-4 h-4 text-white/25 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3" strokeLinecap="round"/>
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setShowSuggestions(true); }}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Search a historical figure..."
            className="bg-transparent w-full text-white/90 placeholder-white/20 outline-none text-[14px] font-light"
          />
          {isLoading && (
            <div className="w-4 h-4 border-[1.5px] border-white/10 border-t-[#5E6AD2] rounded-full animate-spin ml-2" />
          )}
          {!isLoading && query && (
            <button
              onClick={() => handleSubmit()}
              className="ml-2 px-3 py-1 bg-[#5E6AD2] hover:bg-[#4F5BC0] rounded-md text-white text-[12px] font-medium transition-colors duration-150"
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
              className="absolute top-full mt-1.5 w-full rounded-xl bg-[#141414] border border-white/[0.06] overflow-hidden shadow-xl shadow-black/40"
            >
              {filtered.slice(0, 6).map((name) => (
                <button
                  key={name}
                  onClick={() => handleSubmit(name)}
                  className="w-full text-left px-4 py-2.5 text-[13px] text-white/50 hover:text-white/80 hover:bg-white/[0.03] transition-colors duration-150 border-b border-white/[0.03] last:border-0"
                >
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
