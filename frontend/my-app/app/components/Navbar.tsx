// "use client"; //Different navbars for different people by checking repeatedly for the jwt token. Next version aims to do the same thing via simply passing the access token
// import Image from 'next/image';
// import Link from 'next/link';
// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';

// export default function Navbar() {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const router = useRouter();

//   useEffect(() => {
//     // Check auth status on component mount
//     const token = localStorage.getItem('jwt');
//     setIsAuthenticated(!!token);
//   }, []);

//   const handleSignOut = () => {
//     // 1. Clear all auth traces
//     localStorage.removeItem('jwt');
//     // dispatch(clearAuth()); // Uncomment if using Redux
    
//     // 2. Update UI state
//     setIsAuthenticated(false);
    
//     // 3. Redirect to homepage
//     router.push('/');
//   };

//   return (
//     <nav className="p-6" style={{ backgroundColor: '#008080' }}>
//       <div className="container mx-auto flex items-center justify-between">
//         {/* Logo */}
//         <Link href="/">
//           <div className="flex items-center">
//             <Image src="/logo.png" alt="Logo" width={200} height={200} />
//           </div>
//         </Link>

//         {/* Navigation Links */}
//         <div className="flex space-x-4 items-center">
//           {/* Always visible to ALL users */}
//           <Link href="/" className="text-white hover:text-gray-300 text-xl">
//             Home
//           </Link>
//           <Link href="/servicesweoffer" className="text-white hover:text-gray-300 text-xl">
//             Service
//           </Link>
//           <Link href="/aboutus" className="text-white hover:text-gray-300 text-xl">
//             About Us
//           </Link>

//           {/* ONLY for logged-in users */}
//           {isAuthenticated && (
//             <>
//               <Link href="/contact" className="text-white hover:text-gray-300 text-xl">
//                 Dashboard
//               </Link>
//               <Link href="/chat" className="text-white hover:text-gray-300 text-xl">
//                 Chat
//               </Link>
//             </>
//           )}

//           {/* Auth-specific button */}
//           {isAuthenticated ? (
//             <button 
//               onClick={handleSignOut}
//               className="text-white hover:text-gray-300 text-xl bg-transparent border-none cursor-pointer"
//             >
//               Sign Out
//             </button>
//           ) : (
//             <Link href="/signup" className="text-white hover:text-gray-300 text-xl">
//               Sign Up
//             </Link>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// }
// components/Navbar.tsx
'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { token, logout } = useAuth(); // Changed from accessToken to token
  const router = useRouter();

  const handleSignOut = () => {
    logout();
    router.push('/');
  };

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

          {token ? ( // Changed from accessToken to token
            <>
              <Link href="/contact" className="text-white hover:text-gray-300 text-xl">Dashboard</Link>
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