'use client';

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { token } = useAuth();
  const isLoggedIn = !!token;
  const [hasMounted, setHasMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-8 relative">
      {/* Main Content Section */}
      <section className="max-w-[80%] mx-auto">
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          {/* Left: Text */}
          <div className="flex-1 flex flex-col justify-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Navigating <span style={{ color: '#008080' }}>Global</span> Energy
            </h1>
            <p className="text-lg text-gray-700 mb-8">
              Empowering your journey to meeting your energy goals by leveraging
              the power of artificial intelligence in your daily life.
            </p>
            <div className="w-full">
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-grow p-3 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                  <a href="./signup">Get Started</a>
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center bg-gray-100 rounded-lg">
            <Image
              src="/illustration1.png"
              alt="Illustration"
              width={600}
              height={400}
              className="object-cover rounded-lg"
            />
          </div>
        </div>
      </section>

      <section className="max-w-[80%] mx-auto mt-16">
        <Image
          src="/ourexpertise.png"
          alt="Illustration"
          width={600}
          height={400}
          className="object-cover rounded-lg"
        />
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <h3 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6">
              Transforming Your Consumption With Strategic Energy Management
            </h3>
            <p className="text-lg text-gray-700 mb-8">
              Guiding you on your global energy success journey through customized & personalized consumption and prediction algorithms.
              We're committed to providing you with expert guidance, proven strategies & personalized approach.
            </p>
            <div>
              <h3 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6">
                Learn more about our mission, vision, and the team behind our success.
              </h3>
              <button className="text-2xl font-bold text-white bg-teal-500 py-2 px-4 rounded hover:bg-teal-600 transition-colors">
                About Us
              </button>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center bg-gray-100 rounded-lg">
            <Image
              src="/illustration2.png"
              alt="Expertise Illustration"
              width={600}
              height={400}
              className="object-cover rounded-lg"
            />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="max-w-[80%] mx-auto">
        <Image
          src="/ourservices.png"
          alt="Illustration"
          width={600}
          height={400}
          className="object-cover rounded-lg"
        />
        <h3 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6">
          Our Services Can Help You Make The Most Of Energy
        </h3>
        <p className="text-lg text-gray-700 mb-10 max-w-[80%]">
          Embark on a journey to unlock a world of opportunities, grow your savings with our comprehensive and expert services.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {[
            {
              title: "AI Guidance",
              description: "Rely on seasoned algorithms for tailored energy advice and strategic planning aligned with your unique goals",
              image: "/AIGuidance.png",
            },
            {
              title: "Risk Management",
              description: "We expertly handle and proactively mitigate risks, ensuring the safety of your data and overall stability",
              image: "/riskmanagement.png",
            },
            {
              title: "Customized Solutions",
              description: "Receive and benefit from energy solutions that are tailored to your unique financial aspirations and challenges",
              image: "/CustomizedSolutions.png",
            },
            {
              title: "Personalized Analysis",
              description: "Let AI analyze your production and consumption patterns to let you know where you can be better!",
              image: "/PersonalizedAnalysis.png",
            },
          ].map((service, idx) => (
            <div key={idx} className="bg-gray-100 p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-center bg-gray-200 rounded-lg mb-4 h-40">
                <Image src={service.image} alt={service.title} width={150} height={100} />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-4">{service.title}</h4>
              <p className="text-gray-700">{service.description}</p>
            </div>
          ))}
        </div>
      </section>

      {isLoggedIn && (
        <div
          className="fixed bottom-6 right-6 bg-teal-500 text-white p-4 rounded-2xl shadow-lg cursor-pointer hover:bg-teal-600 transition-transform transform hover:scale-105 z-50"
          onClick={() => router.push("/change-password")}
        >
          <h3 className="text-lg font-semibold">🔒 Change Password</h3>
          <p className="text-sm">Keep your account secure by updating your password.</p>
        </div>
      )}
    </div>
  );
}