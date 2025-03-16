

import Image from "next/image";


export default function Home() {
  return (
    <div className="min-h-screen bg-white p-8">
      {/* Main Content Section */}
      <section className="max-w-[80%] mx-auto">
        {/* Flexbox for Text (Left) and Image (Right) */}
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          {/* Left Flexbox: Text Content */}
          <div className="flex-1 flex flex-col justify-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Navigating <span style={{ color: '#008080' }}>Global</span> Energy
            </h1>
            <p className="text-lg text-gray-700 mb-8">
              Empowering your journey to meeting your energy goals by leveraging
              the power of artificial intelligence in your daily life.
            </p>
            {/* Email and Button Container */}
            <div className="w-full">
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                  Get Started
                </button>
              </div>
            </div>
          </div>

          {/* Right Flexbox: Image */}
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

      {/* Expertise Section */}
      <section className="max-w-[80%] mx-auto mt-16">
        {/* Heading */}
        <Image
                 src="/ourexpertise.png"
                 alt="Illustration"
                 width={600}
                 height={400}
                 className="object-cover rounded-lg"
           />

        {/* Flexbox for Text (Left) and Image (Right) */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Flexbox: Text Content */}
          <div className="flex-1">
            <h3 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6">
              Transforming Your Consumption With Strategic Energy Management
            </h3>
            <p className="text-lg text-gray-700 mb-8">
              Guiding you on your global energy success journey through customized &
              personalized consumption and prediction algorithms. Achieve your goals
              with data-driven expertise and make the most out of your resources!
              </p>
              <p className="text-lg text-gray-700 mb-8">
              We're committed to providing you with expert guidance, proven
              strategies & personalized approach.
              </p>
            
            <div>
              <h3 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6">
              Learn more about our mission, vision, and the team behind our
                success.
            </h3>
            <button className="text-2xl font-bold text-white bg-teal-500 py-2 px-4 rounded hover:bg-teal-600 transition-colors">
  About Us
</button>
            </div>
          </div>

          {/* Right Flexbox: Image */}
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
      <section className="max-w-[80%] mx-auto">
        {/* Heading */}
        <Image
                 src="/ourservices.png"
                 alt="Illustration"
                 width={600}
                 height={400}
                 className="object-cover rounded-lg"
           />

        {/* Subheading */}
        <h3 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6">
          Our Services Can Help You Make The Most Of Energy
        </h3>

        {/* Description */}
        <p className="text-lg text-gray-700 mb-10 max-w-[80%] ">
          Embark on a journey to unlock a world of opportunities, grow your
          savings with our comprehensive and expert services.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Analyze Consumption Patterns */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-center bg-gray-200 rounded-lg mb-4 h-40">
          <Image
              src="/AIGuidance.png"
              alt="Illustration"
              width={150}
              height={100}
            />
  </div>
            <h4 className="text-xl font-bold text-gray-900 mb-4">
              AI Guidance
            </h4>
            <p className="text-gray-700">
              Rely on sesoned algorithms for tailored energy advice and strategic planning aligned with your unique goals
            </p>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-center bg-gray-200 rounded-lg mb-4 h-40">
          <Image
              src="/riskmanagement.png"
              alt="Illustration"
              width={150}
              height={100}
            />
  </div>
            <h4 className="text-xl font-bold text-gray-900 mb-4">
              Risk Management
            </h4>
            <p className="text-gray-700">
              We expertly handle and proactively mitigate risks, ensuring the safety of your data and overall stability
            </p>
          </div>

          

          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-center bg-gray-200 rounded-lg mb-4 h-40">
          <Image
              src="/CustomizedSolutions.png"
              alt="Illustration"
              width={150}
              height={100}
            />
  </div>
            <h4 className="text-xl font-bold text-gray-900 mb-4">
              Customized Solutions
            </h4>
            <p className="text-gray-700">
              Receive and benefit from energy solutions that are tailored to your unique financial aspirations and challenges
            </p>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-center bg-gray-200 rounded-lg mb-4 h-40">
          <Image
              src="/PersonalizedAnalysis.png"
              alt="Illustration"
              width={200}
              height={350}
            />
  </div>
            <h4 className="text-xl font-bold text-gray-900 mb-4">
              Personalized Analysis
            </h4>
            <p className="text-gray-700">
              Let AI analyze your production and consumption patterns to let you know where you can be better!
            </p>
          </div>

        </div>
      </section>
    
    </div>
  );
}