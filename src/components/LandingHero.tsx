import { useState } from "react";
import { motion } from "motion/react";
import { SUGGESTIONS } from "../lib/constants";

interface Props {
  onSearch: (name: string) => void;
  isLoading: boolean;
  error: string | null;
}

const fadeUp = {
  hidden: { opacity: 0, y: 40, filter: "blur(12px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

export default function LandingHero({ onSearch, isLoading }: Props) {
  const [query, setQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) onSearch(query);
  };

  return (
    <motion.div
      className="h-full w-full relative overflow-hidden bg-[#fafaf9]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.97, filter: "blur(8px)" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Floating gradient orbs — larger, more vivid */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="orb-1 absolute -top-[15%] -right-[10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-teal-300/30 via-cyan-200/25 to-emerald-100/15 blur-[80px]" />
        <div className="orb-2 absolute -bottom-[20%] -left-[15%] w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-amber-200/30 via-orange-100/20 to-yellow-50/10 blur-[80px]" />
        <div className="orb-3 absolute top-[15%] left-[25%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-violet-200/25 via-indigo-100/15 to-purple-50/5 blur-[80px]" />
        <div className="orb-4 absolute top-[50%] right-[20%] w-[400px] h-[400px] rounded-full bg-gradient-to-tl from-rose-100/20 via-pink-50/10 to-transparent blur-[80px]" />
      </div>

      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: "radial-gradient(circle, #1c1917 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6">
        <motion.div
          className="flex flex-col items-center gap-6 max-w-2xl w-full"
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
        >
          {/* Live badge */}
          <motion.div variants={fadeUp} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
            <motion.div
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-teal-200/50 bg-white/60 backdrop-blur-md"
              whileHover={{ scale: 1.05, y: -2 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500" />
              </span>
              <span className="text-xs font-semibold tracking-wider uppercase text-teal-700/80">
                AI-Powered Explorer
              </span>
            </motion.div>
          </motion.div>

          {/* Title */}
          <motion.div
            className="flex flex-col items-center gap-4"
            variants={fadeUp}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1
              className="text-[clamp(3rem,8vw,5.2rem)] font-extrabold tracking-[-0.035em] text-center leading-[1.02]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              <span className="text-stone-800">Explore History</span>
              <br />
              <span className="bg-gradient-to-r from-teal-600 via-teal-500 to-emerald-400 bg-clip-text text-transparent">
                On The Map
              </span>
            </h1>
            <p className="text-stone-400 text-base md:text-lg text-center max-w-md leading-relaxed">
              Search any historical figure and watch their life unfold across an interactive timeline and map.
            </p>
          </motion.div>

          {/* Search bar */}
          <motion.form
            onSubmit={handleSubmit}
            className="w-full max-w-xl mt-1"
            variants={fadeUp}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="relative"
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              {/* Glow behind */}
              <motion.div
                className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-teal-400/20 via-cyan-300/15 to-emerald-400/20 blur-2xl"
                animate={{ opacity: searchFocused ? 1 : 0, scale: searchFocused ? 1 : 0.92 }}
                transition={{ duration: 0.5 }}
              />

              <div className={`relative flex items-center rounded-2xl h-[56px] px-5 gap-4 transition-all duration-300 ${
                searchFocused
                  ? "bg-white/95 backdrop-blur-xl ring-2 ring-teal-400/30 shadow-[0_8px_40px_rgba(13,148,136,0.1)]"
                  : "bg-white/80 backdrop-blur-md border border-stone-200/50 shadow-[0_2px_20px_rgba(0,0,0,0.05)]"
              }`}>
                <motion.svg
                  width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke={searchFocused ? "#0d9488" : "#a8a29e"}
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  className="flex-shrink-0 transition-colors duration-300"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </motion.svg>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  placeholder="Search any historical figure..."
                  className="flex-1 h-full bg-transparent text-stone-800 placeholder:text-stone-300 text-base outline-none font-medium"
                  disabled={isLoading}
                />
                <motion.button
                  type="submit"
                  disabled={isLoading || !query.trim()}
                  className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 text-white flex items-center justify-center disabled:opacity-15 disabled:cursor-not-allowed flex-shrink-0 cursor-pointer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.88 }}
                  transition={{ type: "spring", stiffness: 400, damping: 18 }}
                  style={{ boxShadow: "0 4px 14px rgba(13,148,136,0.25)" }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </motion.button>
              </div>
            </motion.div>
          </motion.form>

          {/* Suggestion chips */}
          <motion.div
            className="flex flex-wrap justify-center gap-2"
            variants={fadeUp}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {SUGGESTIONS.slice(0, 6).map((name, i) => (
              <motion.button
                key={name}
                onClick={() => onSearch(name)}
                className="group px-4 py-2 rounded-full bg-white/50 backdrop-blur-sm border border-stone-200/30 text-stone-500 text-sm font-medium hover:text-teal-700 hover:border-teal-300/50 hover:bg-teal-50/50 transition-colors duration-200 cursor-pointer"
                whileHover={{ y: -4, scale: 1.06 }}
                whileTap={{ scale: 0.92 }}
                initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{
                  delay: 0.6 + i * 0.05,
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
              >
                <span className="flex items-center gap-1.5">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-25 group-hover:opacity-50 transition-opacity">
                    <circle cx="12" cy="10" r="3" />
                    <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 7 8 11.7Z" />
                  </svg>
                  {name}
                </span>
              </motion.button>
            ))}
          </motion.div>

          {/* Feature indicators */}
          <motion.div
            className="flex items-center gap-8 mt-3"
            variants={fadeUp}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {[
              { icon: "M21 21l-4.3-4.3M11 19a8 8 0 100-16 8 8 0 000 16z", label: "Search", color: "#0d9488" },
              { icon: "M12 21.7C17.3 17 20 13 20 10a8 8 0 10-16 0c0 3 2.7 7 8 11.7Z", label: "Explore", color: "#8b5cf6" },
              { icon: "M12 6v6l4 2M12 22a10 10 0 100-20 10 10 0 000 20z", label: "Discover", color: "#d97706" },
            ].map((step, i) => (
              <motion.div
                key={step.label}
                className="flex items-center gap-2.5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0 + i * 0.1 }}
              >
                {i > 0 && (
                  <div className="w-6 h-px bg-gradient-to-r from-transparent via-stone-200 to-transparent -ml-6 mr-[-14px]" />
                )}
                <motion.div
                  className="w-9 h-9 rounded-xl flex items-center justify-center backdrop-blur-sm"
                  style={{ backgroundColor: step.color + "08" }}
                  whileHover={{ scale: 1.2, rotate: 8 }}
                  transition={{ type: "spring", stiffness: 400, damping: 12 }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={step.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70">
                    <path d={step.icon} />
                  </svg>
                </motion.div>
                <span className="text-sm font-medium text-stone-400">{step.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
