"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  FiMenu,
  FiX,
  FiHome,
  FiUsers,
  FiShoppingBag,
  FiLogOut,
} from "react-icons/fi";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="lg:hidden fixed top-0 left-0 w-full bg-white shadow-sm z-30">
        <div className="flex items-center justify-between p-4">
          <span className="font-bold text-lg">Admin</span>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 rounded-md focus:outline-none"
          >
            {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-30 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold">Green Gaming</h1>
        </div>

        <nav className="mt-6 px-4">
          <ul className="space-y-2">
            <li>
              <Link
                href="/admin"
                className={`flex items-center p-2 rounded-lg ${
                  pathname === "/admin"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <FiHome className="mr-3" />
                <span>Dashboard</span>
              </Link>
            </li>

            <li>
              <Link
                href="/admin/games"
                className={`flex items-center p-2 rounded-lg ${
                  pathname.startsWith("/admin/games")
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <FiShoppingBag className="mr-3" />
                <span>Games</span>
              </Link>
            </li>

            <li className="pt-4 mt-4 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="flex w-full items-center p-2 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                <FiLogOut className="mr-3" />
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <div className="lg:ml-64 flex flex-col min-h-screen">
        {/* Desktop header */}
        <header className="hidden lg:block bg-white border-b p-4">
          <h1 className="text-xl font-bold">Admin Panel</h1>
        </header>

        {/* Main content */}
        <main className="flex-grow p-4 mt-16 lg:mt-0">{children}</main>

        {/* Footer */}
        <footer className="bg-white p-4 border-t text-center text-sm text-gray-600">
          <p>© {new Date().getFullYear()} Green Gaming Admin</p>
        </footer>
      </div>
    </div>
  );
}
