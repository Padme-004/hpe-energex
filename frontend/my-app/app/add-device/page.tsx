// "use client";
// import React, { useState, useEffect, useRef } from "react";
// import ReactMarkdown from "react-markdown";
// import { useRouter } from "next/navigation";

// const ChatInterface: React.FC = () => {
//   const [messages, setMessages] = useState<
//     { text: string; sender: "user" | "bot" }[]
//   >([]);
//   const [inputText, setInputText] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [token, setToken] = useState<string | null>(null);
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const router = useRouter();

//   // Get JWT token from localStorage on component mount
//   useEffect(() => {
//     const jwtToken = localStorage.getItem("jwt");
//     if (!jwtToken) {
//       router.push("/signin");
//       return;
//     }
//     setToken(jwtToken);
//   }, [router]);

//   // Add keyframes animation using useEffect
//   useEffect(() => {
//     // Create a style element
//     const styleElement = document.createElement("style");

//     // Define the keyframes animation
//     styleElement.textContent = `
//       @keyframes bounce {
//         0%, 80%, 100% { transform: translateY(0); }
//         40% { transform: translateY(-10px); }
//       }
      
//       .loading-dot {
//         width: 10px;
//         height: 10px;
//         border-radius: 50%;
//         background-color: #008080;
//         animation: bounce 1.4s infinite ease-in-out;
//         animation-delay: calc(0.16s * var(--dot-index));
//       }
//     `;

//     // Append the style element to the document head
//     document.head.appendChild(styleElement);

//     // Cleanup function to remove the style element when component unmounts
//     return () => {
//       document.head.removeChild(styleElement);
//     };
//   }, []);

//   // Auto-scroll to the bottom whenever messages change
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, isLoading]);

//   const handleSend = async () => {
//     if (inputText.trim()) {
//       if (!token) {
//         // If somehow token is not available, redirect to login
//         router.push("/signin");
//         return;
//       }

//       const userMessage = { text: inputText, sender: "user" as const };
//       setMessages((prev) => [...prev, userMessage]);
//       setInputText("");
//       setIsLoading(true);

//       try {
//         const response = await fetch(
//           "https://energy-optimisation-backend.onrender.com/api/forward",
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//             body: JSON.stringify({ query: inputText }),
//           }
//         );

//         if (response.status === 401) {
//           // Handle unauthorized access (expired token)
//           localStorage.removeItem("jwt");
//           router.push("/signin");
//           return;
//         }

//         if (!response.ok) {
//           const errorText = await response.text();
//           console.error(
//             `Server responded with ${response.status}: ${errorText}`
//           );
//           throw new Error(`Server error: ${response.status}`);
//         }

//         const data = await response.json();
//         const botMessage = { text: data.response, sender: "bot" as const };
//         setMessages((prev) => [...prev, botMessage]);
//       } catch (error) {
//         console.error("Error fetching AI response:", error);
//         setMessages((prev) => [
//           ...prev,
//           {
//             text: `Sorry, something went wrong. Please try again. (${
//               error instanceof Error ? error.message : "Unknown error"
//             })`,
//             sender: "bot" as const,
//           },
//         ]);
//       } finally {
//         setIsLoading(false);
//       }
//     }
//   };

//   // If no token, show loading or redirect
//   if (!token) {
//     return (
//       <div style={styles.container}>
//         <div style={styles.loadingContainer}>
//           <p>Loading chat interface...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div style={styles.container}>
//       {/* Chat Window */}
//       <div style={styles.chatWindow}>
//         {messages.map((message, index) => (
//           <div
//             key={index}
//             style={{
//               ...styles.messageContainer,
//               ...(message.sender === "user"
//                 ? styles.userContainer
//                 : styles.botContainer),
//             }}>
//             <div
//               style={{
//                 ...styles.avatar,
//                 ...(message.sender === "user"
//                   ? styles.userAvatar
//                   : styles.botAvatar),
//               }}>
//               {message.sender === "user" ? "👤" : "🤖"}
//             </div>
//             <div
//               style={{
//                 ...styles.message,
//                 ...(message.sender === "user"
//                   ? styles.userMessage
//                   : styles.botMessage),
//               }}>
//               <ReactMarkdown
//                 components={{
//                   strong: ({ node, ...props }) => (
//                     <strong
//                       style={{ fontWeight: "bold", color: "#008080" }}
//                       {...props}
//                     />
//                   ),
//                   ul: ({ node, ...props }) => (
//                     <ul
//                       style={{ margin: "10px 0", paddingLeft: "20px" }}
//                       {...props}
//                     />
//                   ),
//                   li: ({ node, ...props }) => (
//                     <li style={{ marginBottom: "10px" }} {...props} />
//                   ),
//                   p: ({ node, ...props }) => (
//                     <p style={{ margin: "10px 0" }} {...props} />
//                   ),
//                 }}>
//                 {message.text}
//               </ReactMarkdown>
//             </div>
//           </div>
//         ))}
//         {isLoading && (
//           <div style={{ ...styles.messageContainer, ...styles.botContainer }}>
//             <div style={{ ...styles.avatar, ...styles.botAvatar }}>🤖</div>
//             <div style={{ ...styles.message, ...styles.botMessage }}>
//               <div style={styles.loadingAnimation}>
//                 <div
//                   className="loading-dot"
//                   style={{ "--dot-index": 0 } as React.CSSProperties}></div>
//                 <div
//                   className="loading-dot"
//                   style={{ "--dot-index": 1 } as React.CSSProperties}></div>
//                 <div
//                   className="loading-dot"
//                   style={{ "--dot-index": 2 } as React.CSSProperties}></div>
//               </div>
//             </div>
//           </div>
//         )}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* Input Container */}
//       <div style={styles.inputContainer}>
//         <input
//           type="text"
//           value={inputText}
//           onChange={(e) => setInputText(e.target.value)}
//           onKeyPress={(e) => e.key === "Enter" && handleSend()}
//           style={styles.input}
//           placeholder="Type a message..."
//         />
//         <button onClick={handleSend} style={styles.sendButton}>
//           Send
//         </button>
//       </div>
//     </div>
//   );
// };

// const styles = {
//   container: {
//     display: "flex",
//     flexDirection: "column" as const,
//     height: "100vh",
//     backgroundColor: "#ffffff",
//     padding: "20px",
//     boxSizing: "border-box" as const,
//     position: "relative" as const,
//   },
//   loadingContainer: {
//     display: "flex",
//     justifyContent: "center" as const,
//     alignItems: "center" as const,
//     height: "100%",
//     fontSize: "22px",
//     color: "#008080",
//   },
//   chatWindow: {
//     flex: 1,
//     overflowY: "auto" as const,
//     marginBottom: "100px",
//     padding: "20px",
//     backgroundColor: "#f0f0f0",
//     borderRadius: "20px",
//     fontSize: "22px",
//   },
//   messageContainer: {
//     display: "flex",
//     alignItems: "flex-end",
//     marginBottom: "20px",
//   },
//   userContainer: {
//     justifyContent: "flex-end",
//   },
//   botContainer: {
//     justifyContent: "flex-start",
//   },
//   avatar: {
//     width: "60px",
//     height: "60px",
//     borderRadius: "50%",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     margin: "0 20px",
//     fontSize: "28px",
//   },
//   userAvatar: {
//     backgroundColor: "#008080",
//     color: "#ffffff",
//   },
//   botAvatar: {
//     backgroundColor: "#e0e0e0",
//     color: "#000000",
//   },
//   message: {
//     padding: "20px",
//     borderRadius: "20px",
//     maxWidth: "70%",
//     wordWrap: "break-word" as const,
//     fontSize: "22px",
//   },
//   userMessage: {
//     backgroundColor: "#008080",
//     color: "#ffffff",
//   },
//   botMessage: {
//     backgroundColor: "#e0e0e0",
//     color: "#000000",
//   },
//   inputContainer: {
//     display: "flex",
//     gap: "20px",
//     width: "90%",
//     maxWidth: "1000px",
//     position: "absolute" as const,
//     bottom: "20px",
//     left: "50%",
//     transform: "translateX(-50%)",
//     padding: "10px",
//     backgroundColor: "#ffffff",
//     borderRadius: "15px",
//     boxShadow: "0px -2px 10px rgba(0, 0, 0, 0.1)",
//     zIndex: 1000,
//   },
//   input: {
//     flex: 1,
//     padding: "20px",
//     borderRadius: "15px",
//     border: "2px solid #ccc",
//     outline: "none",
//     fontSize: "22px",
//     color: "#000000", // Explicitly set text color to black
//   },
//   sendButton: {
//     padding: "20px 40px",
//     backgroundColor: "#008080",
//     color: "#ffffff",
//     border: "none",
//     borderRadius: "15px",
//     cursor: "pointer",
//     fontSize: "22px",
//   },
//   loadingAnimation: {
//     display: "flex",
//     gap: "8px",
//   },
// };

// export default ChatInterface;
'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AddDevicePage() {
  const [device, setDevice] = useState({
    deviceName: '',
    deviceType: 'Appliance',
    powerRating: '', // renamed from powerString
    location: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [deviceId, setDeviceId] = useState<number | null>(null); // NEW FIELD
  const [token, setToken] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<{
    userId: number;
    houseId: number;
    role: string;
  } | null>(null);

  const router = useRouter();

  useEffect(() => {
    const jwtToken = localStorage.getItem('jwt');
    const storedUserInfo = localStorage.getItem('user');

    if (jwtToken) {
      setToken(jwtToken);
    }
    if (storedUserInfo) {
      try {
        setUserInfo(JSON.parse(storedUserInfo));
      } catch (err) {
        console.error('Error parsing user info:', err);
        router.push('/login');
      }
    } else {
      router.push('/login');
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDevice(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    setDeviceId(null);

    try {
      const jwtToken = localStorage.getItem('jwt');
      const currentUserInfo = localStorage.getItem('user');

      if (!jwtToken || !currentUserInfo) {
        throw new Error('Session expired. Please login again.');
      }

      const parsedUserInfo = JSON.parse(currentUserInfo);
      if (parsedUserInfo.role !== 'ROLE_HOUSE_OWNER') {
        throw new Error('Only house owners can add devices');
      }

      const payload = {
        deviceName: device.deviceName,
        deviceType: device.deviceType,
        powerRating: device.powerRating, // ensure key matches API
        location: device.location,
        userId: parsedUserInfo.userId,
        houseId: parsedUserInfo.houseId,
      };

      const response = await fetch('https://energy-optimisation-backend.onrender.com/api/devices', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to add device');
      }

      setSuccess('Device created successfully!');
      setDeviceId(result.deviceId); // store deviceId from API response
      setTimeout(() => router.push('/device-dashboard'), 2500);
    } catch (err: any) {
      console.error('Add device error:', err);
      setError(err.message || 'Failed to add device');
    } finally {
      setLoading(false);
    }
  };

  if (!token || !userInfo) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <main className="flex-grow container mx-auto px-6 py-8">
          <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
            <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-6">
              <p className="text-red-700">Please login to access this page</p>
            </div>
            <button 
              onClick={() => router.push('/login')}
              className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
            >
              Go to Login
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (userInfo.role !== 'ROLE_HOUSE_OWNER') {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <main className="flex-grow container mx-auto px-6 py-8">
          <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
            <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-6">
              <p className="text-red-700">Only house owners can add devices</p>
            </div>
            <button 
              onClick={() => router.push('/device-dashboard')}
              className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
            >
              Back to Dashboard
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <main className="flex-grow container mx-auto px-6 py-8">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold" style={{ color: '#008080' }}>Add New Device</h1>
            <button 
              onClick={() => router.push('/device-dashboard')}
              className="px-4 py-2 text-teal-600 hover:text-teal-800"
            >
              ← Back to Dashboard
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-6">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-100 border-l-4 border-green-500 p-4 mb-6">
              <p className="text-green-700">{success}</p>
              {deviceId && (
                <p className="text-sm text-green-800 mt-1">
                  Device ID: <span className="font-semibold">{deviceId}</span>
                </p>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="deviceName" className="block text-sm font-medium text-gray-700 mb-1">
                Device Name*
              </label>
              <input
                type="text"
                id="deviceName"
                name="deviceName"
                value={device.deviceName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
                required
                placeholder="Smart Refrigerator"
              />
            </div>

            <div>
              <label htmlFor="deviceType" className="block text-sm font-medium text-gray-700 mb-1">
                Device Type*
              </label>
              <select
                id="deviceType"
                name="deviceType"
                value={device.deviceType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
                required
              >
                <option value="Appliance">Appliance</option>
                <option value="Lighting">Lighting</option>
                <option value="Electronics">Electronics</option>
                <option value="HVAC">HVAC</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="powerRating" className="block text-sm font-medium text-gray-700 mb-1">
                Power Rating*
              </label>
              <input
                type="text"
                id="powerRating"
                name="powerRating"
                value={device.powerRating}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
                required
                placeholder="250W"
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location*
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={device.location}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
                required
                placeholder="Kitchen"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 disabled:bg-gray-400"
              >
                {loading ? 'Creating...' : 'Create Device'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}