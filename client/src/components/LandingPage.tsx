import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useState, useRef } from "react";

interface Props {
  onEnterApp: () => void;
}

const ease = [0.16, 1, 0.3, 1] as const;

const FIGURES = [
  { name: "Shivaji Maharaj", era: "1630–1680", events: 10, tag: "Maratha Empire", emoji: "⚔️" },
  { name: "Akbar", era: "1542–1605", events: 9, tag: "Mughal Dynasty", emoji: "👑" },
  { name: "Rani Lakshmibai", era: "1828–1858", events: 10, tag: "Indian Rebellion", emoji: "🗡️" },
  { name: "Aurangzeb", era: "1618–1707", events: 10, tag: "Mughal Dynasty", emoji: "🏰" },
  { name: "Ashoka", era: "304–232 BCE", events: 9, tag: "Maurya Dynasty", emoji: "☸️" },
  { name: "Maharana Pratap", era: "1540–1597", events: 10, tag: "Rajput Kingdom", emoji: "🐎" },
];

function InteractiveCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-100, 100], [8, -8]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-8, 8]), { stiffness: 300, damping: 30 });

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function LandingPage({ onEnterApp }: Props) {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#ECFDF5] via-[#F0FDF4] to-white selection:bg-emerald-200/50 overflow-hidden">

      {/* Green gradient mesh background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[400px] -right-[300px] w-[900px] h-[900px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(52,211,153,0.12), transparent 65%)" }} />
        <div className="absolute top-[30%] -left-[200px] w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(16,185,129,0.08), transparent 65%)" }} />
        <div className="absolute -bottom-[300px] right-[20%] w-[700px] h-[700px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(5,150,105,0.06), transparent 65%)" }} />
      </div>

      {/* ═══ NAVBAR ═══ */}
      <motion.nav
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
        className="sticky top-0 z-50 border-b border-emerald-100/50"
        style={{ background: "rgba(240,253,244,0.8)", backdropFilter: "blur(20px)" }}
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between px-6 h-14">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-sm shadow-emerald-200">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="12" cy="10" r="3"/><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
              </svg>
            </div>
            <span className="text-[15px] font-semibold text-emerald-950 tracking-tight">GeoTimeline</span>
          </div>
          <button
            onClick={onEnterApp}
            className="h-9 px-5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-[13px] font-medium transition-all duration-200 shadow-sm shadow-emerald-200 hover:shadow-md hover:shadow-emerald-200"
          >
            Open App →
          </button>
        </div>
      </motion.nav>

      {/* ═══ HERO ═══ */}
      <section className="relative pt-24 md:pt-32 pb-8 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1, ease }}
            className="inline-flex items-center gap-2 h-8 px-4 rounded-full bg-white border border-emerald-100 shadow-sm mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[12px] tracking-wide text-emerald-700 font-medium">AI-Powered Historical Explorer</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease }}
            className="text-[48px] md:text-[64px] lg:text-[72px] font-extrabold tracking-[-0.04em] leading-[1.05]"
          >
            <span className="text-emerald-950">Explore history</span>
            <br />
            <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
              on the map
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease }}
            className="text-[17px] md:text-[18px] text-emerald-800/50 mt-5 leading-[1.7] max-w-xl mx-auto"
          >
            Search any historical figure. AI generates their journey —
            battles, coronations, meetings — on an interactive map.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55, ease }}
            className="mt-9 flex items-center justify-center gap-3"
          >
            <button
              onClick={onEnterApp}
              className="h-12 px-8 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white text-[15px] font-semibold transition-all duration-300 shadow-lg shadow-emerald-200/50 hover:shadow-xl hover:shadow-emerald-300/50 hover:scale-[1.02] active:scale-[0.98]"
            >
              Start Exploring
            </button>
            <a
              href="#features"
              className="h-12 px-6 rounded-full bg-white border border-emerald-100 text-[14px] text-emerald-700 font-medium transition-all duration-200 flex items-center hover:border-emerald-200 hover:shadow-sm"
            >
              Learn more ↓
            </a>
          </motion.div>
        </div>

        {/* ═══ INTERACTIVE MAP PREVIEW ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7, ease }}
          className="mt-16 max-w-5xl mx-auto"
        >
          <InteractiveCard className="rounded-2xl overflow-hidden border border-emerald-100 shadow-2xl shadow-emerald-100/30 bg-white">
            <div className="relative aspect-[16/9]"
              style={{ background: "linear-gradient(135deg, #D1FAE5 0%, #ECFDF5 30%, #F0FDF4 60%, #D1FAE5 100%)" }}
            >
              {/* Grid */}
              <div className="absolute inset-0 opacity-[0.08]"
                style={{
                  backgroundImage: "linear-gradient(#059669 1px, transparent 1px), linear-gradient(90deg, #059669 1px, transparent 1px)",
                  backgroundSize: "60px 60px",
                }} />

              {/* Continent-like shapes */}
              <div className="absolute top-[30%] left-[32%] w-44 h-36 rounded-[40%] bg-emerald-300/15 blur-sm" />
              <div className="absolute top-[22%] left-[52%] w-28 h-24 rounded-[35%] bg-emerald-400/10 blur-sm" />
              <div className="absolute top-[55%] left-[26%] w-20 h-28 rounded-[40%] bg-emerald-300/10 blur-sm" />

              {/* Animated markers */}
              {[
                { left: "32%", top: "42%", delay: 0.8, label: "Shivneri", highlight: false },
                { left: "44%", top: "56%", delay: 1.0, label: "Pratapgad", highlight: false },
                { left: "55%", top: "38%", delay: 1.2, label: "Agra", highlight: true },
                { left: "38%", top: "50%", delay: 1.4, label: "Raigad", highlight: false },
                { left: "62%", top: "48%", delay: 1.6, label: "Surat", highlight: false },
              ].map((dot, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: dot.delay, duration: 0.5, ease, type: "spring", bounce: 0.4 }}
                  className="absolute flex flex-col items-center group cursor-pointer"
                  style={{ left: dot.left, top: dot.top }}
                >
                  <motion.div
                    whileHover={{ scale: 1.8 }}
                    className="w-3 h-3 rounded-full border-2 border-white shadow-md relative"
                    style={{
                      background: dot.highlight ? "#F59E0B" : "#059669",
                      boxShadow: `0 0 12px ${dot.highlight ? "rgba(245,158,11,0.4)" : "rgba(5,150,105,0.3)"}`,
                    }}
                  >
                    <span className="absolute inset-0 rounded-full animate-ping opacity-25"
                      style={{ background: dot.highlight ? "#F59E0B" : "#10B981" }} />
                  </motion.div>
                  <span className="mt-1 text-[9px] font-medium text-emerald-700/40 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {dot.label}
                  </span>
                </motion.div>
              ))}

              {/* Dashed connections */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <motion.line x1="32%" y1="42%" x2="44%" y2="56%" stroke="#10B981" strokeWidth="1" strokeDasharray="4 4" opacity="0.2"
                  initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.2 }} transition={{ delay: 1.5, duration: 1 }} />
                <motion.line x1="44%" y1="56%" x2="55%" y2="38%" stroke="#10B981" strokeWidth="1" strokeDasharray="4 4" opacity="0.2"
                  initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.2 }} transition={{ delay: 1.8, duration: 1 }} />
                <motion.line x1="55%" y1="38%" x2="38%" y2="50%" stroke="#10B981" strokeWidth="1" strokeDasharray="4 4" opacity="0.2"
                  initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.2 }} transition={{ delay: 2.1, duration: 1 }} />
              </svg>

              {/* Mock search bar */}
              <div className="absolute top-5 left-1/2 -translate-x-1/2">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6, ease }}
                  className="flex items-center gap-2 h-9 px-4 rounded-full bg-white/90 backdrop-blur border border-emerald-100 shadow-lg shadow-emerald-100/20"
                >
                  <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3" strokeLinecap="round"/></svg>
                  <span className="text-[12px] text-emerald-400">Search "Shivaji Maharaj"</span>
                </motion.div>
              </div>

              {/* Mock side panel hint */}
              <motion.div
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 2, duration: 0.6, ease }}
                className="absolute top-12 right-4 w-48 rounded-xl bg-white/90 backdrop-blur border border-emerald-100 p-3 shadow-lg"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span className="text-[9px] font-semibold text-amber-600 uppercase tracking-wider">Featured</span>
                </div>
                <p className="text-[11px] font-semibold text-emerald-900">Visit to Agra & Escape</p>
                <p className="text-[9px] text-emerald-600/50 mt-0.5">1666 · Agra, UP</p>
              </motion.div>
            </div>
          </InteractiveCard>
        </motion.div>
      </section>

      {/* ═══ HOW IT WORKS — INTERACTIVE ═══ */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease }}
            className="text-center mb-14"
          >
            <span className="text-[11px] font-semibold tracking-[0.12em] uppercase text-emerald-500 mb-2 block">How it works</span>
            <h2 className="text-[36px] md:text-[42px] font-bold tracking-[-0.03em] text-emerald-950">
              Three simple steps
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              {
                step: "01",
                title: "Search",
                desc: "Type any historical figure. AI fetches their complete life journey in seconds.",
                icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
                color: "from-emerald-50 to-teal-50",
                iconColor: "text-emerald-500",
              },
              {
                step: "02",
                title: "Explore the Map",
                desc: "Events appear as glowing markers connected by animated paths. Fly between them.",
                icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>,
                color: "from-green-50 to-emerald-50",
                iconColor: "text-green-500",
              },
              {
                step: "03",
                title: "Discover Details",
                desc: "Click events for rich context — people involved, places, and historical links.",
                icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>,
                color: "from-teal-50 to-cyan-50",
                iconColor: "text-teal-500",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5, ease }}
                onMouseEnter={() => setActiveStep(i)}
                className={`relative p-6 rounded-2xl border transition-all duration-300 cursor-default group ${
                  activeStep === i
                    ? "bg-gradient-to-br " + item.color + " border-emerald-200 shadow-lg shadow-emerald-100/30 scale-[1.02]"
                    : "bg-white border-emerald-50 hover:border-emerald-100 hover:shadow-md hover:shadow-emerald-50"
                }`}
              >
                <div className="absolute top-5 right-5 text-[11px] font-mono text-emerald-300 font-medium">{item.step}</div>
                <div className={`${item.iconColor} mb-4 transition-transform duration-300 ${activeStep === i ? "scale-110" : ""}`}>
                  {item.icon}
                </div>
                <h3 className="text-[16px] font-semibold text-emerald-900 mb-1.5">{item.title}</h3>
                <p className="text-[13px] text-emerald-700/45 leading-[1.7]">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FIGURES ═══ */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease }}
            className="text-center mb-14"
          >
            <span className="text-[11px] font-semibold tracking-[0.12em] uppercase text-amber-500 mb-2 block">Ready to explore</span>
            <h2 className="text-[36px] md:text-[42px] font-bold tracking-[-0.03em] text-emerald-950">
              Pick a legend
            </h2>
            <p className="text-[15px] text-emerald-800/40 mt-3">
              Pre-cached and instant. Or search anyone — AI generates it live.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {FIGURES.map((fig, i) => (
              <motion.button
                key={fig.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.5, ease }}
                onClick={onEnterApp}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group text-left p-5 rounded-2xl bg-white border border-emerald-50 hover:border-emerald-200 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-100/30"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{fig.emoji}</span>
                  <svg className="w-4 h-4 text-emerald-200 group-hover:text-emerald-400 transition-all duration-300 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </div>
                <p className="text-[15px] font-semibold text-emerald-900 group-hover:text-emerald-700 transition-colors">
                  {fig.name}
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[11px] font-mono text-emerald-400">{fig.era}</span>
                  <span className="w-1 h-1 rounded-full bg-emerald-200" />
                  <span className="text-[11px] text-emerald-500/50">{fig.tag}</span>
                </div>
                <div className="mt-3 flex items-center gap-1">
                  {Array.from({ length: Math.min(fig.events, 8) }).map((_, j) => (
                    <motion.div
                      key={j}
                      className="w-1.5 h-1.5 rounded-full bg-emerald-200 group-hover:bg-emerald-300 transition-colors"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ delay: 0.1 + j * 0.03 }}
                    />
                  ))}
                  <span className="text-[10px] text-emerald-300 ml-1">{fig.events}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ BOTTOM CTA ═══ */}
      <section className="py-32 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="p-12 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 relative overflow-hidden shadow-2xl shadow-emerald-200/40">
            {/* Pattern overlay */}
            <div className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }} />
            <div className="relative">
              <h2 className="text-[32px] md:text-[40px] font-bold tracking-[-0.03em] text-white leading-[1.15]">
                Ready to explore<br />the past?
              </h2>
              <p className="text-[15px] text-white/60 mt-3">
                Dive into centuries of history with a single search.
              </p>
              <button
                onClick={onEnterApp}
                className="mt-8 h-12 px-8 rounded-full bg-white text-emerald-700 text-[15px] font-semibold transition-all duration-300 hover:shadow-lg hover:scale-[1.03] active:scale-[0.98]"
              >
                Launch GeoTimeline →
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t border-emerald-100 py-6 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="text-[11px] text-emerald-400 font-mono">GeoTimeline v1.0</span>
          <span className="text-[11px] text-emerald-300">Built with AI</span>
        </div>
      </footer>
    </div>
  );
}
