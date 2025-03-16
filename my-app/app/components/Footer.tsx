// app/components/Footer.tsx
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white p-8">
      <div className="container mx-auto">
        {/* Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Our Services Section */}
          <div>
            <h2 className="text-xl font-bold mb-4">Our Services</h2>
            <ul className="space-y-2">
              <li>Financial Planning</li>
              <li>Analyze Consumption Patterns</li>
              <li>Set Schedule</li>
              <li>Remeasurable Sources</li>
            </ul>
          </div>

          {/* Explore More Section */}
          <div>
            <h2 className="text-xl font-bold mb-4">Explore More</h2>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="hover:text-gray-300">
                  About us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-gray-300">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gray-300">
                  Contact Details
                </Link>
              </li>
              <li>Immobiliating/grammatic com</li>
              <li>91+9742282800</li>
            </ul>
          </div>

          {/* Social Media Section */}
          <div>
            <h2 className="text-xl font-bold mb-4">Follow Us</h2>
            <div className="flex space-x-4">
              <Link
                href="https://facebook.com"
                className="hover:text-gray-300"
              >
                Facebook
              </Link>
              <Link
                href="https://twitter.com"
                className="hover:text-gray-300"
              >
                Twitter
              </Link>
              <Link
                href="https://instagram.com"
                className="hover:text-gray-300"
              >
                Instagram
              </Link>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-6"></div>

        {/* Legal Information */}
        <div className="text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} AMDIS. All rights reserved.
          </p>
          <div className="flex justify-center space-x-4 mt-2">
            <Link href="/terms" className="text-sm hover:text-gray-300">
              Terms & Conditions
            </Link>
            <Link href="/privacy-policy" className="text-sm hover:text-gray-300">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}