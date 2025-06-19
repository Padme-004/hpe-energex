// 'use client';
// import { useAuth } from '../context/AuthContext';
// import { redirect } from 'next/navigation';
// import LoadingSpinner from '../components/LoadingSpinner'; // Your custom spinner

// export default function ProtectedLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const { isAuthenticated, isLoading } = useAuth();

//   // Show loading state while checking auth
//   if (isLoading) {
//     return (
//       <div className="flex h-screen items-center justify-center">
//         <LoadingSpinner /> {/* Or any loading UI */}
//       </div>
//     );
//   }

//   // Redirect if not authenticated
//   if (!isAuthenticated) {
//     redirect('/signin'); // Server-side redirect (no flash)
//   }

//   // Render protected content
//   return <>{children}</>;
// }

//Responsive protected layout
'use client';
import { useAuth } from '../context/AuthContext';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();

  // Protected routes are now handled by ClientLayout
  // This component just wraps the content with appropriate styling
  return (
    <div className="w-full px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 max-w-screen-2xl mx-auto">
      {children}
    </div>
  );
}
