
"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  username: string;
}

interface Session {
  user: User | null;
  loading: boolean;
  refresh: () => Promise<void>;
}

let isRefreshing = false;

export function useSession(): Session {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUser = useCallback(async () => {
    if (isRefreshing) return;
    isRefreshing = true;

    try {
      const res = await fetch(`/api/auth/session`, {
      });

      if (res.ok) {
        const data = await res.json() as User;
        setUser(data);
        setLoading(false);
        return;
      }

      if (res.status === 401) {
        await fetch(`/api/auth/refresh`, {
        });

        const retry = await fetch(`/api/auth/session`, {
        });

        if (retry.ok) {
          const retryData = await retry.json() as User;
          setUser(retryData);
        } else {
          setUser(null);
          router.push("/login");
        }
      }
    } catch (err) {
      console.error("Session fetch failed:", err);
      setUser(null);
    } finally {
      setLoading(false);
      isRefreshing = false;
    }
  }, [router]);
  

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const refresh = async () => {
    await fetchUser();
  };

  return { user, loading, refresh };
}
