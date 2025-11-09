import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import FileSummarise from "./pages/FileSummarise";
import { useTheme } from "./context/ThemeContext"; // 🌗 import theme context

export default function App() {
  const { theme } = useTheme(); // 🌗 get current theme

  return (
    <BrowserRouter>
      <div
        className={`flex transition-colors duration-300 ${
          theme === "dark"
            ? "bg-gray-900 text-gray-100"
            : "bg-gray-50 text-gray-900"
        }`}
      >
        {/* 🧭 Sidebar */}
        <Sidebar />

        {/* 🧩 Main Content */}
        <div
          className={`flex-grow min-h-screen transition-colors duration-300 
            ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}
          `}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/summarise" element={<FileSummarise />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
