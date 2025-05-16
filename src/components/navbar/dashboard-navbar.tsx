'use client';

import { useUser, useClerk } from "@clerk/nextjs";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

export function DashboardNavbar() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center hover:opacity-80 transition-opacity"
          >
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Cal-Zone
            </h1>
          </button>

          {/* Hamburger Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            {isMenuOpen ? (
              <XMarkIcon className="w-6 h-6 text-white" />
            ) : (
              <Bars3Icon className="w-6 h-6 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-800"
          >
            <div className="container mx-auto px-4 py-4">
              <div className="space-y-4">
                {/* User Info */}
                <div className="flex items-center space-x-3 pb-4 border-b border-gray-800">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                    {user?.firstName?.[0] || user?.lastName?.[0] || 'U'}
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-sm text-gray-400">{user?.primaryEmailAddress?.emailAddress}</p>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      router.push('/dashboard');
                    }}
                    className="w-full px-4 py-2 text-left text-white hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      router.push('/profile');
                    }}
                    className="w-full px-4 py-2 text-left text-white hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      router.push('/settings');
                    }}
                    className="w-full px-4 py-2 text-left text-white hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    Settings
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="w-full px-4 py-2 text-left text-red-400 hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
} 