export type Role = 'ADMIN' | 'DOCTOR' | 'NURSE';

export interface User {
  uid: string;
  email: string;
  displayName?: string | null;
  role: Role;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => Promise<void>;
}

