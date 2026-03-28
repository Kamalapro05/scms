import { createContext, useContext, useState, useEffect } from "react";
import API from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      // Manually set header for this first call
      API.get("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => setUser(res.data))
        .catch(() => { localStorage.clear(); setUser(null); })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await API.post("/api/auth/login", { email, password });
    const { access_token, role, user_id } = res.data;
    localStorage.setItem("access_token", access_token);
    localStorage.setItem("role", role);
    localStorage.setItem("user_id", user_id);
    const me = await API.get("/api/auth/me", {
      headers: { Authorization: `Bearer ${access_token}` }
    });
    setUser(me.data);
    return role;
  };

  const logout = () => { localStorage.clear(); setUser(null); };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);