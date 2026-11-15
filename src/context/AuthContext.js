'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const AuthContext = createContext({
  user: null,
  session: null,
  loading: true,
  avatarUrl: null,
  displayName: 'User',
  loginWithEmail: async () => {},
  signupWithEmail: async () => {},
  loginWithGoogle: async () => {},
  logout: async () => {},
  switchAccount: async () => {},
  refreshSession: async () => {},
  isSupabaseConfigured: false,
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const authResolvedRef = useRef(false);

  // Helper to extract Google avatar and name from user metadata
  const extractUserMeta = useCallback((currentUser) => {
    if (!currentUser) return { avatarUrl: null, displayName: 'User' };

    const meta = currentUser.user_metadata || {};
    const identities = currentUser.identities || [];
    const firstIdentityData = identities[0]?.identity_data || {};

    const avatarUrl =
      meta.avatar_url ||
      meta.picture ||
      firstIdentityData.avatar_url ||
      firstIdentityData.picture ||
      null;

    const displayName =
      meta.full_name ||
      meta.name ||
      firstIdentityData.full_name ||
      firstIdentityData.name ||
      currentUser.email?.split('@')[0] ||
      'User';

    return { avatarUrl, displayName };
  }, []);

  // 1. Session Initialization & Listener
  useEffect(() => {
    let isMounted = true;

    // Safety timeout: Never leave the user stuck in an infinite loading spinner!
    const safetyTimer = setTimeout(() => {
      if (isMounted && !authResolvedRef.current) {
        console.warn('Auth check safety timeout reached (3.5s). Forcing loading to false.');
        authResolvedRef.current = true;
        setLoading(false);
      }
    }, 3500);

    const applySession = (newSession) => {
      authResolvedRef.current = true;
      if (!isMounted) return;
      if (newSession?.user) {
        setSession(newSession);
        setUser(newSession.user);
      } else {
        setSession(null);
        setUser(null);
      }
      setLoading(false);
    };

    if (!isSupabaseConfigured) {
      // Demo mock fallback if Supabase env vars not configured
      if (typeof window !== 'undefined') {
        const savedMock = localStorage.getItem('dion_mock_user');
        if (savedMock) {
          try {
            const parsed = JSON.parse(savedMock);
            applySession({ user: parsed });
            clearTimeout(safetyTimer);
            return;
          } catch (e) {}
        }
      }
      applySession(null);
      clearTimeout(safetyTimer);
      return;
    }

    // 1. Listen for Supabase auth state change (Catches OAuth callback events like SIGNED_IN & INITIAL_SESSION)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (!isMounted) return;
      if (newSession?.user) {
        applySession(newSession);
        clearTimeout(safetyTimer);
      } else if (event === 'SIGNED_OUT') {
        applySession(null);
        clearTimeout(safetyTimer);
      } else if (event === 'INITIAL_SESSION') {
        applySession(newSession || null);
        clearTimeout(safetyTimer);
      }
    });

    // 2. Fetch active session directly from Supabase
    supabase.auth.getSession()
      .then(({ data: { session: activeSession }, error }) => {
        if (!isMounted) return;
        if (error) {
          console.warn('getSession warning:', error.message);
        }
        if (activeSession?.user) {
          applySession(activeSession);
          clearTimeout(safetyTimer);
        } else if (!authResolvedRef.current) {
          // Check if there is an OAuth hash or code still being processed
          const hasOAuthParams = typeof window !== 'undefined' && (
            window.location.hash.includes('access_token') ||
            window.location.search.includes('code=')
          );
          if (!hasOAuthParams) {
            applySession(null);
            clearTimeout(safetyTimer);
          }
        }
      })
      .catch((err) => {
        console.error('getSession exception:', err);
        applySession(null);
        clearTimeout(safetyTimer);
      });

    return () => {
      isMounted = false;
      clearTimeout(safetyTimer);
      subscription?.unsubscribe();
    };
  }, []);

  // Login with Email & Password
  const loginWithEmail = async (email, password) => {
    setLoading(true);
    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          toast.error(error.message);
          throw error;
        }
        setUser(data.user);
        setSession(data.session);
        toast.success('Logged in successfully!');
        return { success: true, user: data.user };
      } else {
        const mockUser = {
          id: 'user_' + Date.now(),
          email: email,
          user_metadata: { full_name: email.split('@')[0] },
          app_metadata: { provider: 'email' },
          created_at: new Date().toISOString(),
        };
        localStorage.setItem('dion_mock_user', JSON.stringify(mockUser));
        setUser(mockUser);
        setSession({ user: mockUser });
        toast.success('Logged in (Demo mode)');
        return { success: true, user: mockUser };
      }
    } finally {
      setLoading(false);
    }
  };

  // Sign up with Email & Password
  const signupWithEmail = async (email, password) => {
    setLoading(true);
    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) {
          toast.error(error.message);
          throw error;
        }
        setUser(data.user);
        setSession(data.session);
        toast.success('Account created successfully!');
        return { success: true, user: data.user };
      } else {
        const mockUser = {
          id: 'user_' + Date.now(),
          email: email,
          user_metadata: { full_name: email.split('@')[0] },
          app_metadata: { provider: 'email' },
          created_at: new Date().toISOString(),
        };
        localStorage.setItem('dion_mock_user', JSON.stringify(mockUser));
        setUser(mockUser);
        setSession({ user: mockUser });
        toast.success('Account created (Demo mode)');
        return { success: true, user: mockUser };
      }
    } finally {
      setLoading(false);
    }
  };

  // Continue with Google (OAuth)
  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      if (isSupabaseConfigured) {
        const origin = typeof window !== 'undefined' ? window.location.origin : '';
        const redirectTo = `${origin}/dashboard`;

        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo,
            queryParams: {
              access_type: 'offline',
              prompt: 'consent',
            },
          },
        });

        if (error) {
          toast.error(error.message);
          setLoading(false);
          throw error;
        }
      } else {
        const mockGoogleUser = {
          id: 'google_user_01',
          email: 'partner@google-workspace.com',
          user_metadata: {
            full_name: 'Verified Google User',
            avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
          },
          app_metadata: { provider: 'google' },
          created_at: new Date().toISOString(),
        };
        localStorage.setItem('dion_mock_user', JSON.stringify(mockGoogleUser));
        setUser(mockGoogleUser);
        setSession({ user: mockGoogleUser });
        router.push('/dashboard');
      }
    } catch (err) {
      console.error('Google login error:', err);
      toast.error(err.message || 'Failed to initiate Google sign in');
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    setLoading(true);
    try {
      if (isSupabaseConfigured) {
        await supabase.auth.signOut();
      }
      if (typeof window !== 'undefined') {
        localStorage.removeItem('dion_mock_user');
      }
      setUser(null);
      setSession(null);
      toast.success('Signed out');
      router.push('/login');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setLoading(false);
    }
  };

  const switchAccount = async () => {
    await logout();
  };

  const refreshSession = async () => {
    if (!isSupabaseConfigured) return;
    const { data: { session: activeSession } } = await supabase.auth.getSession();
    if (activeSession) {
      setSession(activeSession);
      setUser(activeSession.user);
    }
  };

  const { avatarUrl, displayName } = extractUserMeta(user);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        avatarUrl,
        displayName,
        loginWithEmail,
        signupWithEmail,
        loginWithGoogle,
        logout,
        switchAccount,
        refreshSession,
        isSupabaseConfigured,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
