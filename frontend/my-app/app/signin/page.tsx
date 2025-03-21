// import React from 'react';





// const SignInPage: React.FC = () => {
//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col">
      

//       {/* Main Content */}
//       <main className="flex-grow container mx-auto px-6 py-8">
//         <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
//           <h1 className="text-3xl font-bold mb-4" style={{ color: '#008080' }}>Login to your EnerGex Account</h1>
//           <p className="text-gray-700 mb-8">
//             Save while contributing to the planet!
//           </p>

//           {/* Sign-In Form */}
//           <form className="space-y-6">
//             <div>
//               <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Email</label>
//               <input type="text" id="fullName" name="fullName" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" required />
//             </div>

//             <div>
//               <label htmlFor="email" className="block text-sm font-medium text-gray-700">Password</label>
//               <input type="email" id="email" name="email" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" required />
//             </div>

            

           

//             <div>
//               <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white" style={{ backgroundColor: '#008080' }}>
//                 Sign In
//               </button>
//             </div>
//           </form>

//           <div className="mt-6 text-center">
//             <p className="text-sm text-gray-600">Don't have an account?</p>
//             <div>
//               <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white" style={{ backgroundColor: '#008080' }}>
//                 Sign Up
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

// export default SignInPage;
'use client';
import React, { useState } from 'react';

const SignInPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const response = await fetch('http://localhost:8080/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // Handle successful login (e.g., store token, redirect)
      console.log('Login successful:', data);
    } else {
      // Handle error
      console.error('Login failed:', data.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Main Content */}
      <main className="flex-grow container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-4" style={{ color: '#008080' }}>Login to your EnerGex Account</h1>
          <p className="text-gray-700 mb-8">
            Save while contributing to the planet!
          </p>

          {/* Sign-In Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                required
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white"
                style={{ backgroundColor: '#008080' }}
              >
                Sign In
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">Don't have an account?</p>
            <div>
              <button
                type="button" // Changed to type="button" to prevent form submission
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white"
                style={{ backgroundColor: '#008080' }}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white shadow-md mt-8">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-700">
              <p>Contact Details: <a href="mailto:nemr22ad06@emamit" className="hover:text-teal-800" style={{ color: '#008080' }}>nemr22ad06@emamit</a> | <a href="tel:911-9743282090" className="hover:text-teal-800" style={{ color: '#008080' }}>911-9743282090</a></p>
              <p>AMDS 2025 All rights reserved</p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-teal-800">Terms & Conditions</a>
              <a href="#" className="text-gray-400 hover:text-teal-800">Privacy Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SignInPage;