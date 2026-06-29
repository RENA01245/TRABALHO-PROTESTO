import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { api } from "./api";

type User = { id: string; name: string; email: string; role: "ADMIN" | "EMPLOYEE" };
type AuthContextData = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    if (!localStorage.getItem("token")) return;
    api.get("/auth/me").then((response) => setUser(response.data.user)).catch(() => logout());
  }, []);

  async function login(email: string, password: string) {
    const response = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));
    setUser(response.data.user);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }

  const value = useMemo(() => ({ user, login, logout }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
