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
          className="flex flex-col items-center gap-8 max-w-2xl w-full"
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }}
        >
          {/* Badge */}
          <motion.div variants={fadeUp} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200/50">
              <span className="relative flex h-2 w-2">
                <span className="absolute inset-0 rounded-full bg-teal-400 animate-ping opacity-75" />
                <span className="relative rounded-full h-2 w-2 bg-teal-500" />
              </span>
              <span className="text-sm font-semibold text-teal-700 tracking-wide">AI-Powered Historical Explorer</span>
            </div>
          </motion.div>

          {/* Title */}
          <motion.div
            className="flex flex-col items-center gap-5"
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
              <div className="absolute -inset-1 bg-gradient-to-r from-teal-500/20 via-cyan-400/20 to-emerald-400/20 rounded-[22px] opacity-0 group-focus-within:opacity-100 blur-lg transition-opacity duration-500" />

              <div className="relative flex items-center bg-white rounded-2xl border border-stone-200 shadow-lg shadow-stone-200/40 group-focus-within:border-teal-400 group-focus-within:shadow-teal-100/60 transition-all duration-300">
                <div className="pl-5 text-stone-300">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search any historical figure..."
                  className="flex-1 h-14 px-4 bg-transparent text-stone-900 placeholder:text-stone-400 text-base outline-none"
                  disabled={isLoading}
                />
                <div className="pr-2.5">
                  <button
                    type="submit"
                    disabled={isLoading || !query.trim()}
                    className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center hover:bg-teal-700 active:scale-90 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
            className="flex flex-wrap justify-center gap-2.5"
            variants={fadeUp}
            transition={{ duration: 0.6 }}
          >
            {SUGGESTIONS.slice(0, 6).map((name, i) => (
              <motion.button
                key={name}
                onClick={() => onSearch(name)}
                className="group relative px-4 py-2 rounded-full bg-white/70 backdrop-blur-sm border border-stone-200/60 text-stone-500 text-sm font-medium hover:text-teal-700 hover:border-teal-300 hover:bg-teal-50/80 transition-all duration-300 shadow-sm hover:shadow-md"
                whileHover={{ y: -3, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + i * 0.06, type: "spring", stiffness: 400, damping: 25 }}
              >
                <span className="flex items-center gap-1.5">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-40 group-hover:opacity-70 transition-opacity">
                    <circle cx="12" cy="10" r="3" />
                    <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 7 8 11.7Z" />
                  </svg>
                  {name}
                </span>
              </motion.button>
            ))}
          </motion.div>

          {/* Feature pills - horizontal centered */}
          <motion.div
            className="flex items-center justify-center gap-6 mt-2"
            variants={fadeUp}
            transition={{ duration: 0.6 }}
          >
            {[
              { icon: "M21 21l-4.3-4.3M11 19a8 8 0 100-16 8 8 0 000 16z", label: "Search", color: "#0d9488" },
              { icon: "M12 21.7C17.3 17 20 13 20 10a8 8 0 10-16 0c0 3 2.7 7 8 11.7Z", label: "Explore", color: "#7c3aed" },
              { icon: "M12 6v6l4 2M12 22a10 10 0 100-20 10 10 0 000 20z", label: "Discover", color: "#d97706" },
            ].map((step, i) => (
              <motion.div
                key={step.label}
                className="flex items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 + i * 0.1 }}
              >
                {i > 0 && <div className="w-8 h-px bg-stone-200 -ml-4 mr-[-8px]" />}
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: step.color + "12" }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={step.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={step.icon} />
                  </svg>
                </div>
                <span className="text-sm font-medium text-stone-500">{step.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
