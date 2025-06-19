'use client';

import { useEffect, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import { useAuth } from '../context/AuthContext';

// Routes that should redirect to /signin if not authenticated
const protectedPaths = [
  '/device-dashboard',
  '/user-dashboard',
  '/manage-keys',
  '/chat',
  '/home-detail',
  '/device-detail',
  '/change-password'
];

// Routes that should redirect to / if authenticated
const authPaths = ['/signin', '/signup'];

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isInitialized } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isInitialized) return;

    const isProtectedRoute = protectedPaths.some(path => pathname?.startsWith(path));
    const isAuthRoute = authPaths.some(path => pathname === path);

    if (isProtectedRoute && !isAuthenticated) {
      router.replace('/signin');
    } else if (isAuthRoute && isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, isInitialized, pathname, router]);

  if (!isInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex-grow w-full px-4 sm:px-6 lg:px-8">
        {children}
      </main>
      <Footer />
    </>
  );
}
