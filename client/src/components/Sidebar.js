// src/components/Sidebar.js
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { MessageCircle, FileText, Home, Sun, Moon, Menu, X } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function Sidebar() {
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false); // 📱 mobile sidebar state

  const linkClass =
    "flex items-center gap-3 px-4 py-2 rounded-lg transition-all hover:bg-blue-500 hover:text-white";

  const bgColor =
    theme === "dark" ? "bg-gray-900 text-gray-200" : "bg-gray-100 text-gray-800";

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  return (
    <>
      {/* 📱 Mobile Top Bar */}
      <div
        className={`md:hidden fixed top-0 left-0 right-0 flex items-center justify-between px-4 py-3 shadow-md z-50 transition-colors duration-300 ${
          theme === "dark"
            ? "bg-gray-900 text-gray-100 border-b border-gray-700"
            : "bg-white text-gray-900 border-b border-gray-200"
        }`}
      >
        <h1 className="text-xl font-bold">🧠 ChatMate AI</h1>

        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition ${
              theme === "dark"
                ? "bg-gray-800 text-yellow-300 hover:bg-gray-700"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Hamburger Icon */}
          <button
            onClick={toggleSidebar}
            className={`p-2 rounded-lg transition ${
              theme === "dark"
                ? "bg-gray-800 text-white hover:bg-gray-700"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* 🧭 Desktop Sidebar */}
      <div
        className={`hidden md:flex h-screen w-60 flex-col py-6 transition-colors duration-300 ${bgColor}`}
      >
        <h1
          className={`text-2xl font-bold text-center mb-6 ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          🧠 ChatMate AI
        </h1>

        <nav className="flex flex-col gap-3 px-3 flex-1">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? "bg-blue-600 text-white" : ""}`
            }
          >
            <Home size={20} /> Home
          </NavLink>
          <NavLink
            to="/chat"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? "bg-blue-600 text-white" : ""}`
            }
          >
            <MessageCircle size={20} /> Chat
          </NavLink>
          <NavLink
            to="/summarise"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? "bg-blue-600 text-white" : ""}`
            }
          >
            <FileText size={20} /> Summarize PDF
          </NavLink>
        </nav>

        <div className="px-4 mt-auto flex justify-center">
          <button
            onClick={toggleTheme}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              theme === "dark"
                ? "bg-gray-800 text-yellow-300 hover:bg-gray-700"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </div>

      {/* 📱 Mobile Sidebar Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-60 z-40 flex flex-col py-6 transform transition-transform duration-300 md:hidden shadow-2xl ${bgColor} ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 mb-6">
          <h1 className="text-2xl font-bold">🧠 ChatMate AI</h1>
          <button
            onClick={toggleSidebar}
            className={`p-2 rounded-lg transition ${
              theme === "dark"
                ? "bg-gray-800 text-white hover:bg-gray-700"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex flex-col gap-3 px-3 flex-1">
          <NavLink
            to="/"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `${linkClass} ${isActive ? "bg-blue-600 text-white" : ""}`
            }
          >
            <Home size={20} /> Home
          </NavLink>
          <NavLink
            to="/chat"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `${linkClass} ${isActive ? "bg-blue-600 text-white" : ""}`
            }
          >
            <MessageCircle size={20} /> Chat
          </NavLink>
          <NavLink
            to="/summarise"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `${linkClass} ${isActive ? "bg-blue-600 text-white" : ""}`
            }
          >
            <FileText size={20} /> Summarize PDF
          </NavLink>
        </nav>

        {/* Theme Toggle at Bottom */}
        <div className="px-4 mt-auto flex justify-center">
          <button
            onClick={toggleTheme}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              theme === "dark"
                ? "bg-gray-800 text-yellow-300 hover:bg-gray-700"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </div>

      {/* 📱 Background Overlay when Sidebar is open */}
      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-30 md:hidden"
        ></div>
      )}
    </>
  );
}
