'use client';

import { motion, AnimatePresence } from "framer-motion";
import { DashboardNavbar } from "@/components/navbar/dashboard-navbar";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSyncedData } from "@/lib/sync";

export default function ProfilePage() {
  const router = useRouter();
  const { syncedData, updateSyncedData, isLoading } = useSyncedData();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateSyncedData('settings', {
        nickname: syncedData.settings.nickname,
        dailyCalorieGoal: syncedData.settings.dailyCalorieGoal,
        streakGoal: syncedData.settings.streakGoal,
      });
      toast.success('Profile updated successfully!');
      
      // Wait for the toast to be visible
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Animate out and redirect
      router.push('/dashboard');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <DashboardNavbar />
        <main className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black pt-20 p-8">
          <div className="container mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-800 rounded w-1/4 mb-8"></div>
              <div className="space-y-4">
                <div className="h-32 bg-gray-800 rounded"></div>
                <div className="h-32 bg-gray-800 rounded"></div>
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <DashboardNavbar />
      <AnimatePresence mode="wait">
        <motion.main
          key="profile-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black pt-20 p-8"
        >
          <div className="container mx-auto max-w-2xl">
            <div className="space-y-8">
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                Profile Settings
              </h1>

              <div className="space-y-6">
                {/* Profile Information */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="p-6 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700"
                >
                  <h2 className="text-xl font-semibold mb-4 text-blue-400">Profile Information</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Nickname
                      </label>
                      <input
                        type="text"
                        value={syncedData.settings.nickname}
                        onChange={(e) => updateSyncedData('settings', { ...syncedData.settings, nickname: e.target.value })}
                        placeholder="Enter your nickname"
                        className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Goals */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="p-6 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700"
                >
                  <h2 className="text-xl font-semibold mb-4 text-blue-400">Goals</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Daily Calorie Goal
                      </label>
                      <input
                        type="number"
                        value={syncedData.settings.dailyCalorieGoal}
                        onChange={(e) => updateSyncedData('settings', { ...syncedData.settings, dailyCalorieGoal: parseInt(e.target.value) })}
                        min="500"
                        max="10000"
                        step="100"
                        className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Streak Goal (days)
                      </label>
                      <input
                        type="number"
                        value={syncedData.settings.streakGoal}
                        onChange={(e) => updateSyncedData('settings', { ...syncedData.settings, streakGoal: parseInt(e.target.value) })}
                        min="1"
                        max="365"
                        className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Save Button */}
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  onClick={handleSave}
                  disabled={isSaving}
                  className={`w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white font-medium transition-all ${
                    isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
                  }`}
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.main>
      </AnimatePresence>
    </>
  );
} 