'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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

  // 1. Core Session Initialization & OAuth Callback handling
  useEffect(() => {
    let isMounted = true;

    const initSession = async () => {
      try {
        if (!isSupabaseConfigured) {
          // Check local mock user if Supabase credentials are not yet set
          if (typeof window !== 'undefined') {
            const savedMock = localStorage.getItem('dion_mock_user');
            if (savedMock && isMounted) {
              const parsed = JSON.parse(savedMock);
              setUser(parsed);
              setSession({ user: parsed });
            }
          }
          if (isMounted) setLoading(false);
          return;
        }

        // Check if there is an OAuth PKCE code in the URL
        if (typeof window !== 'undefined') {
          const url = new URL(window.location.href);
          const code = url.searchParams.get('code');

          if (code) {
            try {
              const { data, error } = await supabase.auth.exchangeCodeForSession(code);
              if (error) {
                console.error('Error exchanging OAuth code for session:', error.message);
                toast.error(error.message);
              } else if (data?.session && isMounted) {
                setSession(data.session);
                setUser(data.session.user);
                // Clean the code parameter from the browser URL bar
                url.searchParams.delete('code');
                window.history.replaceState({}, document.title, url.pathname);
              }
            } catch (err) {
              console.warn('Code exchange handled or not required:', err);
            }
          }
        }

        // Fetch the active session from Supabase client
        const { data: { session: activeSession }, error } = await supabase.auth.getSession();

        if (error) {
          console.warn('Supabase getSession notice:', error.message);
        }

        if (activeSession && isMounted) {
          setSession(activeSession);
          setUser(activeSession.user);
        }
      } catch (err) {
        console.error('Unexpected auth initialization error:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initSession();

    // 2. Subscribe to auth state changes (crucial for Google OAuth login events)
    if (isSupabaseConfigured) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
        if (!isMounted) return;

        if (newSession?.user) {
          setSession(newSession);
          setUser(newSession.user);
        } else if (event === 'SIGNED_OUT') {
          setSession(null);
          setUser(null);
        }

        setLoading(false);
      });

      return () => {
        isMounted = false;
        subscription?.unsubscribe();
      };
    }
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
          throw error;
        }
      } else {
        // Fallback demo mode
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
        const { error } = await supabase.auth.signOut();
        if (error) {
          console.warn('Signout warning:', error.message);
        }
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

  // Switch Account
  const switchAccount = async () => {
    await logout();
  };

  // Manual refresh helper
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
