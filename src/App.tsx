/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from "react";
import { useAuth } from "./lib/auth";
import type { User } from '@supabase/supabase-js';
import AuthModal from "./components/AuthModal";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Footer from "./components/Footer";
import Dashboard from "./pages/dashboard/Dashboard";

// Inject Chart.js once
function useChartJs() {
  useEffect(() => {
    if ((window as any).Chart) return;
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js";
    script.async = true;
    document.head.appendChild(script);
  }, []);
}

export default function App() {
  const { user, loading, signOut, justSignedIn, clearJustSignedIn } = useAuth();
  const [showModal,     setShowModal]     = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  useChartJs();

  // Redirect to dashboard ONLY after a fresh OAuth login — never on page load.
  useEffect(() => {
    if (justSignedIn) {
      clearJustSignedIn();
      setShowModal(false);
      setShowDashboard(true);
      window.scrollTo(0, 0);
    }
  }, [justSignedIn]);

  /* ── Sign out / back ───────────────────────────────────────────────── */
  const handleBack = async () => {
    await signOut();
    setShowDashboard(false);
    window.scrollTo(0, 0);
  };

  /* ── Routing ───────────────────────────────────────────────────────── */
  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (showDashboard) {
    return <Dashboard onBack={handleBack} />;
  }

  /* Already authenticated — show landing with "Go to Dashboard" CTA. */
  const handleGotoDashboard = () => {
    setShowDashboard(true);
    window.scrollTo(0, 0);
  };

  return (
    <>
      <LandingPage
        user={user}
        onOpenModal={() => setShowModal(true)}
        onGotoDashboard={handleGotoDashboard}
      />

      {showModal && (
        <AuthModal
          onClose={() => setShowModal(false)}
          onContinueWithoutAuth={() => {
            setShowModal(false);
            setShowDashboard(true);
            window.scrollTo(0, 0);
          }}
        />
      )}
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Landing Page  —  clean shell, no floating brain overlay
══════════════════════════════════════════════════════════════════════ */


function LandingPage({ onOpenDashboard }: { onOpenDashboard: () => void }) {
  const containerRef  = useRef<HTMLDivElement>(null);
  const targetSlotRef = useRef<HTMLDivElement>(null);
  const brainWrapRef  = useRef<HTMLDivElement>(null);

  const [delta,  setDelta]  = useState({ x: 0, y: 0 });
  const [landed, setLanded] = useState(false);

  /* ── Measure positions ────────────────────────────────────────────── */
  const measure = () => {
    if (!brainWrapRef.current || !targetSlotRef.current) return;

    const targetRect = targetSlotRef.current.getBoundingClientRect();
    const scrollY    = window.scrollY;

    // Brain is vertically centered in viewport (top:50vh, translateY:-50%)
    const brainVY = window.innerHeight / 2;
    const brainVX = window.innerWidth  / 2;

    const targetDocCX = targetRect.left + targetRect.width  / 2;
    const targetDocCY = targetRect.top  + scrollY + targetRect.height / 2;

    const totalScroll  = document.body.scrollHeight - window.innerHeight;
    const scrollAtEnd  = totalScroll * END;

    const targetVX = targetDocCX;
    const targetVY = targetDocCY - scrollAtEnd;

    setDelta({ x: targetVX - brainVX, y: targetVY - brainVY });
  };

  useEffect(() => {
    const t = setTimeout(measure, 300);
    window.addEventListener("resize", measure);
    return () => { clearTimeout(t); window.removeEventListener("resize", measure); };
  }, []);

  useEffect(() => {
    if (!targetSlotRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.4) setLanded(true);
        else setLanded(false);
      },
      { threshold: [0, 0.4] }
    );
    observer.observe(targetSlotRef.current);
    return () => observer.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 20, restDelta: 0.001 });

  const brainX      = useTransform(smooth, [START, END], [0, delta.x]);
  const brainY      = useTransform(smooth, [START, END], [0, delta.y]);
  const brainScale  = useTransform(smooth, [START, END], [1, 1.18]);
  const brainRotate = useTransform(smooth, [START, END], [0, -6]);
  const glowScale   = useTransform(smooth, [START, END], [1, 1.2]);
  const glowOpacity = useTransform(smooth, [START, END], [0.12, 0.18]);

  const BrainImage = (
    <>
      <img
        src={BRAIN_SRC}
        alt="3D brain model with blooming flowers"
        className="w-[1140px] md:w-[1560px] object-contain floating-object"
        style={{ maxHeight: "min(1560px, 80vh)" }}
        referrerPolicy="no-referrer"
        onError={(e) => {
          e.currentTarget.src = FALLBACK_BRAIN_SRC;
          e.currentTarget.onerror = null;
        }}
      />
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-64 h-8 bg-primary/15 blur-2xl rounded-full" />
    </>
  );

  return (
    <div className="min-h-screen bg-surface selection:bg-primary/10 selection:text-primary">
      <Navbar onOpenDashboard={onOpenDashboard} />

      {/* Fixed brain overlay while traveling */}
      {!landed && (
        <div
          ref={brainWrapRef}
          className="fixed top-1/2 -translate-y-1/2 left-0 w-full z-20 pointer-events-none flex justify-center"
        >
          <motion.div
            className="absolute w-[1260px] h-[1260px] md:w-[1560px] md:h-[1560px] rounded-full bg-primary/10 blur-[120px]"
            style={{ scale: glowScale, opacity: glowOpacity, x: brainX, y: brainY }}
          />
          <motion.div
            className="relative will-change-transform"
            style={{ x: brainX, y: brainY, scale: brainScale, rotate: brainRotate }}
          >
            {BrainImage}
          </motion.div>
        </div>
      )}

function LandingPage({
  user,
  onOpenModal,
  onGotoDashboard,
}: {
  user: User | null;
  onOpenModal: () => void;
  onGotoDashboard: () => void;
}) {
  const handleCTA = user ? onGotoDashboard : onOpenModal;

  return (
    <div className="min-h-screen bg-surface selection:bg-primary/10 selection:text-primary">
      <Navbar user={user} onCTA={handleCTA} />


      <main className="pt-28 pb-12 px-6 max-w-[1440px] mx-auto space-y-12">
        <Hero user={user} onCTA={handleCTA} />
        <Features />
      </main>

      <Footer />
    </div>
  );
}

