import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { isAdmin, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push('/(tabs)/dashboard');
    }
  }, [isLoading, isAdmin, router]);

  if (isLoading || !isAdmin) {
    return null; // Or a loading spinner
  }

  return <>{children}</>;
}
