import { motion, useScroll, useSpring } from "motion/react";
import type { User } from '@supabase/supabase-js';

interface NavbarProps {
  user: User | null;
  onCTA: () => void;
}

export default function Navbar({ user, onCTA }: NavbarProps) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] bg-primary z-[60] origin-left"
        style={{ scaleX }}
      />
      <nav className="fixed top-0 w-full z-50 bg-white/60 backdrop-blur-[20px] shadow-[0_20px_40px_rgba(15,23,42,0.06)]">
        <div className="flex justify-between items-center w-full px-6 md:px-12 py-6 max-w-[1440px] mx-auto">
          <button
            onClick={() => scrollTo('hero')}
            className="text-2xl font-bold tracking-tighter text-slate-900 font-headline hover:text-primary transition-colors duration-300"
          >
            Sanctuary AI
          </button>
          <div className="hidden md:flex items-center space-x-10 font-headline font-medium tracking-tight">
            <button onClick={() => scrollTo('hero')} className="text-slate-600 hover:text-primary transition-all duration-300">Insights</button>
            <button onClick={() => scrollTo('features')} className="text-slate-600 hover:text-primary transition-all duration-300">Practice</button>
            <button onClick={() => scrollTo('features')} className="text-slate-600 hover:text-primary transition-all duration-300">The Sanctuary</button>
            <button onClick={() => scrollTo('features')} className="text-slate-600 hover:text-primary transition-all duration-300">Science</button>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCTA}
            className="bg-primary text-on-primary px-8 py-3 rounded-xl font-headline font-bold text-sm tracking-wide shadow-lg hover:shadow-primary/20 transition-all duration-300"
          >
            {user ? '→ Go to Dashboard' : 'Start Your Journey'}
          </motion.button>
        </div>
      </nav>
    </>
  );
}
