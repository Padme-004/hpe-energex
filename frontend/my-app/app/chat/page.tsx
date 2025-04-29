"use client";
import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<{ text: string; sender: "user" | "bot" }[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Add keyframes animation using useEffect
  useEffect(() => {
    // Create a style element
    const styleElement = document.createElement('style');
    
    // Define the keyframes animation
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
    
    // Append the style element to the document head
    document.head.appendChild(styleElement);
    
    // Cleanup function to remove the style element when component unmounts
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  const handleSend = async () => {
    if (inputText.trim()) {
      const userMessage = { text: inputText, sender: "user" as const };
      setMessages((prev) => [...prev, userMessage]);
      setInputText("");
      setIsLoading(true);

      try {
        const response = await fetch("https://energy-optimisation-backend.onrender.com/api/forward", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query: inputText }),
        });

        setIsLoading(false);

        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json();
        const botMessage = { text: data.response, sender: "bot" as const };
        setMessages((prev) => [...prev, botMessage]);
      } catch (error) {
        console.error("Error fetching AI response:", error);
        setIsLoading(false);
        setMessages((prev) => [
          ...prev,
          { text: "Sorry, something went wrong. Please try again.", sender: "bot" as const },
        ]);
      }
    }
  };

  return (
    <div style={styles.container}>
      {/* Chat Window */}
      <div style={styles.chatWindow}>
        {messages.map((message, index) => (
          <div
            key={index}
            style={{
              ...styles.messageContainer,
              ...(message.sender === "user" ? styles.userContainer : styles.botContainer),
            }}
          >
            <div
              style={{
                ...styles.avatar,
                ...(message.sender === "user" ? styles.userAvatar : styles.botAvatar),
              }}
            >
              {message.sender === "user" ? "👤" : "🤖"}
            </div>
            <div
              style={{
                ...styles.message,
                ...(message.sender === "user" ? styles.userMessage : styles.botMessage),
              }}
            >
              <ReactMarkdown
                components={{
                  strong: ({ node, ...props }) => (
                    <strong style={{ fontWeight: "bold", color: "#008080" }} {...props} />
                  ),
                  ul: ({ node, ...props }) => (
                    <ul style={{ margin: "10px 0", paddingLeft: "20px" }} {...props} />
                  ),
                  li: ({ node, ...props }) => (
                    <li style={{ marginBottom: "10px" }} {...props} />
                  ),
                  p: ({ node, ...props }) => (
                    <p style={{ margin: "10px 0" }} {...props} />
                  ),
                }}
              >
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
                <div className="loading-dot" style={{ "--dot-index": 0 } as React.CSSProperties}></div>
                <div className="loading-dot" style={{ "--dot-index": 1 } as React.CSSProperties}></div>
                <div className="loading-dot" style={{ "--dot-index": 2 } as React.CSSProperties}></div>
              </div>
            </div>
          </div>
        )}
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
  }
};

export default ChatInterface;