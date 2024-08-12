import { create } from "zustand";

interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  login: (
    accessToken: string,
    refreshToken: string,
    rememberMe: boolean
  ) => void;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  accessToken: null,
  refreshToken: null,
  login: (accessToken: string, refreshToken: string, rememberMe: boolean) => {
    if (rememberMe) {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
    } else {
      sessionStorage.setItem("accessToken", accessToken);
      sessionStorage.setItem("refreshToken", refreshToken);
    }
    set({ isAuthenticated: true, accessToken, refreshToken });
  },
  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
    set({
      isAuthenticated: false,
      accessToken: null,
      refreshToken: null,
    });
  },
  checkAuth: () => {
    const accessToken =
      localStorage.getItem("accessToken") ||
      sessionStorage.getItem("accessToken");
    const refreshToken =
      localStorage.getItem("refreshToken") ||
      sessionStorage.getItem("refreshToken");

    if (accessToken && refreshToken) {
      set({ isAuthenticated: true, accessToken, refreshToken });
    } else {
      set({
        isAuthenticated: false,
        accessToken: null,
        refreshToken: null,
      });
    }
  },
}));
