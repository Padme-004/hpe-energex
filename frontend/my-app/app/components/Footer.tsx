import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white px-4 py-8 sm:px-6 lg:px-16">
      <div className="max-w-screen-xl mx-auto">
        {/* Footer Grid Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Our Services Section */}
          <div>
            <h2 className="text-lg sm:text-xl font-bold mb-4">Our Services</h2>
            <ul className="space-y-2 text-sm sm:text-base">
              <li>Financial Planning</li>
              <li>Analyze Consumption Patterns</li>
              <li>Set Schedule</li>
              <li>Remeasurable Sources</li>
            </ul>
          </div>

          {/* Explore More Section */}
          <div>
            <h2 className="text-lg sm:text-xl font-bold mb-4">Explore More</h2>
            <ul className="space-y-2 text-sm sm:text-base">
              <li>
                <Link href="/about" className="hover:text-gray-300">About Us</Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-gray-300">Privacy</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gray-300">Contact Details</Link>
              </li>
              <li>Immobiliating/grammatic com</li>
              <li>+91 97422 82800</li>
            </ul>
          </div>

          {/* Social Media Section */}
          <div>
            <h2 className="text-lg sm:text-xl font-bold mb-4">Follow Us</h2>
            <div className="flex flex-wrap gap-4 text-sm sm:text-base">
              <Link href="https://facebook.com" className="hover:text-gray-300">
                Facebook
              </Link>
              <Link href="https://twitter.com" className="hover:text-gray-300">
                Twitter
              </Link>
              <Link href="https://instagram.com" className="hover:text-gray-300">
                Instagram
              </Link>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-6"></div>

        {/* Legal & Policy Info */}
        <div className="text-center text-sm">
          <p>&copy; {new Date().getFullYear()} AMDIS. All rights reserved.</p>
          <div className="flex justify-center flex-wrap gap-4 mt-2">
            <Link href="/terms" className="hover:text-gray-300">
              Terms & Conditions
            </Link>
            <Link href="/privacy-policy" className="hover:text-gray-300">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
