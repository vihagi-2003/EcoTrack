
import { createContext, useContext, useState } from "react";
import api from "../api";

const C = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("ecotrack_user") || "null")
  );

  const login = async (d) => {
    const r = await api.post("/auth/login", d);

    localStorage.setItem("ecotrack_token", r.data.token);
    localStorage.setItem("ecotrack_user", JSON.stringify(r.data.user));

    setUser(r.data.user);
  };

  const register = async (d) => {
    const r = await api.post("/auth/register", d);

    localStorage.setItem("ecotrack_token", r.data.token);
    localStorage.setItem("ecotrack_user", JSON.stringify(r.data.user));

    setUser(r.data.user);
  };

  const logout = () => {
    localStorage.removeItem("ecotrack_token");
    localStorage.removeItem("ecotrack_user");
    setUser(null);
  };

  return (
    <C.Provider value={{ user, login, register, logout }}>
      {children}
    </C.Provider>
  );
}

export const useAuth = () => useContext(C);
