'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { api, TOKEN_KEY } from '@/lib/api';
import type { User } from '@/lib/types';

interface AuthContextValue {
  user: User | null;
  ready: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  followingIds: Set<string>;
  isFollowing: (id: string) => boolean;
  toggleFollow: (id: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [followingIds, setFollowingIds] = useState<Set<string>>(new Set());

  const loadFollowing = useCallback(async () => {
    try {
      const list = await api.getFollowing();
      setFollowingIds(new Set(list.map((p) => p.id)));
    } catch {
      setFollowingIds(new Set());
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setReady(true);
      return;
    }
    api
      .me()
      .then(async (u) => {
        setUser(u);
        await loadFollowing();
      })
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setReady(true));
  }, [loadFollowing]);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await api.login(email, password);
      localStorage.setItem(TOKEN_KEY, res.accessToken);
      setUser(res.user);
      await loadFollowing();
    },
    [loadFollowing],
  );

  const register = useCallback(async (name: string, email: string, password: string) => {
    const res = await api.register(name, email, password);
    localStorage.setItem(TOKEN_KEY, res.accessToken);
    setUser(res.user);
    setFollowingIds(new Set());
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.logout();
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
      setFollowingIds(new Set());
    }
  }, []);

  const toggleFollow = useCallback(
    async (id: string) => {
      const following = followingIds.has(id);
      // atualizacao otimista
      setFollowingIds((prev) => {
        const next = new Set(prev);
        if (following) next.delete(id);
        else next.add(id);
        return next;
      });
      try {
        if (following) await api.unfollow(id);
        else await api.follow(id);
      } catch (e) {
        await loadFollowing();
        throw e;
      }
    },
    [followingIds, loadFollowing],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      ready,
      login,
      register,
      logout,
      followingIds,
      isFollowing: (id) => followingIds.has(id),
      toggleFollow,
    }),
    [user, ready, login, register, logout, followingIds, toggleFollow],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>');
  return ctx;
}
