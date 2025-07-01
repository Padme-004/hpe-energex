'use client';
import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { useRouter } from 'next/navigation';
import { ChatService, ChatMessage } from '../../lib/api/chat';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const chatWindowRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Separate auth check to prevent rapid redirects
  useEffect(() => {
    const checkAuth = () => {
      const jwtToken = localStorage.getItem('jwt');
      if (!jwtToken) {
        setToken(null);
        setAuthChecked(true);
        // Delay redirect to prevent rapid mounting/unmounting
        setTimeout(() => {
          router.push('/signin');
        }, 100);
      } else {
        setToken(jwtToken);
        setAuthChecked(true);
      }
    };

    checkAuth();
  }, [router]);

  const handleSend = async () => {
    if (!inputText.trim() || !token) return;

    const userMessage: ChatMessage = { text: inputText, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await ChatService.sendMessage(inputText, token);
      const botMessage: ChatMessage = { text: response.response, sender: 'bot' };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error fetching AI response:', error);
      const errorMessage: ChatMessage = {
        text: `Sorry, something went wrong. Please try again. (${error instanceof Error ? error.message : 'Unknown error'})`,
        sender: 'bot',
      };
      setMessages((prev) => [...prev, errorMessage]);

      if (error instanceof Error && error.message.includes('Unauthorized')) {
        localStorage.removeItem('jwt');
        router.push('/signin');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Show loading while checking auth
  if (!authChecked) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p className="text-teal-700 text-xl">Loading...</p>
      </div>
    );
  }

  // Show redirecting message if no token
  if (!token) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p className="text-teal-700 text-xl">Redirecting to sign in...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Chat Window */}
      <div
        ref={chatWindowRef}
        className="flex-1 overflow-y-auto"
        style={{ paddingBottom: '120px' }}
      >
        <div className="p-4">
          <div className="max-w-4xl mx-auto space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-[90%] md:max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-xl mx-2 mt-1
                    ${message.sender === 'user' ? 'bg-teal-600 text-white' : 'bg-gray-300 text-gray-700'}`}
                  >
                    {message.sender === 'user' ? '👤' : '🤖'}
                  </div>
                  <div className={`p-4 rounded-2xl shadow-sm ${message.sender === 'user' 
                    ? 'bg-teal-600 text-white rounded-tr-md' 
                    : 'bg-white text-gray-800 rounded-tl-md border border-gray-200'}`}
                  >
                    <ReactMarkdown
                      components={{
                        strong: ({ node, ...props }) => <strong className="font-bold text-inherit" {...props} />,
                        ul: ({ node, ...props }) => <ul className="my-2 pl-5 list-disc" {...props} />,
                        li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                        p: ({ node, ...props }) => <p className="my-1 first:mt-0 last:mb-0" {...props} />,
                        code: ({ node, ...props }) => (
                          <code className={`px-1.5 py-0.5 rounded text-sm font-mono ${
                            message.sender === 'user' ? 'bg-teal-700 bg-opacity-50' : 'bg-gray-100 text-black'
                          }`} {...props} />
                        ),
                      }}
                    >
                      {message.text}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="flex max-w-[80%] flex-row">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-300 text-gray-700 flex items-center justify-center text-xl mx-2 mt-1">
                    🤖
                  </div>
                  <div className="p-4 rounded-2xl bg-white text-black rounded-tl-md border border-gray-200 shadow-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 rounded-full bg-teal-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 rounded-full bg-teal-600 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 rounded-full bg-teal-600 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Input Container */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 shadow-lg z-10">
        <div className="p-4">
          <div className="max-w-4xl mx-auto flex gap-3">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyPress}
              className="flex-1 text-black p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-base resize-none min-h-[48px] max-h-[120px] leading-6"
              placeholder="Type a message..."
              rows={1}
              style={{
                height: 'auto',
                minHeight: '48px',
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = Math.min(target.scrollHeight, 120) + 'px';
              }}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !inputText.trim()}
              className="px-6 py-3 bg-teal-600 hover:bg-teal-700 disabled:hover:bg-teal-600 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium self-end"
            >
              {isLoading ? '...' : 'Send'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;