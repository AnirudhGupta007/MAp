import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";

interface Props {
  onEnterApp: () => void;
}

const FEATURES = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
      </svg>
    ),
    title: "Intelligent Search",
    desc: "Search any historical figure by name. AI fetches their complete life journey — birth to death, battles to coronations.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
        <circle cx="12" cy="9" r="2.5" />
      </svg>
    ),
    title: "Living Map",
    desc: "Events appear as glowing markers on a dark cinematic map. Watch paths trace across continents.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    ),
    title: "Time Travel",
    desc: "Press play and the timeline animates — flying you from event to event across years and geography.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" />
      </svg>
    ),
    title: "Deep Context",
    desc: "Every event opens a rich detail panel — descriptions, people involved, Wikipedia references, and more.",
  },
];

const FIGURES = [
  { name: "Shivaji Maharaj", era: "1630–1680", title: "Founder of the Maratha Empire", gradient: "from-amber-500/10 to-orange-500/5" },
  { name: "Akbar", era: "1542–1605", title: "Akbar the Great", gradient: "from-emerald-500/10 to-teal-500/5" },
  { name: "Rani Lakshmibai", era: "1828–1858", title: "The Queen of Jhansi", gradient: "from-rose-500/10 to-pink-500/5" },
  { name: "Aurangzeb", era: "1618–1707", title: "Sixth Mughal Emperor", gradient: "from-blue-500/10 to-indigo-500/5" },
  { name: "Ashoka", era: "304–232 BCE", title: "Maurya Emperor", gradient: "from-violet-500/10 to-purple-500/5" },
  { name: "Maharana Pratap", era: "1540–1597", title: "King of Mewar", gradient: "from-cyan-500/10 to-sky-500/5" },
];

// Animated aurora background
function AuroraBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Deep base */}
      <div className="absolute inset-0 bg-[#030014]" />

      {/* Aurora blobs */}
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full"
        style={{
          left: "10%",
          top: "-10%",
          background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
        animate={{
          x: [0, 80, -40, 0],
          y: [0, 40, -30, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{
          right: "5%",
          top: "20%",
          background: "radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%)",
          filter: "blur(90px)",
        }}
        animate={{
          x: [0, -60, 30, 0],
          y: [0, -50, 40, 0],
          scale: [1, 0.85, 1.15, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full"
        style={{
          left: "40%",
          bottom: "10%",
          background: "radial-gradient(circle, rgba(56,189,248,0.08) 0%, transparent 70%)",
          filter: "blur(70px)",
        }}
        animate={{
          x: [0, 50, -60, 0],
          y: [0, -40, 20, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full"
        style={{
          left: "60%",
          top: "5%",
          background: "radial-gradient(circle, rgba(251,191,36,0.06) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
        animate={{
          x: [0, -30, 50, 0],
          y: [0, 60, -20, 0],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Noise grain overlay */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      }} />
    </div>
  );
}

// Floating stars
function Stars() {
  const stars = Array.from({ length: 80 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 1.5 + 0.5,
    delay: Math.random() * 5,
    duration: Math.random() * 3 + 2,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none">
      {stars.map((s) => (
        <motion.div
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
          }}
          animate={{ opacity: [0.1, 0.6, 0.1] }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export default function LandingPage({ onEnterApp }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95]);

  // Typing effect
  const [displayText, setDisplayText] = useState("");
  const fullText = "Where every place tells a story";
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i <= fullText.length) { setDisplayText(fullText.slice(0, i)); i++; }
      else clearInterval(interval);
    }, 45);
    return () => clearInterval(interval);
  }, []);

  return (
    <div ref={containerRef} className="relative" style={{ height: "380vh" }}>
      <AuroraBackground />
      <Stars />

      {/* ═══ HERO ═══ */}
      <motion.section
        className="fixed inset-0 z-10 flex items-center justify-center"
        style={{ opacity: heroOpacity, scale: heroScale }}
      >
        <div className="text-center px-6 max-w-5xl">
          {/* Pill badge */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm mb-10"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
            </span>
            <span className="text-[11px] tracking-[0.15em] uppercase text-white/50 font-medium">
              AI-Powered Historical Explorer
            </span>
          </motion.div>

          {/* Main title - Playfair Display serif */}
          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <span
              className="block text-7xl md:text-8xl lg:text-[7rem] font-semibold tracking-tight leading-[0.9] text-white/95"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              History,
            </span>
            <span
              className="block text-7xl md:text-8xl lg:text-[7rem] font-semibold tracking-tight leading-[0.9] mt-2"
              style={{
                fontFamily: "'Playfair Display', serif",
                background: "linear-gradient(135deg, #818cf8 0%, #c084fc 40%, #f0abfc 70%, #fbbf24 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Mapped.
            </span>
          </motion.h1>

          {/* Subtitle with typing */}
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="text-lg md:text-xl text-white/30 mt-8 font-light tracking-wide"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {displayText}
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="text-indigo-400 ml-0.5"
            >
              |
            </motion.span>
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="mt-12 flex items-center justify-center gap-5"
          >
            <button
              onClick={onEnterApp}
              className="group relative px-8 py-3.5 rounded-full font-medium text-sm tracking-wide overflow-hidden transition-all duration-500 hover:shadow-[0_0_40px_rgba(129,140,248,0.3)]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-90 group-hover:opacity-100 transition-opacity" />
              <span className="relative z-10 text-white flex items-center gap-2">
                Start Exploring
                <motion.span
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >→</motion.span>
              </span>
            </button>

            <a
              href="#features"
              className="px-6 py-3.5 rounded-full text-white/30 hover:text-white/60 text-sm font-light tracking-wide transition-colors border border-white/[0.05] hover:border-white/[0.1] backdrop-blur-sm"
            >
              See how it works
            </a>
          </motion.div>

          {/* Scroll hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5 }}
            className="mt-20"
          >
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="flex flex-col items-center gap-3"
            >
              <div className="w-5 h-8 rounded-full border border-white/10 flex items-start justify-center p-1.5">
                <motion.div
                  className="w-1 h-1.5 rounded-full bg-white/30"
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* ═══ FEATURES ═══ */}
      <section id="features" className="relative z-20" style={{ marginTop: "100vh", paddingTop: "12vh" }}>
        <div className="max-w-5xl mx-auto px-6">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[11px] tracking-[0.25em] uppercase text-indigo-400/50 text-center mb-3 font-medium"
          >
            How it works
          </motion.p>

          <motion.h2
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-5xl font-semibold text-center text-white/90 mb-20"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Four steps to discovery
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ y: 40, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="group relative p-7 rounded-2xl border border-white/[0.04] bg-white/[0.015] hover:bg-white/[0.03] backdrop-blur-sm transition-all duration-500"
              >
                {/* Number */}
                <span className="absolute top-6 right-7 text-[80px] font-bold text-white/[0.02] leading-none"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {i + 1}
                </span>

                <div className="text-indigo-400/70 mb-4">{f.icon}</div>
                <h3 className="text-lg font-semibold text-white/85 mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {f.title}
                </h3>
                <p className="text-white/30 text-sm leading-relaxed font-light">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FIGURES ═══ */}
      <section className="relative z-20 py-28">
        <div className="max-w-5xl mx-auto px-6">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[11px] tracking-[0.25em] uppercase text-purple-400/50 text-center mb-3 font-medium"
          >
            Ready to explore
          </motion.p>

          <motion.h2
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-5xl font-semibold text-center text-white/90 mb-16"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Legends await
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FIGURES.map((fig, i) => (
              <motion.button
                key={fig.name}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                onClick={onEnterApp}
                className={`group relative p-6 rounded-2xl border border-white/[0.04] bg-gradient-to-br ${fig.gradient} hover:border-white/[0.08] transition-all duration-500 text-left backdrop-blur-sm overflow-hidden`}
              >
                {/* Shine effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%]"
                  style={{ transition: "transform 0.7s ease, opacity 0.3s ease" }}
                />

                <p className="text-white/85 font-semibold text-base group-hover:text-white transition-colors"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {fig.name}
                </p>
                <p className="text-white/20 text-[11px] mt-1.5 font-mono tracking-wider">{fig.era}</p>
                <p className="text-white/30 text-xs mt-2 font-light">{fig.title}</p>

                <div className="absolute bottom-5 right-5 w-8 h-8 rounded-full border border-white/[0.06] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:border-white/[0.12]">
                  <span className="text-white/50 text-xs">→</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="relative z-20 py-32">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2
              className="text-5xl md:text-6xl font-semibold text-white/90 mb-5"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Begin your journey
            </h2>
            <p className="text-white/25 text-base font-light mb-12 max-w-md mx-auto leading-relaxed">
              Search any historical figure. Watch their story unfold across the map. Discover the events that shaped our world.
            </p>

            <button
              onClick={onEnterApp}
              className="group relative inline-flex items-center gap-3 px-10 py-4 rounded-full font-medium tracking-wide overflow-hidden transition-all duration-500 hover:shadow-[0_0_50px_rgba(129,140,248,0.25)] hover:scale-[1.02]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 rounded-full" />
              <div className="absolute inset-[1px] bg-[#030014] rounded-full group-hover:bg-transparent transition-all duration-500" />
              <span className="relative z-10 text-white/90 group-hover:text-white text-sm font-medium">
                Launch GeoTimeline
              </span>
              <motion.span
                className="relative z-10 text-white/70 group-hover:text-white"
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </button>
          </motion.div>

          {/* Footer */}
          <div className="mt-28 pt-6 border-t border-white/[0.03]">
            <p className="text-white/[0.08] text-[10px] tracking-[0.3em] uppercase">
              GeoTimeline — AI-Powered Historical Explorer
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
