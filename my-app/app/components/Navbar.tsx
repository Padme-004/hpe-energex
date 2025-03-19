// app/components/Navbar.tsx
import Image from 'next/image';
import Link from 'next/link';



export default function Navbar() {
  return (
    <nav className="p-6" style={{ backgroundColor: '#008080' }}>
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center">
            <Image
              src="/logo.png" 
              alt="Logo"
              width={200} 
              height={200}
            
            />
          </div>
        </Link>

        
        <div className="flex space-x-4">
          <Link href="/" className="text-white hover:text-gray-300 text-xl">
            Home
          </Link>
          <Link href="/about" className="text-white hover:text-gray-300 text-xl">
            Service
          </Link>
          <Link href="/contact" className="text-white hover:text-gray-300 text-xl">
            About Us
          </Link>
          <Link href="/contact" className="text-white hover:text-gray-300 text-xl">
            Dashboard
          </Link>
          <Link href="/chat" className="text-white hover:text-gray-300 text-xl">
            Chat
          </Link>
          <Link href="/signup" className="text-white hover:text-gray-300 text-xl">
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
}