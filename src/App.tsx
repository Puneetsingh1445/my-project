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

