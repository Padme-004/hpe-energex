"use client";
import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { useRouter } from "next/navigation";
import { ChatService, ChatMessage } from "../../lib/api/chat";

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Get JWT token from localStorage on component mount
  useEffect(() => {
    const jwtToken = localStorage.getItem("jwt");
    if (!jwtToken) {
      router.push("/signin");
      return;
    }
    setToken(jwtToken);
  }, [router]);

  // Add keyframes animation using useEffect
  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.textContent = `
      @keyframes bounce {
        0%, 80%, 100% { transform: translateY(0); }
        40% { transform: translateY(-10px); }
      }
      .loading-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: #008080;
        animation: bounce 1.4s infinite ease-in-out;
        animation-delay: calc(0.16s * var(--dot-index));
      }
    `;
    document.head.appendChild(styleElement);
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // Auto-scroll to the bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!inputText.trim() || !token) return;

    const userMessage: ChatMessage = { text: inputText, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await ChatService.sendMessage(inputText, token);
      const botMessage: ChatMessage = { 
        text: response.response, 
        sender: "bot" 
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      const errorMessage: ChatMessage = {
        text: `Sorry, something went wrong. Please try again. (${
          error instanceof Error ? error.message : "Unknown error"
        })`,
        sender: "bot",
      };
      setMessages((prev) => [...prev, errorMessage]);

      if (error instanceof Error && error.message.includes("Unauthorized")) {
        localStorage.removeItem("jwt");
        router.push("/signin");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <p>Loading chat interface...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Chat Window */}
      <div style={styles.chatWindow}>
        {messages.map((message, index) => (
          <div
            key={index}
            style={{
              ...styles.messageContainer,
              ...(message.sender === "user"
                ? styles.userContainer
                : styles.botContainer),
            }}>
            <div
              style={{
                ...styles.avatar,
                ...(message.sender === "user"
                  ? styles.userAvatar
                  : styles.botAvatar),
              }}>
              {message.sender === "user" ? "👤" : "🤖"}
            </div>
            <div
              style={{
                ...styles.message,
                ...(message.sender === "user"
                  ? styles.userMessage
                  : styles.botMessage),
              }}>
              <ReactMarkdown
                components={{
                  strong: ({ node, ...props }) => (
                    <strong
                      style={{ fontWeight: "bold", color: "#008080" }}
                      {...props}
                    />
                  ),
                  ul: ({ node, ...props }) => (
                    <ul
                      style={{ margin: "10px 0", paddingLeft: "20px" }}
                      {...props}
                    />
                  ),
                  li: ({ node, ...props }) => (
                    <li style={{ marginBottom: "10px" }} {...props} />
                  ),
                  p: ({ node, ...props }) => (
                    <p style={{ margin: "10px 0" }} {...props} />
                  ),
                }}>
                {message.text}
              </ReactMarkdown>
            </div>
          </div>
        ))}
        {isLoading && (
          <div style={{ ...styles.messageContainer, ...styles.botContainer }}>
            <div style={{ ...styles.avatar, ...styles.botAvatar }}>🤖</div>
            <div style={{ ...styles.message, ...styles.botMessage }}>
              <div style={styles.loadingAnimation}>
                <div
                  className="loading-dot"
                  style={{ "--dot-index": 0 } as React.CSSProperties}></div>
                <div
                  className="loading-dot"
                  style={{ "--dot-index": 1 } as React.CSSProperties}></div>
                <div
                  className="loading-dot"
                  style={{ "--dot-index": 2 } as React.CSSProperties}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Container */}
      <div style={styles.inputContainer}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          style={styles.input}
          placeholder="Type a message..."
        />
        <button onClick={handleSend} style={styles.sendButton}>
          Send
        </button>
      </div>
    </div>
  );
};
const styles = {
  container: {
    display: "flex",
    flexDirection: "column" as const,
    height: "100vh",
    backgroundColor: "#ffffff",
    padding: "20px",
    boxSizing: "border-box" as const,
    position: "relative" as const,
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center" as const,
    alignItems: "center" as const,
    height: "100%",
    fontSize: "22px",
    color: "#008080",
  },
  chatWindow: {
    flex: 1,
    overflowY: "auto" as const,
    marginBottom: "100px",
    padding: "20px",
    backgroundColor: "#f0f0f0",
    borderRadius: "20px",
    fontSize: "22px",
  },
  messageContainer: {
    display: "flex",
    alignItems: "flex-end",
    marginBottom: "20px",
  },
  userContainer: {
    justifyContent: "flex-end",
  },
  botContainer: {
    justifyContent: "flex-start",
  },
  avatar: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 20px",
    fontSize: "28px",
  },
  userAvatar: {
    backgroundColor: "#008080",
    color: "#ffffff",
  },
  botAvatar: {
    backgroundColor: "#e0e0e0",
    color: "#000000",
  },
  message: {
    padding: "20px",
    borderRadius: "20px",
    maxWidth: "70%",
    wordWrap: "break-word" as const,
    fontSize: "22px",
  },
  userMessage: {
    backgroundColor: "#008080",
    color: "#ffffff",
  },
  botMessage: {
    backgroundColor: "#e0e0e0",
    color: "#000000",
  },
  inputContainer: {
    display: "flex",
    gap: "20px",
    width: "90%",
    maxWidth: "1000px",
    position: "absolute" as const,
    bottom: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    padding: "10px",
    backgroundColor: "#ffffff",
    borderRadius: "15px",
    boxShadow: "0px -2px 10px rgba(0, 0, 0, 0.1)",
    zIndex: 1000,
  },
  input: {
    flex: 1,
    padding: "20px",
    borderRadius: "15px",
    border: "2px solid #ccc",
    outline: "none",
    fontSize: "22px",
    color: "#000000", // Explicitly set text color to black
  },
  sendButton: {
    padding: "20px 40px",
    backgroundColor: "#008080",
    color: "#ffffff",
    border: "none",
    borderRadius: "15px",
    cursor: "pointer",
    fontSize: "22px",
  },
  loadingAnimation: {
    display: "flex",
    gap: "8px",
  },
};

export default ChatInterface;
