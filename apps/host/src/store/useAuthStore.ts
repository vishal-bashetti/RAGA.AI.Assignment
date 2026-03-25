import { create } from 'zustand';
import type { User } from '@/types/auth';
import { signOut } from 'firebase/auth';
import { auth } from '@/services/firebase';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setUser: (user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  setUser: (user: User | null) => 
    set({ 
      user, 
      isAuthenticated: !!user, 
      isLoading: false, 
      error: null 
    }),

  setLoading: (isLoading: boolean) => 
    set({ isLoading }),

  setError: (error: string | null) => 
    set({ error, isLoading: false }),

  logout: async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false, 
        error: null 
      });
    }
  },
}));

