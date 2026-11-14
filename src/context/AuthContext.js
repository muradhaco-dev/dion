'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useRouter } from 'next/navigation';

const AuthContext = createContext({
  user: null,
  loading: true,
  loginWithEmail: async () => {},
  signupWithEmail: async () => {},
  loginWithGoogle: async () => {},
  logout: async () => {},
  switchAccount: async () => {},
  isSupabaseConfigured: false,
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // 1. Check local session from Supabase
    const initAuth = async () => {
      try {
        if (isSupabaseConfigured) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            setUser(session.user);
          }
        } else {
          // Check demo/local mock user
          const savedMock = localStorage.getItem('dion_mock_user');
          if (savedMock) {
            setUser(JSON.parse(savedMock));
          }
        }
      } catch (err) {
        console.warn('Auth initialization warning:', err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // 2. Subscribe to auth changes if Supabase is configured
    if (isSupabaseConfigured) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user || null);
        setLoading(false);
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  // Login with Email & Password
  const loginWithEmail = async (email, password) => {
    setLoading(true);
    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setUser(data.user);
        return { success: true, user: data.user };
      } else {
        // Fallback local auth for instant testing
        const mockUser = {
          id: 'user_' + Date.now(),
          email: email,
          user_metadata: { full_name: email.split('@')[0] },
          app_metadata: { provider: 'email' },
          created_at: new Date().toISOString(),
        };
        localStorage.setItem('dion_mock_user', JSON.stringify(mockUser));
        setUser(mockUser);
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
        if (error) throw error;
        setUser(data.user);
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
        const redirectTo = typeof window !== 'undefined' 
          ? `${window.location.origin}/dashboard` 
          : '/dashboard';
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
        if (error) throw error;
      } else {
        // Demo sign in with Google
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
        router.push('/dashboard');
      }
    } finally {
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
      localStorage.removeItem('dion_mock_user');
      setUser(null);
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  // Switch Account (per requirement in Sidebar bottom)
  const switchAccount = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginWithEmail,
        signupWithEmail,
        loginWithGoogle,
        logout,
        switchAccount,
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
