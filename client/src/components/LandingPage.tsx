import { motion } from "framer-motion";

interface Props {
  onEnterApp: () => void;
}

const ease = "easeOut" as const;

const FEATURES = [
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
    title: "AI-Powered Search",
    desc: "Search any historical figure. AI generates their complete life journey instantly.",
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>,
    title: "Interactive Map",
    desc: "Events placed on a dark map with animated paths tracing the journey.",
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
    title: "Timeline Playback",
    desc: "Press play and fly through events chronologically across the map.",
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>,
    title: "Structured Details",
    desc: "Every event reveals rich context — people, places, and references.",
  },
];

const FIGURES = [
  { name: "Shivaji Maharaj", era: "1630–1680" },
  { name: "Akbar", era: "1542–1605" },
  { name: "Rani Lakshmibai", era: "1828–1858" },
  { name: "Aurangzeb", era: "1618–1707" },
  { name: "Ashoka", era: "304–232 BCE" },
  { name: "Maharana Pratap", era: "1540–1597" },
];

const reveal = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.05, duration: 0.6, ease },
  }),
};

export default function LandingPage({ onEnterApp }: Props) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden">
      {/* Subtle gradient accent — top right */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] pointer-events-none"
        style={{
          background: "radial-gradient(circle at 70% 30%, rgba(139,92,246,0.06) 0%, transparent 60%)",
        }}
      />

      {/* ═══ NAV ═══ */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="relative z-10 flex items-center justify-between px-8 py-5 max-w-6xl mx-auto"
      >
        <span className="text-[15px] font-semibold tracking-tight text-white/90">
          GeoTimeline
        </span>
        <button
          onClick={onEnterApp}
          className="text-[13px] text-white/50 hover:text-white/80 transition-colors duration-200"
        >
          Open App →
        </button>
      </motion.nav>

      {/* ═══ HERO ═══ */}
      <section className="relative z-10 pt-24 pb-32 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/[0.06] bg-white/[0.02] mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#8b5cf6]" />
            <span className="text-[11px] tracking-[0.08em] uppercase text-white/40 font-medium">
              AI-Powered Explorer
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease }}
            className="text-[72px] md:text-[88px] font-semibold tracking-[-0.03em] leading-[0.95] text-white/95"
          >
            Explore history
            <br />
            <span className="bg-gradient-to-r from-[#8b5cf6] via-[#6366f1] to-[#8b5cf6] bg-clip-text text-transparent">
              through space
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease }}
            className="text-[17px] text-white/40 mt-6 font-light leading-relaxed max-w-lg mx-auto"
          >
            Search any historical figure. Watch their life unfold on an
            interactive map — from birth to legacy.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.65, ease }}
            className="mt-10"
          >
            <button
              onClick={onEnterApp}
              className="px-7 py-3 rounded-lg bg-[#8b5cf6] hover:bg-[#7c3aed] text-white text-[14px] font-medium transition-all duration-200 hover:shadow-[0_0_24px_rgba(139,92,246,0.25)]"
            >
              Start Exploring
            </button>
          </motion.div>
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.p
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            custom={0} variants={reveal}
            className="text-[11px] tracking-[0.12em] uppercase text-white/30 font-medium mb-3 text-center"
          >
            How it works
          </motion.p>
          <motion.h2
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            custom={1} variants={reveal}
            className="text-[32px] font-semibold tracking-[-0.02em] text-white/90 text-center mb-14"
          >
            Four steps to discovery
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                custom={i + 2} variants={reveal}
                className="p-6 rounded-xl bg-[#141414] border border-white/[0.04] hover:border-white/[0.08] transition-all duration-300 group"
              >
                <div className="text-[#8b5cf6]/70 mb-3.5 group-hover:text-[#8b5cf6] transition-colors duration-200">
                  {f.icon}
                </div>
                <h3 className="text-[15px] font-medium text-white/85 mb-1.5">{f.title}</h3>
                <p className="text-[13px] text-white/35 leading-relaxed font-light">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FIGURES ═══ */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.p
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            custom={0} variants={reveal}
            className="text-[11px] tracking-[0.12em] uppercase text-white/30 font-medium mb-3 text-center"
          >
            Ready to explore
          </motion.p>
          <motion.h2
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            custom={1} variants={reveal}
            className="text-[32px] font-semibold tracking-[-0.02em] text-white/90 text-center mb-14"
          >
            Pick a legend
          </motion.h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {FIGURES.map((fig, i) => (
              <motion.button
                key={fig.name}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                custom={i + 2} variants={reveal}
                onClick={onEnterApp}
                className="group p-5 rounded-xl bg-[#141414] border border-white/[0.04] hover:border-[#8b5cf6]/20 transition-all duration-300 text-left"
              >
                <p className="text-[14px] font-medium text-white/80 group-hover:text-white transition-colors">
                  {fig.name}
                </p>
                <p className="text-[11px] text-white/25 mt-1 font-mono tracking-wide">
                  {fig.era}
                </p>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="relative z-10 py-32 px-6">
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="max-w-xl mx-auto text-center"
        >
          <motion.h2
            custom={0} variants={reveal}
            className="text-[36px] font-semibold tracking-[-0.02em] text-white/90 mb-4"
          >
            Begin your journey
          </motion.h2>
          <motion.p
            custom={1} variants={reveal}
            className="text-[15px] text-white/35 font-light mb-10"
          >
            Centuries of history, one search away.
          </motion.p>
          <motion.div custom={2} variants={reveal}>
            <button
              onClick={onEnterApp}
              className="group px-8 py-3 rounded-lg font-medium text-[14px] transition-all duration-300 border border-white/[0.06] bg-transparent text-white/70 hover:bg-[#8b5cf6] hover:border-[#8b5cf6] hover:text-white hover:shadow-[0_0_24px_rgba(139,92,246,0.2)]"
            >
              Launch GeoTimeline
            </button>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <div className="mt-24 text-center">
          <p className="text-[11px] text-white/[0.08] tracking-[0.15em] uppercase">
            GeoTimeline
          </p>
        </div>
      </section>
    </div>
  );
}
