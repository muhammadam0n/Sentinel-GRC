import React, { createContext, useContext, useMemo, useState, useEffect } from "react";

type User = { id: string; email: string; name?: string; role: string };

type StoredUser = User & { password: string };

type AuthContextValue = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, name: string, password: string) => Promise<void>;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const sessionStorageKey = "sentinel_grc_auth_session";
const usersStorageKey = "sentinel_grc_auth_users";

const loadUsers = (): StoredUser[] => {
  try {
    const raw = localStorage.getItem(usersStorageKey);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredUser[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveUsers = (users: StoredUser[]) => {
  localStorage.setItem(usersStorageKey, JSON.stringify(users));
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(sessionStorageKey);
      if (saved) {
        const parsed = JSON.parse(saved) as { user: User };
        if (parsed?.user?.email) setUser(parsed.user);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const api = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      login: async (email, password) => {
        const users = loadUsers();
        const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
        if (!existing || existing.password !== password) {
          throw new Error("Invalid email or password");
        }
        const sessionUser: User = {
          id: existing.id,
          email: existing.email,
          name: existing.name,
          role: existing.role
        };
        localStorage.setItem(sessionStorageKey, JSON.stringify({ user: sessionUser }));
        setUser(sessionUser);
      },
      logout: () => {
        localStorage.removeItem(sessionStorageKey);
        setUser(null);
      },
      register: async (email, name, password) => {
        const users = loadUsers();
        const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
        if (exists) {
          throw new Error("This email is already registered");
        }
        const newUser: StoredUser = {
          id: `u-${Math.random().toString(16).slice(2)}`,
          email,
          name,
          role: "Security Analyst",
          password
        };
        const next = [newUser, ...users];
        saveUsers(next);
      }
    }),
    [user, isLoading]
  );

  return <AuthContext.Provider value={api}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
