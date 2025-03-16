"use client";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<{ text: string; sender: "user" | "bot" }[]>([]);
  const [inputText, setInputText] = useState("");
  const [isFirstMessage, setIsFirstMessage] = useState(true);
  const [isLoading, setIsLoading] = useState(false); 

  const handleSend = async () => {
    if (inputText.trim()) {
      const userMessage = { text: inputText, sender: "user" as const };
      setMessages((prev) => [...prev, userMessage]);
      setInputText("");
      setIsFirstMessage(false); // Move the textbox to the bottom
  
      try {
        const response = await fetch("http://backend-server-ip:8080/api/forward", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
          },
          body: JSON.stringify({
            query: "First find me the top 3 months with highest energy usage. Then find me top 3 devices with highest energy usage for each month. And comment on each month's usage.",
          }),
        });
  
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
  
        const data = await response.json();
        const botMessage = { text: data.response, sender: "bot" as const };
        setMessages((prev) => [...prev, botMessage]);
      } catch (error) {
        console.error('Error fetching AI response:', error);
        const botMessage = { text: "Sorry, something went wrong. Please try again.", sender: "bot" as const };
        setMessages((prev) => [...prev, botMessage]);
      }
    }
  };

  return (
    <div style={styles.container}>
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
          <div
            style={{
              ...styles.messageContainer,
              ...styles.botContainer,
            }}
          >
            <div
              style={{
                ...styles.avatar,
                ...styles.botAvatar,
              }}
            >
              🤖
            </div>
            <div
              style={{
                ...styles.message,
                ...styles.botMessage,
              }}
            >
              <div style={styles.loadingAnimation}>
                <div style={styles.loadingDot}></div>
                <div style={styles.loadingDot}></div>
                <div style={styles.loadingDot}></div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div
        style={{
          ...styles.inputContainer,
          position: "fixed",
          bottom: isFirstMessage ? "50%" : "20px", 
          left: "50%",
          transform: isFirstMessage ? "translate(-50%, 50%)" : "translateX(-50%)",
          transition: "bottom 0.3s ease, transform 0.3s ease",
        }}
      >
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
    padding: "30px", 
    boxSizing: "border-box" as const,
    position: "relative",
  },
  chatWindow: {
    flex: 1,
    overflowY: "auto" as const,
    marginBottom: "30px", 
    padding: "30px", 
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
  },
  loadingDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    backgroundColor: "#008080",
    animation: "bounce 1.4s infinite ease-in-out",
  },
  "@keyframes bounce": {
    "0%, 80%, 100%": {
      transform: "translateY(0)",
    },
    "40%": {
      transform: "translateY(-10px)",
    },
  },
};

export default ChatInterface;