// 'use client';
// import Image from 'next/image';
// import Link from 'next/link';
// import { useAuth } from '../context/AuthContext';
// import { useRouter } from 'next/navigation';
// import { jwtDecode } from 'jwt-decode';

// interface DecodedToken {
//   role: string;
//   userId: number;
//   houseId: number;
//   sub: string;
//   iat: number;
//   exp: number;
// }

// export default function Navbar() {
//   const { token, logout, isLoading } = useAuth();
//   const router = useRouter();
//   let isAdmin = false;
//   if (token) {
//     try {
//       const decoded: DecodedToken = jwtDecode(token);
//       isAdmin = decoded.role === 'ROLE_ADMIN';
//     } catch (err) {
//       console.error('Token decoding failed:', err);
//     }
//   }

//   const handleSignOut = () => {
//     logout();
//     router.push('/');
//   };

//   if (isLoading) {
//     return null; // Or a loading spinner if you prefer
//   }

//   return (
//     <nav className="p-6" style={{ backgroundColor: '#008080' }}>
//       <div className="container mx-auto flex items-center justify-between">
//         <Link href="/">
//           <div className="flex items-center">
//             <Image src="/logo.png" alt="Logo" width={200} height={200} />
//           </div>
//         </Link>

//         <div className="flex space-x-4 items-center">
//           <Link href="/" className="text-white hover:text-gray-300 text-xl">Home</Link>
//           <Link href="/servicesweoffer" className="text-white hover:text-gray-300 text-xl">Service</Link>
//           <Link href="/aboutus" className="text-white hover:text-gray-300 text-xl">About Us</Link>

//           {token ? (
//             <>
//               <Link
//                 href={isAdmin ? "/user-dashboard" : "/device-dashboard"}
//                 className="text-white hover:text-gray-300 text-xl"
//               >
//                 {isAdmin ? 'Dashboards' : 'Dashboard'}
//               </Link>
//               {isAdmin && (
//                 <Link href="/manage-keys" className="text-white hover:text-gray-300 text-xl">Manage Keys</Link>
//               )}
//               <Link href="/chat" className="text-white hover:text-gray-300 text-xl">Chat</Link>
//               <button 
//                 onClick={handleSignOut}
//                 className="text-white hover:text-gray-300 text-xl bg-transparent border-none cursor-pointer"
//               >
//                 Sign Out
//               </button>
//             </>
//           ) : (
//             <Link href="/signup" className="text-white hover:text-gray-300 text-xl">Sign Up</Link>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// }

//Responsive Navbar
'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { Menu, X } from 'lucide-react';

interface DecodedToken {
  role: string;
  userId: number;
  houseId: number;
  sub: string;
  iat: number;
  exp: number;
}

// Define navigation items outside component since they're static
const navigationItems = {
  common: [
    { href: '/', text: 'Home' },
    { href: '/servicesweoffer', text: 'Service' },
    { href: '/aboutus', text: 'About Us' }
  ],
  authenticated: [
    { href: '/chat', text: 'Chat' }
  ],
  admin: [
    { href: '/manage-keys', text: 'Manage Keys' }
  ]
};

export default function Navbar() {
  // All hooks need to be called on every render in the same order
  const { token, logout, isLoading, isInitialized } = useAuth();
  const router = useRouter();
  
  // State hooks
  const [state, setState] = useState({
    isMenuOpen: false,
    isAdmin: false
  });

  // Decode token and check admin status
  useEffect(() => {
    if (!token) {
      setState(prev => ({ ...prev, isAdmin: false }));
      return;
    }

    try {
      const decoded: DecodedToken = jwtDecode(token);
      setState(prev => ({ ...prev, isAdmin: decoded.role === 'ROLE_ADMIN' }));
    } catch (err) {
      console.error('Token decoding failed:', err);
      setState(prev => ({ ...prev, isAdmin: false }));
    }
  }, [token]);  // Handle route changes
  useEffect(() => {
    let mounted = true;
    const handleRouteChange = () => {
      if (mounted) {
        setState(prev => ({ ...prev, isMenuOpen: false }));
      }
    };

    window.addEventListener('popstate', handleRouteChange);
    
    return () => {
      mounted = false;
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);
  const handleSignOut = useCallback(() => {
    setState(prev => ({ ...prev, isMenuOpen: false }));
    logout();
  }, [logout]);

  const toggleMenu = useCallback(() => {
    setState(prev => ({ ...prev, isMenuOpen: !prev.isMenuOpen }));
  }, []);

  // Early return while loading
  if (!isInitialized || isLoading) {
    return null;
  }

  const { isMenuOpen, isAdmin } = state;
  
  return (
    <nav className="p-6" style={{ backgroundColor: '#008080' }}>
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center">
              <Image src="/logo.png" alt="Logo" width={200} height={200} />
            </div>
          </Link>

          {/* Mobile menu button */}
          <button 
            onClick={toggleMenu}
            className="md:hidden text-white hover:text-gray-300"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop navigation */}
          <div className="hidden md:flex space-x-4 items-center">
            {navigationItems.common.map(item => (
              <Link 
                key={item.href} 
                href={item.href} 
                className="text-white hover:text-gray-300 text-xl"
              >
                {item.text}
              </Link>
            ))}

            {token ? (
              <>
                <Link
                  href={isAdmin ? "/user-dashboard" : "/device-dashboard"}
                  className="text-white hover:text-gray-300 text-xl"
                >
                  {isAdmin ? 'Dashboards' : 'Dashboard'}
                </Link>
                {isAdmin && navigationItems.admin.map(item => (
                  <Link 
                    key={item.href}
                    href={item.href}
                    className="text-white hover:text-gray-300 text-xl"
                  >
                    {item.text}
                  </Link>
                ))}
                {navigationItems.authenticated.map(item => (
                  <Link 
                    key={item.href}
                    href={item.href}
                    className="text-white hover:text-gray-300 text-xl"
                  >
                    {item.text}
                  </Link>
                ))}
                <button 
                  onClick={handleSignOut}
                  className="text-white hover:text-gray-300 text-xl bg-transparent border-none cursor-pointer"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link href="/signup" className="text-white hover:text-gray-300 text-xl">
                Sign Up
              </Link>
            )}
          </div>
        </div>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 flex flex-col space-y-4">
            {navigationItems.common.map(item => (
              <Link 
                key={item.href}
                href={item.href}
                className="text-white hover:text-gray-300 text-lg"
              >
                {item.text}
              </Link>
            ))}

            {token ? (
              <>
                <Link
                  href={isAdmin ? "/user-dashboard" : "/device-dashboard"}
                  className="text-white hover:text-gray-300 text-lg"
                >
                  {isAdmin ? 'Dashboards' : 'Dashboard'}
                </Link>
                {isAdmin && navigationItems.admin.map(item => (
                  <Link 
                    key={item.href}
                    href={item.href}
                    className="text-white hover:text-gray-300 text-lg"
                  >
                    {item.text}
                  </Link>
                ))}
                {navigationItems.authenticated.map(item => (
                  <Link 
                    key={item.href}
                    href={item.href}
                    className="text-white hover:text-gray-300 text-lg"
                  >
                    {item.text}
                  </Link>
                ))}
                <button 
                  onClick={handleSignOut}
                  className="text-white hover:text-gray-300 text-lg bg-transparent border-none cursor-pointer text-left"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link href="/signup" className="text-white hover:text-gray-300 text-lg">
                Sign Up
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}