import { motion } from "motion/react";
import type { User } from '@supabase/supabase-js';

interface HeroProps { user: User | null; onCTA: () => void; }

export default function Hero({ user, onCTA }: HeroProps) {
  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      className="relative w-full rounded-[2rem] bg-gradient-to-br from-surface-container-low via-surface to-surface-container-high p-8 lg:p-16 pb-20"
    >
      {/* Subtle watermark — clipped only within card */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden rounded-[2rem]">
        <span className="absolute top-1/2 left-0 -translate-y-1/2 font-headline font-extrabold text-[18rem] leading-none text-primary/5 tracking-tighter -translate-x-16">
          CLARITY
        </span>
      </div>

      {/* Ambient glow blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Two-column grid */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

        {/* ── Left: Text ── */}
        <div className="space-y-8 order-2 lg:order-1">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block text-xs font-bold tracking-widest text-primary uppercase mb-4 bg-primary/10 px-3 py-1.5 rounded-full">
              AI Mental Health Platform
            </span>
            <h1 className="font-headline font-extrabold text-5xl sm:text-6xl lg:text-7xl tracking-tighter text-on-surface leading-[1.05] mt-4">
              Understand<br />Your Mind
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-on-surface-variant text-lg lg:text-xl leading-relaxed max-w-lg"
          >
            AI-powered insights to support your mental well-being every day.
            Navigate life's complexities with an intelligent partner designed
            to listen, learn, and guide you.
          </motion.p>

          {/* Info card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="glass-panel p-6 rounded-2xl border border-outline-variant/20 space-y-3 max-w-md"
          >
            <h3 className="font-headline font-bold text-xl text-on-surface">Personalized Care, Anytime</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              Real-time mood tracking · AI journaling · Stress analysis · Cognitive pattern recognition
            </p>
            <div className="flex space-x-2 pt-1">
              <div className="w-10 h-1 rounded-full bg-primary" />
              <div className="w-3 h-1 rounded-full bg-outline-variant" />
              <div className="w-3 h-1 rounded-full bg-outline-variant" />
            </div>
          </motion.div>

          {/* CTA row */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-wrap items-center gap-6"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCTA}
              className="bg-primary text-on-primary px-10 py-4 rounded-full font-headline font-bold text-base shadow-[0_20px_40px_rgba(0,97,165,0.25)] hover:shadow-primary/30 transition-all duration-500"
            >
              {user ? '→ Go to Dashboard' : 'Get Started Free'}
            </motion.button>

            <div className="flex items-center gap-3">
              <div className="flex -space-x-3">
                {[
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuBiLPSY39ybZ3n9Tzck97dYWPapvDhWvUg6eVlmXWgiBHLhuCL3rWzwd1iZnyEJdf_m8om20Jry37_1OkMWKsrZpiUyrdt8MmzonV2QL2jWFEZafC9CPVFKKBvtTq9UpNLD377Wd51IoH6lFkcIjTqeCUIQ_yrUSh4sm0k68R81Z2ob6UUSU3k-ySR2V4M5ez2ks3YKmofSpU9HwNa2-a9_nqduHHcmsjIpdPowPTIE46-o_OW8SOCu4mDJQqrriKjegzOWIzvUfusm",
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuAV-ynR46lpAcedRyK9WSv14r-61s_gg7fA5TTNl9eYRa-pm74wXL3gd7i0PG-mDp7HzYCo3t79IUZ1oGUku6hm9Vcz0i2rOIDLpmXKa_ANZ14p5FEVDZwP8U7gfA7W1LJfd-6HNLxeex6gkIZPVOhz701883dFoKWaOzDffxdoOWmWiwcvK2Qh1t43u47g_kQeRG8TBiXVLhKFdEsXeaTq9Ks2XVzhDLCgRH63OtqY7dTxk3Bh4ZDgX-TPHnU1rzulMFmTkBCcH7aQ"
                ].map((src, i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-surface-container-high overflow-hidden">
                    <img src={src} alt={`User ${i + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                ))}
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-white bg-primary/10 text-primary text-xs font-bold font-headline">
                  4k+
                </div>
              </div>
              <span className="text-sm text-on-surface-variant font-medium">people already healing</span>
            </div>
          </motion.div>
        </div>

        {/* ── Right: Brain image ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          className="relative order-1 lg:order-2 flex justify-center items-center py-8"
        >
          {/* Glow behind image */}
          <div className="absolute inset-0 m-auto w-[65%] h-[65%] bg-primary/12 rounded-full blur-[90px]" />

          <img
            src="/brain-hero.png"
            alt="3D brain model with blooming flowers"
            className="relative w-full max-w-[460px] lg:max-w-[540px] h-auto object-contain drop-shadow-2xl floating-object"
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1559757147-947ae61a5202?auto=format&fit=crop&w=520&q=80";
              e.currentTarget.onerror = null;
            }}
          />

          {/* Floating badge — top right */}
          <motion.div
            animate={{ y: [-5, 5, -5] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute top-4 right-2 lg:right-4 bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl px-4 py-2.5 flex items-center gap-2.5 border border-outline-variant/20"
          >
            <span className="text-xl">🧠</span>
            <div>
              <div className="text-xs font-bold text-on-surface font-headline">AI Analysis</div>
              <div className="text-xs text-primary font-medium">Active</div>
            </div>
          </motion.div>

          {/* Floating badge — bottom left */}
          <motion.div
            animate={{ y: [5, -5, 5] }}
            transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-4 left-2 lg:left-4 bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl px-4 py-2.5 flex items-center gap-2.5 border border-outline-variant/20"
          >
            <span className="text-xl">✨</span>
            <div>
              <div className="text-xs font-bold text-on-surface font-headline">Wellness Score</div>
              <div className="text-xs text-green-500 font-bold">+12% this week</div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={scrollToFeatures}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-on-surface-variant/50 hover:text-primary transition-colors duration-300 cursor-pointer"
        aria-label="Scroll to next section"
      >
        <span className="text-xs font-medium tracking-widest uppercase font-headline">Explore</span>
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          className="w-5 h-5 flex items-center justify-center"
        >
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 3v14M4 11l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>
      </motion.button>
    </section>
  );
}
