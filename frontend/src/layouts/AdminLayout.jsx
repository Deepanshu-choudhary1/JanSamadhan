import React from "react";
import { Link } from "react-router-dom";
import { FiBarChart2, FiClipboard, FiHome } from "react-icons/fi";

export default function AdminLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold border-b border-gray-700">
          Jansamadhan
        </div>
        <nav className="flex-1 p-4 space-y-4">
          <Link
            to="/admin"
            className="flex items-center gap-2 hover:text-blue-400"
          >
            <FiHome /> Dashboard
          </Link>
          <Link
            to="/admin/issues"
            className="flex items-center gap-2 hover:text-blue-400"
          >
            <FiClipboard /> Manage Issues
          </Link>
          <Link
            to="/admin/analytics"
            className="flex items-center gap-2 hover:text-blue-400"
          >
            <FiBarChart2 /> Analytics
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-700">
          <button className="w-full bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md">
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <Link
      to="/"
      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Go to Home
    </Link>
            <span className="font-medium text-gray-700">Admin</span>
            <img
              src="https://ui-avatars.com/api/?name=Admin"
              alt="avatar"
              className="w-10 h-10 rounded-full border"
            />
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </main>
    </div>
  );
}
