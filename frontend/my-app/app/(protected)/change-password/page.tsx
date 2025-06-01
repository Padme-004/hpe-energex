// 'use client';
// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';

// export default function ChangePasswordPage() {
//   const [form, setForm] = useState({ oldPassword: '', newPassword: '' });
//   const [message, setMessage] = useState({ text: '', isError: false });
//   const [isLoading, setIsLoading] = useState(false);
//   const router = useRouter();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setMessage({ text: '', isError: false });

//     if (!form.oldPassword || !form.newPassword) {
//       setMessage({ text: 'Both fields are required', isError: true });
//       setIsLoading(false);
//       return;
//     }

//     try {
//       const token = localStorage.getItem('jwt');
//       const response = await fetch('https://energy-optimisation-backend.onrender.com/api/users/change-password', {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           ...(token && { Authorization: `Bearer ${token}` }),
//         },
//         body: JSON.stringify(form),
//       });

//       const responseText = await response.text();
//       if (!response.ok) throw new Error(responseText);

//       setMessage({ text: responseText, isError: false });
//       setForm({ oldPassword: '', newPassword: '' });
//     } catch (err) {
//       setMessage({ 
//         text: err instanceof Error ? err.message : 'Failed to change password', 
//         isError: true 
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
//       <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
//         <h1 className="text-3xl font-bold mb-4 text-teal-800">Change Password</h1>
//         <p className="text-gray-700 mb-6">For security, change your password occasionally.</p>

//         {message.text && (
//           <div className={`mb-4 p-4 border-l-4 ${message.isError ? 'bg-red-100 border-red-500 text-red-700' : 'bg-green-100 border-green-500 text-green-700'}`}>
//             <p>{message.text}</p>
//           </div>
//         )}

//         <form className="space-y-6" onSubmit={handleSubmit}>
//           <div>
//             <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700">
//               Current Password
//             </label>
//             <input
//               type="password"
//               id="oldPassword"
//               name="oldPassword"
//               value={form.oldPassword}
//               onChange={handleChange}
//               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-black"
//               required
//             />
//           </div>

//           <div>
//             <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
//               New Password
//             </label>
//             <input
//               type="password"
//               id="newPassword"
//               name="newPassword"
//               value={form.newPassword}
//               onChange={handleChange}
//               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-black"
//               required
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={isLoading}
//             className="w-full py-2 px-4 bg-teal-800 text-white rounded-md disabled:opacity-50"
//           >
//             {isLoading ? 'Changing...' : 'Change Password'}
//           </button>
//         </form>

//         <div className="mt-6 text-center">
//           <Link href="/" className="text-sm text-teal-800 hover:text-teal-600">
//             Back to Home
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserService } from '../../lib/api/users';

export default function ChangePasswordPage() {
  const [form, setForm] = useState({ oldPassword: '', newPassword: '' });
  const [message, setMessage] = useState({ text: '', isError: false });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: '', isError: false });

    if (!form.oldPassword || !form.newPassword) {
      setMessage({ text: 'Both fields are required', isError: true });
      setIsLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('jwt');
      const responseText = await UserService.changePassword(form, token);

      setMessage({ text: responseText, isError: false });
      setForm({ oldPassword: '', newPassword: '' });
    } catch (err) {
      setMessage({ 
        text: err instanceof Error ? err.message : 'Failed to change password', 
        isError: true 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-4 text-teal-800">Change Password</h1>
        <p className="text-gray-700 mb-6">For security, change your password occasionally.</p>

        {message.text && (
          <div className={`mb-4 p-4 border-l-4 ${message.isError ? 'bg-red-100 border-red-500 text-red-700' : 'bg-green-100 border-green-500 text-green-700'}`}>
            <p>{message.text}</p>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700">
              Current Password
            </label>
            <input
              type="password"
              id="oldPassword"
              name="oldPassword"
              value={form.oldPassword}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-black"
              required
            />
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-black"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-teal-800 text-white rounded-md disabled:opacity-50"
          >
            {isLoading ? 'Changing...' : 'Change Password'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-teal-800 hover:text-teal-600">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}