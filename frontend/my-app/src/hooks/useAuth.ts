// hooks/useAuth.ts
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface UserInfo {
  userId: number;
  houseId: number;
  role: string;
}

export const useAuth = () => {
  const [token, setToken] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const router = useRouter();

  useEffect(() => {
    const jwtToken = localStorage.getItem('jwt');
    const storedUserInfo = localStorage.getItem('user');

    if (jwtToken) setToken(jwtToken);
    if (storedUserInfo) {
      try {
        setUserInfo(JSON.parse(storedUserInfo));
      } catch (err) {
        console.error('Error parsing user info:', err);
        router.push('/login');
      }
    } else {
      router.push('/login');
    }
  }, [router]);

  return { token, userInfo };
};
