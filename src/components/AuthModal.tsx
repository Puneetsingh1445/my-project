import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../lib/auth';
import { isSupabaseEnabled } from '../lib/supabase';
import { useState } from 'react';

interface AuthModalProps {
  onClose: () => void;
  onContinueWithoutAuth: () => void;
}

export default function AuthModal({ onClose, onContinueWithoutAuth }: AuthModalProps) {
  const { signInWithGoogle } = useAuth();
  const [signingIn, setSigningIn] = useState(false);

  const handleGoogleSignIn = async () => {
    setSigningIn(true);
    try {
      await signInWithGoogle();
      // Page will redirect to Google; no need to close
    } catch {
      setSigningIn(false);
    }
  };

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        {/* Blurred overlay */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-md" />

        {/* Modal card */}
        <motion.div
          className="relative z-10 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl"
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 24 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          onClick={e => e.stopPropagation()}
        >
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#f0edf8] via-white to-[#e8f4ff]" />
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#7C5CFC]/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-primary/10 blur-3xl" />

          <div className="relative p-10 flex flex-col items-center text-center">
            {/* Icon */}
            <motion.div
              className="w-20 h-20 rounded-2xl mb-6 flex items-center justify-center text-4xl shadow-lg"
              style={{ background: 'linear-gradient(135deg, #7C5CFC, #B39DFF)' }}
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              💜
            </motion.div>

            <h2 className="font-headline font-bold text-3xl text-slate-900 mb-2">
              Welcome to MindCare
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-8 max-w-xs">
              Sign in to save your check-ins, track your progress, and get personalized AI insights — all securely backed up to the cloud.
            </p>

            {/* Google Sign-In button */}
            {isSupabaseEnabled ? (
              <motion.button
                onClick={handleGoogleSignIn}
                disabled={signingIn}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl font-semibold text-slate-700 bg-white border border-slate-200 shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed mb-3"
              >
                {signingIn ? (
                  <>
                    <div className="w-5 h-5 border-2 border-slate-300 border-t-[#7C5CFC] rounded-full animate-spin" />
                    <span>Redirecting to Google…</span>
                  </>
                ) : (
                  <>
                    {/* Google "G" logo */}
                    <svg width="20" height="20" viewBox="0 0 48 48">
                      <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                      <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                      <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                      <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                    </svg>
                    <span>Continue with Google</span>
                  </>
                )}
              </motion.button>
            ) : (
              <div className="w-full mb-3 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 text-sm text-left">
                <strong>Supabase not configured.</strong> Add <code className="bg-amber-100 px-1 rounded">VITE_SUPABASE_URL</code> and <code className="bg-amber-100 px-1 rounded">VITE_SUPABASE_ANON_KEY</code> to your <code className="bg-amber-100 px-1 rounded">.env</code> file to enable Google sign-in.
              </div>
            )}

            {/* Continue without sign-in */}
            <button
              onClick={onContinueWithoutAuth}
              className="text-slate-400 text-sm hover:text-slate-600 transition-colors duration-200 mt-1"
            >
              Continue without signing in →
            </button>

            {/* Privacy note */}
            <p className="text-xs text-slate-400 mt-6">
              🔒 Your data is private and encrypted. We never share your information.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
