import { create } from "zustand";

import type { AuthUser } from "../utils/authSession";

interface AuthState {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,

  setUser: (user) => {
    set({ user });
  },

  logout: () => {
    set({ user: null });
  },
}));