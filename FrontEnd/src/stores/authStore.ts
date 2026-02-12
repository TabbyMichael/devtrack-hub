import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(persist((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (email: string, _password: string) => {
    set({ isLoading: true });
    await new Promise((r) => setTimeout(r, 800));
    set({
      user: { id: '1', name: email.split('@')[0], email, avatar: undefined },
      isAuthenticated: true,
      isLoading: false,
    });
  },

  register: async (name: string, email: string, _password: string) => {
    set({ isLoading: true });
    await new Promise((r) => setTimeout(r, 800));
    set({
      user: { id: '1', name, email, avatar: undefined },
      isAuthenticated: true,
      isLoading: false,
    });
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
}), { name: 'devtrack-auth' }));
