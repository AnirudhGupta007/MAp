import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";

interface Props {
  onEnterApp: () => void;
}

const FEATURES = [
  {
    icon: "🔍",
    title: "Search Any Figure",
    desc: "Type a name and instantly explore their life journey across time and geography.",
    color: "#00d4ff",
  },
  {
    icon: "🗺️",
    title: "Interactive Map",
    desc: "Watch events come alive on a cinematic dark map with glowing markers and animated paths.",
    color: "#ffb800",
  },
  {
    icon: "⏳",
    title: "Animated Timeline",
    desc: "Play through history with a beautiful timeline that flies you between key moments.",
    color: "#a78bfa",
  },
  {
    icon: "📖",
    title: "Rich Details",
    desc: "Dive deep with multimedia side panels — images, videos, Wikipedia links, and more.",
    color: "#34d399",
  },
];

const FIGURES = [
  { name: "Shivaji Maharaj", era: "1630–1680", title: "Founder of Maratha Empire" },
  { name: "Aurangzeb", era: "1618–1707", title: "Sixth Mughal Emperor" },
  { name: "Akbar", era: "1542–1605", title: "Akbar the Great" },
  { name: "Rani Lakshmibai", era: "1828–1858", title: "Queen of Jhansi" },
  { name: "Ashoka", era: "304–232 BCE", title: "Emperor of Maurya Dynasty" },
  { name: "Maharana Pratap", era: "1540–1597", title: "King of Mewar" },
];

function ParticleField() {
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    duration: Math.random() * 20 + 15,
    delay: Math.random() * 10,
    opacity: Math.random() * 0.3 + 0.05,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: `rgba(0, 212, 255, ${p.opacity})`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [p.opacity, p.opacity * 2, p.opacity],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function GlowOrb({ color, size, x, y, blur }: { color: string; size: number; x: string; y: string; blur: number }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        left: x,
        top: y,
        background: `radial-gradient(circle, ${color}15 0%, transparent 70%)`,
        filter: `blur(${blur}px)`,
      }}
      animate={{
        x: [0, 30, -20, 0],
        y: [0, -20, 30, 0],
        scale: [1, 1.1, 0.95, 1],
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

export default function LandingPage({ onEnterApp }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const [hoveredFigure, setHoveredFigure] = useState<number | null>(null);

  // Parallax transforms
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const featuresOpacity = useTransform(scrollYProgress, [0.15, 0.3], [0, 1]);

  // Typing animation for subtitle
  const [displayText, setDisplayText] = useState("");
  const fullText = "Explore history through space and time";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i <= fullText.length) {
        setDisplayText(fullText.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div ref={containerRef} className="relative bg-[#06060a]" style={{ height: "400vh" }}>
      {/* Fixed background */}
      <div className="fixed inset-0 z-0">
        {/* Ambient glow orbs */}
        <GlowOrb color="#00d4ff" size={600} x="10%" y="20%" blur={80} />
        <GlowOrb color="#a78bfa" size={500} x="70%" y="60%" blur={100} />
        <GlowOrb color="#ffb800" size={400} x="50%" y="10%" blur={90} />

        {/* Particle field */}
        <ParticleField />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* ═══════════ SECTION 1: Hero ═══════════ */}
      <motion.section
        className="fixed inset-0 z-10 flex items-center justify-center"
        style={{ y: heroY, opacity: heroOpacity }}
      >
        <div className="text-center px-6 max-w-4xl">
          {/* Badge */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/[0.06] bg-white/[0.03] mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#00d4ff] animate-pulse" />
            <span className="text-[11px] tracking-[0.2em] uppercase text-white/40 font-medium">
              AI-Powered Historical Explorer
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight leading-none"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            <span className="text-white/90">Geo</span>
            <span
              className="relative"
              style={{
                background: "linear-gradient(135deg, #00d4ff 0%, #a78bfa 50%, #ffb800 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Timeline
            </span>
          </motion.h1>

          {/* Subtitle with typing effect */}
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-xl md:text-2xl text-white/25 mt-6 font-light tracking-wide h-8"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {displayText}
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="text-[#00d4ff]"
            >
              |
            </motion.span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-12 flex items-center justify-center gap-4"
          >
            <button
              onClick={onEnterApp}
              className="group relative px-8 py-3.5 rounded-2xl font-medium text-sm tracking-wide overflow-hidden transition-all duration-300"
            >
              {/* Button glow background */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#00d4ff] to-[#a78bfa] opacity-90 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-[1px] bg-[#06060a] rounded-2xl group-hover:bg-transparent transition-all duration-300" />
              <span className="relative z-10 text-white group-hover:text-white">
                Start Exploring →
              </span>
            </button>

            <a
              href="#features"
              className="px-6 py-3.5 rounded-2xl text-white/40 hover:text-white/70 text-sm font-light tracking-wide transition-colors duration-300"
            >
              Learn more
            </a>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="flex flex-col items-center gap-2"
            >
              <span className="text-[10px] tracking-[0.3em] uppercase text-white/15">Scroll</span>
              <div className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent" />
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* ═══════════ SECTION 2: Features ═══════════ */}
      <section
        id="features"
        className="relative z-20"
        style={{ marginTop: "100vh", paddingTop: "10vh", paddingBottom: "10vh" }}
      >
        <motion.div
          style={{ opacity: featuresOpacity }}
          className="max-w-6xl mx-auto px-6"
        >
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-[11px] tracking-[0.3em] uppercase text-[#00d4ff]/40 text-center mb-4"
          >
            Why GeoTimeline
          </motion.p>

          <motion.h2
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-5xl font-bold text-center text-white/90 mb-16"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            History, <span className="text-[#00d4ff]">reimagined</span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ y: 40, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="group relative p-8 rounded-2xl border border-white/[0.04] bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-500 overflow-hidden"
              >
                {/* Hover glow */}
                <div
                  className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle, ${f.color}12, transparent 70%)`,
                    filter: "blur(30px)",
                  }}
                />

                <span className="text-3xl mb-4 block">{f.icon}</span>
                <h3
                  className="text-xl font-semibold text-white/90 mb-2"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {f.title}
                </h3>
                <p className="text-white/35 text-sm leading-relaxed font-light">{f.desc}</p>

                {/* Bottom accent line */}
                <div
                  className="absolute bottom-0 left-8 right-8 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `linear-gradient(90deg, transparent, ${f.color}40, transparent)` }}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ═══════════ SECTION 3: Historical Figures Preview ═══════════ */}
      <section className="relative z-20 py-24">
        <div className="max-w-6xl mx-auto px-6">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-[11px] tracking-[0.3em] uppercase text-[#ffb800]/40 text-center mb-4"
          >
            Explore
          </motion.p>

          <motion.h2
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-5xl font-bold text-center text-white/90 mb-16"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Legends await
          </motion.h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {FIGURES.map((fig, i) => (
              <motion.button
                key={fig.name}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                onHoverStart={() => setHoveredFigure(i)}
                onHoverEnd={() => setHoveredFigure(null)}
                onClick={onEnterApp}
                className="group relative p-6 rounded-2xl border border-white/[0.04] bg-white/[0.015] hover:border-[#00d4ff]/20 transition-all duration-500 text-left overflow-hidden"
              >
                {/* Hover glow */}
                <AnimatePresence>
                  {hoveredFigure === i && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: "radial-gradient(circle at 50% 50%, rgba(0,212,255,0.05), transparent 70%)",
                      }}
                    />
                  )}
                </AnimatePresence>

                <p className="text-white/80 font-semibold text-base group-hover:text-white transition-colors">
                  {fig.name}
                </p>
                <p className="text-white/20 text-xs mt-1 font-mono">{fig.era}</p>
                <p className="text-white/30 text-xs mt-2 font-light">{fig.title}</p>

                {/* Arrow */}
                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-1 group-hover:translate-x-0">
                  <span className="text-[#00d4ff] text-sm">→</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ SECTION 4: Final CTA ═══════════ */}
      <section className="relative z-20 py-32">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2
              className="text-5xl md:text-6xl font-bold text-white/90 mb-6"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Ready to explore?
            </h2>
            <p className="text-white/25 text-lg font-light mb-10">
              Dive into centuries of history with a single search.
            </p>

            <button
              onClick={onEnterApp}
              className="group relative inline-flex items-center gap-3 px-10 py-4 rounded-2xl font-medium text-base tracking-wide overflow-hidden transition-all duration-300 hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#00d4ff] via-[#a78bfa] to-[#ffb800] rounded-2xl" />
              <span className="relative z-10 text-white font-semibold">Launch GeoTimeline</span>
              <motion.span
                className="relative z-10 text-white"
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </button>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-24 pt-8 border-t border-white/[0.04]"
          >
            <p className="text-white/10 text-xs tracking-wider">
              GeoTimeline v1.0 — Built with AI-Powered Historical Intelligence
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
