import { useState } from "react";
import { motion } from "motion/react";
import { SUGGESTIONS } from "../lib/constants";

interface Props {
  onSearch: (name: string) => void;
  isLoading: boolean;
  error: string | null;
}

const fadeUp = {
  hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

export default function LandingHero({ onSearch, isLoading }: Props) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) onSearch(query);
  };

  return (
    <motion.div
      className="h-full w-full relative overflow-hidden bg-[#fafaf9]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.5 }}
    >
      {/* Floating gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="orb-1 absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-teal-200/40 to-cyan-100/20 blur-3xl" />
        <div className="orb-2 absolute bottom-[-15%] left-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-amber-100/40 to-orange-50/20 blur-3xl" />
        <div className="orb-3 absolute top-[20%] left-[30%] w-[400px] h-[400px] rounded-full bg-gradient-to-br from-violet-100/30 to-indigo-50/10 blur-3xl" />
      </div>

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle, #1c1917 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6">
        <motion.div
          className="flex flex-col items-center gap-10 max-w-2xl w-full"
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }}
        >
          {/* Badge */}
          <motion.div variants={fadeUp} transition={{ duration: 0.6 }}>
            <div className="relative inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-stone-200/60 shadow-sm backdrop-blur-sm">
              <div className="absolute inset-0 rounded-full shimmer-badge" />
              <span className="relative w-2 h-2 rounded-full bg-teal-500">
                <span className="absolute inset-0 rounded-full bg-teal-400 animate-ping" />
              </span>
              <span className="relative text-sm font-medium text-stone-600">AI-Powered Historical Explorer</span>
            </div>
          </motion.div>

          {/* Title */}
          <motion.div
            className="flex flex-col items-center gap-4"
            variants={fadeUp}
            transition={{ duration: 0.6 }}
          >
            <h1
              className="text-6xl md:text-7xl font-extrabold tracking-tight text-center leading-[1.05]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              <span className="text-stone-900">Explore History</span>
              <br />
              <span className="bg-gradient-to-r from-teal-600 via-teal-500 to-emerald-500 bg-clip-text text-transparent">
                On The Map
              </span>
            </h1>
            <p className="text-stone-500 text-lg md:text-xl text-center max-w-md leading-relaxed">
              Search any historical figure and watch their life unfold across an interactive timeline and map.
            </p>
          </motion.div>

          {/* Search bar */}
          <motion.form
            onSubmit={handleSubmit}
            className="w-full max-w-xl"
            variants={fadeUp}
            transition={{ duration: 0.6 }}
          >
            <div className="relative group">
              {/* Glow effect behind */}
              <div className="absolute -inset-1 bg-gradient-to-r from-teal-500/20 via-cyan-400/20 to-emerald-400/20 rounded-[20px] opacity-0 group-focus-within:opacity-100 blur-lg transition-opacity duration-500" />

              <div className="relative flex items-center bg-white rounded-2xl border border-stone-200 shadow-lg shadow-stone-200/40 group-focus-within:border-teal-400 group-focus-within:shadow-teal-100/60 transition-all duration-300">
                <div className="pl-5 pr-2 text-stone-400">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search any historical figure..."
                  className="flex-1 h-14 bg-transparent text-stone-900 placeholder:text-stone-400 text-base outline-none"
                  disabled={isLoading}
                />
                <div className="pr-2">
                  <button
                    type="submit"
                    disabled={isLoading || !query.trim()}
                    className="h-10 px-5 rounded-xl bg-teal-600 text-white text-sm font-semibold flex items-center gap-1.5 hover:bg-teal-700 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Explore
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </motion.form>

          {/* Suggestion chips */}
          <motion.div
            className="flex flex-wrap justify-center gap-2"
            variants={fadeUp}
            transition={{ duration: 0.6 }}
          >
            {SUGGESTIONS.slice(0, 6).map((name, i) => (
              <motion.button
                key={name}
                onClick={() => onSearch(name)}
                className="px-4 py-2 rounded-xl bg-white/70 backdrop-blur-sm border border-stone-200/60 text-stone-600 text-sm font-medium hover:bg-teal-50 hover:border-teal-300 hover:text-teal-700 transition-all shadow-sm"
                whileHover={{ y: -3, scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.05 }}
              >
                {name}
              </motion.button>
            ))}
          </motion.div>

          {/* Feature cards */}
          <motion.div
            className="flex gap-4 mt-2 w-full max-w-lg"
            variants={fadeUp}
            transition={{ duration: 0.6 }}
          >
            {[
              {
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                ),
                label: "Search",
                desc: "Any figure in history",
                gradient: "from-teal-500 to-cyan-500",
                bg: "bg-teal-50",
              },
              {
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="10" r="3" />
                    <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 7 8 11.7Z" />
                  </svg>
                ),
                label: "Explore",
                desc: "Events on the map",
                gradient: "from-violet-500 to-purple-500",
                bg: "bg-violet-50",
              },
              {
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                ),
                label: "Discover",
                desc: "Travel through time",
                gradient: "from-amber-500 to-orange-500",
                bg: "bg-amber-50",
              },
            ].map((step, i) => (
              <motion.div
                key={step.label}
                className="flex-1 group relative p-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-stone-200/50 hover:border-stone-300 shadow-sm hover:shadow-md transition-all cursor-default"
                whileHover={{ y: -4 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 + i * 0.1 }}
              >
                <div className={`w-10 h-10 rounded-xl ${step.bg} flex items-center justify-center mb-3`}>
                  <div className={`bg-gradient-to-br ${step.gradient} bg-clip-text`}>
                    <div className="text-teal-600" style={{ color: step.gradient.includes("violet") ? "#7c3aed" : step.gradient.includes("amber") ? "#d97706" : "#0d9488" }}>
                      {step.icon}
                    </div>
                  </div>
                </div>
                <div className="text-sm font-bold text-stone-800 mb-0.5" style={{ fontFamily: "var(--font-display)" }}>
                  {step.label}
                </div>
                <div className="text-xs text-stone-500 leading-relaxed">{step.desc}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
