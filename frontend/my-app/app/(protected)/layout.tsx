'use client';
import { useAuth } from '../context/AuthContext';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 max-w-screen-2xl mx-auto">
      {children}
    </div>
  );
}
