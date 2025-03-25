// import React from 'react';

// const SignUpPage: React.FC = () => {
//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col">
      

//       {/* Main Content */}
//       <main className="flex-grow container mx-auto px-6 py-8">
//         <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
//           <h1 className="text-3xl font-bold mb-4" style={{ color: '#008080' }}>Get Started with EnerGex</h1>
//           <p className="text-gray-700 mb-8">
//             Our algorithms provide solutions to help you achieve energy surplus. Trust us to guide you toward a brighter future.
//           </p>

//           {/* Sign-Up Form */}
//           <form className="space-y-6">
//             <div>
//               <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Username</label>
//               <input type="text" id="fullName" name="fullName" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" required />
//             </div>

//             <div>
//               <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
//               <input type="email" id="email" name="email" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" required />
//             </div>

//             <div>
//               <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
//               <input type="password" id="password" name="password" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" required />
//             </div>

//             <div>
//               <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
//               <input type="password" id="confirmPassword" name="confirmPassword" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" required />
//             </div>

//             <div>
//               <label htmlFor="phone" className="block text-sm font-medium text-gray-700">House Number</label>
//               <input type="tel" id="phone" name="phone" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" required />
//             </div>

//             <div>
//               <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white" style={{ backgroundColor: '#008080' }}>
//                 Sign Up
//               </button>
//             </div>
//           </form>

//           <div className="mt-6 text-center">
//             <p className="text-sm text-gray-600">Already have an account?</p>
//             <div>
//               <button className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white" style={{ backgroundColor: '#008080' }}>
//                 <a href="./signin">Sign In</a>
//               </button>
//             </div>
//           </div>
//         </div>
//       </main>

//       {/* Footer */}
//       <footer className="bg-white shadow-md mt-8">
//         <div className="container mx-auto px-6 py-4">
//           <div className="flex justify-between items-center">
//             <div className="text-sm text-gray-700">
//               <p>Contact Details: <a href="mailto:nemr22ad06@emamit" className="hover:text-teal-800" style={{ color: '#008080' }}>nemr22ad06@emamit</a> | <a href="tel:911-9743282090" className="hover:text-teal-800" style={{ color: '#008080' }}>911-9743282090</a></p>
//               <p>AMDS 2025 All rights reserved</p>
//             </div>
//             <div className="flex space-x-4">
//               <a href="#" className="text-gray-400 hover:text-teal-800">Terms & Conditions</a>
//               <a href="#" className="text-gray-400 hover:text-teal-800">Privacy Policy</a>
//             </div>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default SignUpPage;
"use client"; // Required for client-side interactivity
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const SignUpPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    houseId: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
  
    try {
      const response = await fetch('http://localhost:8080/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          username: formData.username,
          houseId: Number(formData.houseId)
        }),
      });
  
      // First get the response as text
      const responseText = await response.text();
      
      try {
        // Then try to parse it as JSON
        const data = JSON.parse(responseText);
        
        if (!response.ok) {
          if (response.status === 409) {
            alert('This email is already registered');
          } else {
            throw new Error(data.message || 'Registration failed');
          }
          return;
        }
  
        alert('Registration successful!');
        router.push('/signin');
      } catch (parseError) {
        // If JSON parsing fails, use the raw text as error message
        throw new Error(responseText || 'Registration failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <main className="flex-grow container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-4" style={{ color: '#008080' }}>Get Started with EnerGex</h1>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                required
                minLength={6}
              />
            </div>

            <div>
              <label htmlFor="houseId" className="block text-sm font-medium text-gray-700">House ID</label>
              <input
                type="text"
                id="houseId"
                name="houseId"
                value={formData.houseId}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                required
                pattern="[0-9]*"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white disabled:opacity-50"
                style={{ backgroundColor: '#008080' }}
              >
                {isLoading ? 'Registering...' : 'Sign Up'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">Already have an account?</p>
            <a href="/signin" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white" style={{ backgroundColor: '#008080' }}>
              Sign In
            </a>
          </div>
        </div>
      </main>

      {/* Footer remains unchanged */}
    </div>
  );
};

export default SignUpPage;