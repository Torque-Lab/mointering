"use client";
import { useRouter } from "next/navigation";
import React, { createContext, useState, useContext, useCallback, useEffect } from "react";

interface User {
  id: string;
  name: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
}
let isRefreshing=false;
const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  const fetchUser = useCallback(async () => {
    if (isRefreshing) return;
    isRefreshing = true;
    
    try {
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/me`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      console.log(response,"response");

      if (response.ok) {
        const data = await response.json() as User;
        setUser(data);
        console.log(data,"data");
        setLoading(false);
        isRefreshing = false;
        return;
      }

    
      if (response.status === 401) {
        await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        const retry = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/me`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (retry.ok) {
          const dataRetry = await retry.json() as User;
          setUser(dataRetry);
        } else {
          setUser(null);
          router.push("/login");
        }
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setUser(null);
    } finally {
      setLoading(false);
      isRefreshing = false;
    }
  }, [router]);

  const refreshUser = async () => {
    await fetchUser();
  };
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
