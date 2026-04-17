import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from './supabase';

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  /** True only immediately after a fresh OAuth sign-in (not on page-load session restore). */
  justSignedIn: boolean;
  /** Call this after you've consumed the justSignedIn flag to reset it. */
  clearJustSignedIn: () => void;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  session: null,
  loading: true,
  justSignedIn: false,
  clearJustSignedIn: () => {},
  signInWithGoogle: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser]             = useState<User | null>(null);
  const [session, setSession]       = useState<Session | null>(null);
  const [loading, setLoading]       = useState(true);
  const [justSignedIn, setJustSignedIn] = useState(false);

  // Track whether the initial getSession() resolve has happened yet.
  // Events fired before that resolve are from the OAuth redirect callback
  // and should count as a fresh login.
  const initialResolved = useRef(false);

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }

    // Listen for auth state changes BEFORE getSession so we catch the
    // SIGNED_IN event that Supabase fires after an OAuth redirect.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, sess) => {
      setSession(sess);
      setUser(sess?.user ?? null);
      setLoading(false);

      // Only flag as "just signed in" for a genuine OAuth callback redirect,
      // not for the silent session restore on every page load.
      if (event === 'SIGNED_IN' && !initialResolved.current) {
        setJustSignedIn(true);
      }
    });

    // Get initial (restored) session — mark resolved so subsequent events
    // are NOT treated as fresh logins.
    supabase.auth.getSession().then(({ data }) => {
      initialResolved.current = true;
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const clearJustSignedIn = () => setJustSignedIn(false);

  const signInWithGoogle = async () => {
    if (!supabase) return;
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
        queryParams: { prompt: 'select_account' },
      },
    });
  };

  const signOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, justSignedIn, clearJustSignedIn, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
