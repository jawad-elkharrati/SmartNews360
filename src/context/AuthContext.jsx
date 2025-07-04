
import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('auth'));
      return saved ?? null;
    } catch {
      return null;
    }
  });

  const login = (username, password) => {
    const ok = username === 'admin' && password === 'admin';
    if (ok) {
      const newUser = { username };
      setUser(newUser);
      localStorage.setItem('auth', JSON.stringify(newUser));
    }
    return ok;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth');
  };

  useEffect(() => {
    const sync = (e) => {
      if (e.key === 'auth') {
        setUser(e.newValue ? JSON.parse(e.newValue) : null);
      }
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
