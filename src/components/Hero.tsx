import { motion } from "motion/react";

interface HeroProps { onOpenDashboard: () => void; }

export default function Hero({ onOpenDashboard }: HeroProps) {
  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative w-full min-h-[680px] rounded-[2rem] overflow-hidden bg-gradient-to-br from-surface-container-low via-surface to-surface-container-high flex items-center p-8 lg:p-20">
      {/* Background Decoration */}
      <div className="absolute inset-0 opacity-5 pointer-events-none select-none overflow-hidden">
        <span className="absolute top-1/2 left-0 -translate-y-1/2 font-headline font-extrabold text-[20rem] leading-none text-primary tracking-tighter opacity-10 transform -translate-x-20">
          CLARITY
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 w-full gap-12 items-center z-10">
        {/* Left Content */}
        <div className="lg:col-span-3 space-y-8">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-headline font-extrabold text-6xl lg:text-7xl tracking-tighter text-on-surface leading-tight"
          >
            Understand <br/> Your Mind
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-on-surface-variant text-xl lg:text-2xl leading-relaxed max-w-md font-light"
          >
            AI-powered insights to support your mental well-being every day.
          </motion.p>
        </div>

        {/* Center: Brain image — floating overlay from App handles lg+ animation */}
        <div className="lg:col-span-6 min-h-[450px] flex items-center justify-center">
          {/* Show static image on mobile; hidden on lg+ where the fixed overlay takes over */}
          <img
            src="/brain-hero.png"
            alt="3D brain model with blooming flowers"
            className="block lg:hidden w-[840px] sm:w-[1080px] object-contain drop-shadow-2xl"
            style={{ maxHeight: "min(1260px, 70vh)" }}
          />
        </div>

        {/* Right Content */}
        <div className="lg:col-span-3 space-y-12">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="glass-panel p-8 rounded-2xl border border-outline-variant/15 space-y-4"
          >
            <h3 className="font-headline font-bold text-2xl text-on-surface">AI Mental Health Assistant</h3>
            <p className="font-headline font-medium text-primary text-lg">Personalized Care, Anytime</p>
            <p className="text-on-surface-variant leading-relaxed">
              Navigate life's complexities with an intelligent partner designed to listen, learn, and guide you toward lasting peace.
            </p>
            {/* Carousel Indicators */}
            <div className="flex space-x-2 pt-4">
              <div className="w-12 h-1 rounded-full bg-primary"></div>
              <div className="w-3 h-1 rounded-full bg-outline-variant"></div>
              <div className="w-3 h-1 rounded-full bg-outline-variant"></div>
            </div>
          </motion.div>

          <div className="flex items-center space-x-6">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenDashboard}
              className="bg-primary text-on-primary px-10 py-5 rounded-full font-headline font-bold text-lg shadow-[0_20px_40px_rgba(0,97,165,0.2)] hover:shadow-primary/30 transition-all duration-500"
            >
              Get Started
            </motion.button>
            <div className="flex -space-x-3">
              {[
                "https://lh3.googleusercontent.com/aida-public/AB6AXuBiLPSY39ybZ3n9Tzck97dYWPapvDhWvUg6eVlmXWgiBHLhuCL3rWzwd1iZnyEJdf_m8om20Jry37_1OkMWKsrZpiUyrdt8MmzonV2QL2jWFEZafC9CPVFKKBvtTq9UpNLD377Wd51IoH6lFkcIjTqeCUIQ_yrUSh4sm0k68R81Z2ob6UUSU3k-ySR2V4M5ez2ks3YKmofSpU9HwNa2-a9_nqduHHcmsjIpdPowPTIE46-o_OW8SOCu4mDJQqrriKjegzOWIzvUfusm",
                "https://lh3.googleusercontent.com/aida-public/AB6AXuAV-ynR46lpAcedRyK9WSv14r-61s_gg7fA5TTNl9eYRa-pm74wXL3gd7i0PG-mDp7HzYCo3t79IUZ1oGUku6hm9Vcz0i2rOIDLpmXKa_ANZ14p5FEVDZwP8U7gfA7W1LJfd-6HNLxeex6gkIZPVOhz701883dFoKWaOzDffxdoOWmWiwcvK2Qh1t43u47g_kQeRG8TBiXVLhKFdEsXeaTq9Ks2XVzhDLCgRH63OtqY7dTxk3Bh4ZDgX-TPHnU1rzulMFmTkBCcH7aQ"
              ].map((src, i) => (
                <div key={i} className="w-12 h-12 rounded-full border-2 border-white bg-surface-container-high overflow-hidden">
                  <img src={src} alt={`User ${i+1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              ))}
              <div className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-white bg-surface-container-high text-primary text-xs font-bold">
                4k+
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <motion.button
        onClick={scrollToFeatures}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-on-surface-variant/60 hover:text-primary transition-colors duration-300 group cursor-pointer"
        aria-label="Scroll to next section"
      >
        <span className="text-xs font-medium tracking-widest uppercase font-headline">Explore</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          className="w-6 h-6 flex items-center justify-center"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 3v14M4 11l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>
      </motion.button>
    </section>
  );
}
