"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { User, Session } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  role: "user" | "admin" | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null; role: "user" | "admin" | null }>;
  signUp: (
    email: string,
    password: string,
    metadata?: { full_name?: string; phone?: string }
  ) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<"user" | "admin" | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchRole = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single() as { data: { role: string } | null };
    const userRole = (data?.role as "user" | "admin") || "user";
    setRole(userRole);
    return userRole;
  }, [supabase]);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        await fetchRole(s.user.id);
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        await fetchRole(s.user.id);
      } else {
        setRole(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase, fetchRole]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error: error.message, role: null };
      const userRole = data.user ? await fetchRole(data.user.id) : null;
      return { error: null, role: userRole };
    },
    [supabase, fetchRole]
  );

  const signUp = useCallback(
    async (
      email: string,
      password: string,
      metadata?: { full_name?: string; phone?: string }
    ) => {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: metadata },
      });
      return { error: error?.message ?? null };
    },
    [supabase]
  );

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setRole(null);
  }, [supabase]);

  return (
    <AuthContext.Provider value={{ user, session, role, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
