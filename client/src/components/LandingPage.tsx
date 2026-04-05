import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";

interface Props {
  onEnterApp: () => void;
}

const ease = [0.16, 1, 0.3, 1] as const;

const FIGURES = [
  { name: "Shivaji Maharaj", era: "1630–1680", events: 10, tag: "Maratha Empire" },
  { name: "Akbar", era: "1542–1605", events: 9, tag: "Mughal Dynasty" },
  { name: "Rani Lakshmibai", era: "1828–1858", events: 10, tag: "Indian Rebellion" },
  { name: "Aurangzeb", era: "1618–1707", events: 10, tag: "Mughal Dynasty" },
  { name: "Ashoka", era: "304–232 BCE", events: 9, tag: "Maurya Dynasty" },
  { name: "Maharana Pratap", era: "1540–1597", events: 10, tag: "Rajput Kingdom" },
];

export default function LandingPage({ onEnterApp }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const mapScale = useTransform(scrollYProgress, [0.05, 0.25], [0.92, 1]);
  const mapOpacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);
  const mapBorderRadius = useTransform(scrollYProgress, [0.05, 0.3], [24, 0]);

  return (
    <div ref={containerRef} className="bg-[#050506] min-h-screen text-white selection:bg-[#5E6AD2]/30">
      {/* Ambient gradient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[300px] -right-[200px] w-[800px] h-[800px] rounded-full opacity-[0.07]"
          style={{ background: "radial-gradient(circle, #5E6AD2, transparent 70%)" }} />
        <div className="absolute -bottom-[400px] -left-[300px] w-[900px] h-[900px] rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(circle, #8B5CF6, transparent 70%)" }} />
      </div>

      {/* ═══ NAVBAR ═══ */}
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.04]"
        style={{ background: "rgba(5,5,6,0.8)", backdropFilter: "blur(16px)" }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 h-14">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#5E6AD2] to-[#8B5CF6] flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <circle cx="12" cy="10" r="3"/><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
              </svg>
            </div>
            <span className="text-[14px] font-semibold tracking-[-0.01em]">GeoTimeline</span>
          </div>
          <button
            onClick={onEnterApp}
            className="h-8 px-4 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.06] text-[12px] font-medium text-white/70 hover:text-white transition-all duration-200"
          >
            Open App
          </button>
        </div>
      </motion.nav>

      {/* ═══ HERO ═══ */}
      <section className="relative pt-32 pb-4 px-6">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease }}
            className="inline-flex items-center gap-2 h-7 px-3 rounded-full border border-white/[0.06] bg-white/[0.03] mb-6"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5E6AD2] opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#5E6AD2]" />
            </span>
            <span className="text-[11px] tracking-[0.04em] text-white/40 font-medium">
              Powered by AI
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease }}
            className="text-[56px] md:text-[72px] lg:text-[80px] font-semibold tracking-[-0.035em] leading-[1.05]"
          >
            <span className="text-white/95">History on </span>
            <span className="bg-gradient-to-r from-[#5E6AD2] via-[#7C6ADE] to-[#9F7AEA] bg-clip-text text-transparent">
              the map
            </span>
          </motion.h1>

          {/* Subhead */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease }}
            className="text-[17px] md:text-[18px] text-white/35 mt-5 leading-[1.6] max-w-xl mx-auto font-light"
          >
            Search any historical figure. AI reconstructs their journey — battles,
            coronations, meetings — and plays it on an interactive dark map.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55, ease }}
            className="mt-8 flex items-center justify-center gap-3"
          >
            <button
              onClick={onEnterApp}
              className="h-11 px-7 rounded-[10px] bg-[#5E6AD2] hover:bg-[#6E7AE2] text-white text-[14px] font-medium transition-all duration-200 shadow-[0_0_20px_rgba(94,106,210,0.2)] hover:shadow-[0_0_30px_rgba(94,106,210,0.35)]"
            >
              Start Exploring
            </button>
            <a
              href="#figures"
              className="h-11 px-5 rounded-[10px] border border-white/[0.06] hover:border-white/[0.12] text-[14px] text-white/40 hover:text-white/65 font-medium transition-all duration-200 flex items-center"
            >
              View figures
            </a>
          </motion.div>
        </div>

        {/* ═══ MAP PREVIEW ═══ */}
        <motion.div
          style={{ scale: mapScale, opacity: mapOpacity, borderRadius: mapBorderRadius }}
          className="mt-16 max-w-5xl mx-auto overflow-hidden border border-white/[0.06]"
        >
          <div className="relative aspect-[16/9] bg-[#0a0a0c]">
            {/* Dark map background with grid */}
            <div className="absolute inset-0"
              style={{
                backgroundImage: "radial-gradient(circle at 45% 50%, #0e1117 0%, #050506 100%)",
              }}
            >
              <div className="absolute inset-0 opacity-[0.04]"
                style={{
                  backgroundImage: "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
                  backgroundSize: "80px 80px",
                }}
              />
              {/* Fake continent shapes */}
              <div className="absolute top-[35%] left-[35%] w-40 h-32 rounded-[40%] bg-white/[0.015] blur-sm" />
              <div className="absolute top-[25%] left-[50%] w-24 h-20 rounded-[35%] bg-white/[0.01] blur-sm" />
              <div className="absolute top-[50%] left-[28%] w-16 h-24 rounded-[40%] bg-white/[0.01] blur-sm" />
            </div>
            {/* Overlay UI mockup */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.8, ease }}
                >
                  {/* Fake search bar */}
                  <div className="mx-auto w-[340px] h-10 rounded-lg bg-[#141414]/90 backdrop-blur border border-white/[0.08] flex items-center px-3 gap-2 mb-6 shadow-2xl">
                    <svg className="w-3.5 h-3.5 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3" strokeLinecap="round"/>
                    </svg>
                    <span className="text-[13px] text-white/25">Search "Shivaji Maharaj"...</span>
                  </div>

                  {/* Animated dots on map */}
                  {[
                    { left: "30%", top: "45%", delay: 0.5 },
                    { left: "42%", top: "55%", delay: 0.7 },
                    { left: "38%", top: "35%", delay: 0.9 },
                    { left: "55%", top: "40%", delay: 1.1 },
                    { left: "48%", top: "60%", delay: 1.3 },
                  ].map((dot, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: dot.delay, duration: 0.5, ease }}
                      className="absolute w-2.5 h-2.5 rounded-full"
                      style={{
                        left: dot.left,
                        top: dot.top,
                        background: i === 2 ? "#F59E0B" : "#5E6AD2",
                        boxShadow: `0 0 12px ${i === 2 ? "rgba(245,158,11,0.4)" : "rgba(94,106,210,0.4)"}`,
                      }}
                    >
                      <span className="absolute inset-0 rounded-full animate-ping opacity-30"
                        style={{ background: i === 2 ? "#F59E0B" : "#5E6AD2" }} />
                    </motion.div>
                  ))}

                  {/* Dashed path between dots */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.15 }}>
                    <motion.path
                      d="M 30% 45% Q 36% 40% 42% 55% T 38% 35% T 55% 40% T 48% 60%"
                      fill="none"
                      stroke="#5E6AD2"
                      strokeWidth="1"
                      strokeDasharray="4 6"
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.8, duration: 2, ease: "easeInOut" }}
                    />
                  </svg>
                </motion.div>
              </div>
            </div>

            {/* Edge fades */}
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#050506] to-transparent" />
            <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#050506] to-transparent" />
          </div>
        </motion.div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="py-28 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease }}
            className="text-center mb-16"
          >
            <p className="text-[11px] tracking-[0.1em] uppercase text-[#5E6AD2]/60 font-medium mb-3">
              How it works
            </p>
            <h2 className="text-[36px] md:text-[42px] font-semibold tracking-[-0.025em] text-white/90">
              Three steps to discovery
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.03] rounded-2xl overflow-hidden border border-white/[0.04]">
            {[
              {
                step: "01",
                title: "Search",
                desc: "Type any historical figure's name. Our AI fetches their complete life journey.",
                icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3" strokeLinecap="round"/></svg>,
              },
              {
                step: "02",
                title: "Explore",
                desc: "Events appear as glowing markers on a dark map, connected by animated paths.",
                icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>,
              },
              {
                step: "03",
                title: "Discover",
                desc: "Click events for rich details — people involved, places, and historical context.",
                icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>,
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1, duration: 0.5, ease }}
                className="bg-[#0a0a0c] p-8 relative group"
              >
                <div className="absolute top-8 right-8 text-[11px] font-mono text-white/10">{item.step}</div>
                <div className="text-[#5E6AD2]/50 group-hover:text-[#5E6AD2] transition-colors duration-300 mb-5">
                  {item.icon}
                </div>
                <h3 className="text-[16px] font-semibold text-white/85 mb-2 tracking-[-0.01em]">{item.title}</h3>
                <p className="text-[13px] text-white/30 leading-[1.7] font-light">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FIGURES ═══ */}
      <section id="figures" className="py-28 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease }}
            className="text-center mb-16"
          >
            <p className="text-[11px] tracking-[0.1em] uppercase text-[#F59E0B]/50 font-medium mb-3">
              Pre-loaded
            </p>
            <h2 className="text-[36px] md:text-[42px] font-semibold tracking-[-0.025em] text-white/90">
              Ready to explore
            </h2>
            <p className="text-[15px] text-white/30 mt-3 font-light">
              These figures are cached and load instantly. Search anyone else — AI generates it live.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {FIGURES.map((fig, i) => (
              <motion.button
                key={fig.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.5, ease }}
                onClick={onEnterApp}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="relative group text-left p-5 rounded-xl bg-[#0a0a0c] border border-white/[0.04] hover:border-[#5E6AD2]/20 transition-all duration-300 overflow-hidden"
              >
                {/* Hover glow */}
                {hoveredIdx === i && (
                  <motion.div
                    layoutId="figureHover"
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: "radial-gradient(circle at 50% 50%, rgba(94,106,210,0.06), transparent 70%)" }}
                    transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                  />
                )}
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[15px] font-medium text-white/80 group-hover:text-white/95 transition-colors">
                      {fig.name}
                    </span>
                    <svg className="w-4 h-4 text-white/10 group-hover:text-[#5E6AD2]/60 transition-all duration-300 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-white/20">{fig.era}</span>
                    <span className="text-white/[0.06]">·</span>
                    <span className="text-[11px] text-[#5E6AD2]/40 font-medium">{fig.tag}</span>
                  </div>
                  <div className="mt-3 flex items-center gap-1.5">
                    <span className="text-[10px] text-white/15 font-mono">{fig.events} events</span>
                    <div className="flex gap-0.5">
                      {Array.from({ length: Math.min(fig.events, 8) }).map((_, j) => (
                        <div key={j} className="w-1 h-1 rounded-full bg-[#5E6AD2]/20" />
                      ))}
                    </div>
                  </div>
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
          className="max-w-xl mx-auto text-center"
        >
          <h2 className="text-[40px] md:text-[48px] font-semibold tracking-[-0.03em] text-white/90 leading-[1.1]">
            Ready to explore<br />the past?
          </h2>
          <p className="text-[15px] text-white/25 mt-4 font-light">
            Search any historical figure and watch their story unfold on the map.
          </p>
          <button
            onClick={onEnterApp}
            className="mt-8 h-12 px-8 rounded-xl bg-gradient-to-r from-[#5E6AD2] to-[#7C6ADE] hover:from-[#6E7AE2] hover:to-[#8C7AEE] text-white text-[14px] font-medium transition-all duration-300 shadow-[0_0_32px_rgba(94,106,210,0.2)] hover:shadow-[0_0_48px_rgba(94,106,210,0.35)]"
          >
            Launch GeoTimeline →
          </button>
        </motion.div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t border-white/[0.04] py-6 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="text-[11px] text-white/15 font-mono">GeoTimeline v1.0</span>
          <span className="text-[11px] text-white/10">Built with AI</span>
        </div>
      </footer>
    </div>
  );
}
