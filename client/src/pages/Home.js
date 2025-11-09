import React from "react";
import { MessageCircle, FileText, Brain } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function Home() {
  const { theme } = useTheme();

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 transition-colors duration-300 ${
        theme === "dark"
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100"
          : "bg-gradient-to-br from-blue-50 via-white to-blue-100 text-gray-900"
      }`}
    >
      <div
        className={`max-w-3xl w-full rounded-3xl shadow-xl p-10 border transition-all duration-300 backdrop-blur-md ${
          theme === "dark"
            ? "bg-gray-800/80 border-gray-700 hover:shadow-gray-600"
            : "bg-white/80 border-blue-100 hover:scale-[1.01]"
        }`}
      >
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div
              className={`p-4 rounded-full ${
                theme === "dark" ? "bg-gray-700" : "bg-blue-100"
              }`}
            >
              <Brain
                className={`${theme === "dark" ? "text-blue-400" : "text-blue-600"}`}
                size={48}
              />
            </div>
          </div>

          <h1
            className={`text-4xl font-extrabold mb-2 ${
              theme === "dark" ? "text-blue-400" : "text-blue-700"
            }`}
          >
            ChatMate AI
          </h1>
          <p
            className={`text-lg ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Your intelligent AI assistant for chatting and document summarization.
          </p>
        </div>

        {/* Features Section */}
        <div className="grid sm:grid-cols-2 gap-6 mt-8">
          {/* Chat Feature */}
          <div
            className={`p-6 rounded-2xl shadow-lg transform hover:-translate-y-1 transition-all duration-300 ${
              theme === "dark"
                ? "bg-gradient-to-br from-blue-700 to-blue-800 text-white hover:shadow-blue-600"
                : "bg-gradient-to-br from-blue-600 to-blue-700 text-white"
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <MessageCircle
                size={28}
                className={`${theme === "dark" ? "text-blue-200" : "text-blue-100"}`}
              />
              <h3 className="text-xl font-semibold">Chat with AI</h3>
            </div>
            <p
              className={`text-sm ${
                theme === "dark" ? "text-blue-100" : "text-blue-50"
              }`}
            >
              Engage in real-time conversations with your AI assistant to ask
              questions, generate ideas, and get code or answers instantly.
            </p>
          </div>

          {/* PDF Summarizer Feature */}
          <div
            className={`p-6 rounded-2xl shadow-md transform hover:-translate-y-1 transition-all duration-300 ${
              theme === "dark"
                ? "bg-gray-700 border border-gray-600 hover:shadow-gray-600"
                : "bg-white border border-gray-200 hover:shadow-lg"
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <FileText
                size={28}
                className={`${theme === "dark" ? "text-blue-400" : "text-blue-600"}`}
              />
              <h3
                className={`text-xl font-semibold ${
                  theme === "dark" ? "text-gray-100" : "text-gray-800"
                }`}
              >
                PDF Summarizer
              </h3>
            </div>
            <p
              className={`text-sm ${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Upload any PDF document and let the AI summarize it into concise,
              readable insights for quick understanding.
            </p>
          </div>
        </div>

        {/* Footer / Hint */}
        <div
          className={`text-center mt-10 text-sm ${
            theme === "dark" ? "text-gray-400" : "text-gray-500"
          }`}
        >
          Use the{" "}
          <span
            className={`font-semibold ${
              theme === "dark" ? "text-blue-400" : "text-blue-600"
            }`}
          >
            sidebar
          </span>{" "}
          to navigate between Chat and PDF Summarizer.
        </div>
      </div>
    </div>
  );
}
