// src/pages/Chat.js
import React, { useState, useRef, useEffect } from "react";
import { chatWithBot } from "../api";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { useTheme } from "../context/ThemeContext";
import "highlight.js/styles/github-dark.css"; // ✅ Syntax highlighting theme

export default function Chat() {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef(null);
  const { theme } = useTheme(); // 🌗 Access global theme (dark/light)

  // Auto-scroll when new messages appear
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chatHistory]);

  const copyToClipboard = (text) => navigator.clipboard.writeText(text);

  const handleChat = async () => {
    if (!message.trim()) return;

    const userMsg = { sender: "user", text: message };
    setChatHistory((prev) => [...prev, userMsg]);
    setMessage("");
    setLoading(true);

    try {
      const res = await chatWithBot(message);
      const botResponse = res.response || "No response from server.";
      const cleanResponse = botResponse.replace(/\[\d+\]/g, "").trim();
      const botMsg = { sender: "bot", text: cleanResponse };
      setChatHistory((prev) => [...prev, botMsg]);
    } catch (err) {
      setChatHistory((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Something went wrong. Please try again later." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleChat();
    }
  };

  return (
    <div
      className={`flex items-center justify-center min-h-screen w-full p-3 transition-colors duration-300
      ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gradient-to-br from-blue-50 to-blue-100 text-gray-900"}`}
    >
      <div
        className={`w-full max-w-5xl h-[90vh] flex flex-col rounded-2xl border overflow-hidden shadow-2xl transition-colors duration-300
        ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-blue-100"}`}
      >
        {/* Header */}
        <div
          className={`p-4 border-b text-center font-bold text-2xl transition-colors duration-300
          ${theme === "dark" ? "border-gray-700 bg-gray-800 text-blue-300" : "border-blue-100 bg-blue-50 text-blue-700"}`}
        >
          💬 ChatMate AI
        </div>

        {/* Scrollable Chat Messages */}
        <div
          ref={chatContainerRef}
          className={`flex-1 overflow-y-auto px-4 sm:px-6 py-4 transition-colors duration-300
          ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}
        >
          {chatHistory.length === 0 && (
            <p
              className={`text-center mt-20 text-sm sm:text-base transition-colors duration-300
              ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
            >
              👋 Say hello to your intelligent assistant.
            </p>
          )}

          {chatHistory.map((msg, idx) => (
            <div
              key={idx}
              className={`my-3 flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-3 rounded-2xl max-w-[85%] sm:max-w-[80%] text-sm leading-relaxed whitespace-pre-wrap break-words shadow-md
                transition-all duration-300 ${
                  msg.sender === "user"
                    ? "bg-blue-600 text-white rounded-br-none"
                    : theme === "dark"
                    ? "bg-gray-800 text-gray-100 border border-gray-700 rounded-bl-none"
                    : "bg-white text-gray-900 border border-gray-200 rounded-bl-none"
                }`}
              >
                {msg.sender === "bot" ? (
                <div className="prose prose-sm dark:prose-invert max-w-none">
  <ReactMarkdown
    remarkPlugins={[remarkGfm]}
    rehypePlugins={[rehypeHighlight]}
    components={{
      code({ inline, className, children, ...props }) {
        const match = /language-(\w+)/.exec(className || "");
        const codeText = String(children).replace(/\n$/, "");
        if (!inline && match) {
          return (
            <div className="relative my-3 group">
              <button
                onClick={() => navigator.clipboard.writeText(codeText)}
                className={`absolute top-2 right-2 text-xs px-2 py-1 rounded transition 
                  bg-gray-800 text-white hover:bg-gray-700 opacity-0 group-hover:opacity-100`}
              >
                Copy
              </button>
              <pre className="rounded-lg bg-gray-900 text-gray-100 p-4 overflow-auto max-h-64 text-sm leading-6 font-mono shadow-inner">
                <code className={`language-${match[1]}`} {...props}>
                  {children}
                </code>
              </pre>
            </div>
          );
        }
        return (
          <code className="bg-gray-200 text-gray-900 px-1 py-0.5 rounded font-mono" {...props}>
            {children}
          </code>
        );
      },
    }}
  >
    {msg.text}
  </ReactMarkdown>
</div>

                ) : (
                  <span>{msg.text}</span>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start my-2">
              <div
                className={`px-4 py-2 rounded-xl animate-pulse ${
                  theme === "dark"
                    ? "bg-gray-700 text-gray-300"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                Typing...
              </div>
            </div>
          )}
        </div>

        {/* Fixed Input Area */}
        <div
          className={`border-t p-4 flex items-center gap-3 sticky bottom-0 transition-colors duration-300
          ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
        >
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your message..."
            rows="1"
            className={`flex-grow rounded-lg px-4 py-3 resize-none shadow-sm focus:outline-none focus:ring-2 transition
            ${
              theme === "dark"
                ? "bg-gray-700 text-gray-100 border border-gray-600 focus:ring-blue-500"
                : "bg-gray-50 text-gray-900 border border-gray-300 focus:ring-blue-400"
            }`}
          />
          <button
            onClick={handleChat}
            disabled={loading}
            className={`px-6 py-2 rounded-lg font-medium shadow-md transition-all duration-300
            ${
              loading
                ? "opacity-50 cursor-not-allowed"
                : "hover:scale-[1.02]"
            }
            ${
              theme === "dark"
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {loading ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
