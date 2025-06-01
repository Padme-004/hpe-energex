'use client';
import { useAuth } from '../context/AuthContext';
import { redirect } from 'next/navigation';
import LoadingSpinner from '../components/LoadingSpinner'; // Your custom spinner

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner /> {/* Or any loading UI */}
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    redirect('/signin'); // Server-side redirect (no flash)
  }

  // Render protected content
  return <>{children}</>;
}