import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!api.isAuthenticated()) {
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        const currentUser = await api.getCurrentUser();
        setUser(currentUser);
        setIsAuthenticated(true);
      } catch (err: any) {
        setError(err.message || 'Failed to load user');
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const logout = async () => {
    try {
      await api.logout();
      setUser(null);
      setIsAuthenticated(false);
      router.push('/login');
    } catch (err: any) {
      console.error('Logout error:', err);
      setUser(null);
      setIsAuthenticated(false);
      router.push('/login');
    }
  };

  return {
    user,
    loading,
    error,
    isAuthenticated,
    logout,
  };
}
