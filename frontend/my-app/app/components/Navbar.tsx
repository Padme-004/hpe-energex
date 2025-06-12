'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  role: string;
  userId: number;
  houseId: number;
  sub: string;
  iat: number;
  exp: number;
}

export default function Navbar() {
  const { token, logout, isLoading } = useAuth();
  const router = useRouter();
  let isAdmin = false;
  if (token) {
    try {
      const decoded: DecodedToken = jwtDecode(token);
      isAdmin = decoded.role === 'ROLE_ADMIN';
    } catch (err) {
      console.error('Token decoding failed:', err);
    }
  }

  const handleSignOut = () => {
    logout();
    router.push('/');
  };

  if (isLoading) {
    return null; // Or a loading spinner if you prefer
  }

  return (
    <nav className="p-6" style={{ backgroundColor: '#008080' }}>
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/">
          <div className="flex items-center">
            <Image src="/logo.png" alt="Logo" width={200} height={200} />
          </div>
        </Link>

        <div className="flex space-x-4 items-center">
          <Link href="/" className="text-white hover:text-gray-300 text-xl">Home</Link>
          <Link href="/servicesweoffer" className="text-white hover:text-gray-300 text-xl">Service</Link>
          <Link href="/aboutus" className="text-white hover:text-gray-300 text-xl">About Us</Link>

          {token ? (
            <>
              <Link
                href={isAdmin ? "/user-dashboard" : "/device-dashboard"}
                className="text-white hover:text-gray-300 text-xl"
              >
                {isAdmin ? 'Dashboards' : 'Dashboard'}
              </Link>
              {isAdmin && (
                <Link href="/manage-keys" className="text-white hover:text-gray-300 text-xl">Manage Keys</Link>
              )}
              <Link href="/chat" className="text-white hover:text-gray-300 text-xl">Chat</Link>
              <button 
                onClick={handleSignOut}
                className="text-white hover:text-gray-300 text-xl bg-transparent border-none cursor-pointer"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link href="/signup" className="text-white hover:text-gray-300 text-xl">Sign Up</Link>
          )}
        </div>
      </div>
    </nav>
  );
}