import { create } from "zustand";
import { saveToken, clearToken } from "../utils/keychain";
import { AuthState } from "../types/auth.type";

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  refreshToken: null,
  accessToken: null,
  isAuthenticated: false,
  setToken: async (token: string, refresh?: string) => {
    await saveToken(token);
    set({ accessToken: token, refreshToken: refresh, isAuthenticated: true });
  },
  setUser: (user: any) => {
    set({ user });
  },
  logOut: async () => {
    await clearToken();
    set({
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      user: null,
    });
  },
}));
