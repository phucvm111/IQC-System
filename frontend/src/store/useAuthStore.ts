import { create } from 'zustand';

interface AuthState {
  token: string | null;
  username: string | null;
  role: string | null;
  setAuth: (token: string, username: string, role: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('auth_token'),
  username: localStorage.getItem('auth_username'),
  role: localStorage.getItem('auth_role'),
  setAuth: (token, username, role) => {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_username', username);
    localStorage.setItem('auth_role', role);
    set({ token, username, role });
  },
  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_username');
    localStorage.removeItem('auth_role');
    set({ token: null, username: null, role: null });
  },
}));
