import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface AuthContextType {
  user: any;
  token: string | null;
  setUser: (user: any) => void;
  setToken: (token: string) => void;
  logout: () => void; // ✅ ADDED
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  setUser: () => {},
  setToken: () => {},
  logout: () => {}, // ✅ ADDED
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<any>(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setTokenState] = useState<string | null>(() => {
    return localStorage.getItem("token");
  });

  // ✅ WRAP setters to sync with localStorage
  const setUser = (user: any) => {
    setUserState(user);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const setToken = (token: string) => {
    setTokenState(token);
    localStorage.setItem("token", token);
  };

  // 🔥 LOGOUT FUNCTION (MAIN FIX)
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUserState(null);
    setTokenState(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, setUser, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);