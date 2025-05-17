'use client';

import { useState } from "react";
import { DashboardNavbar } from "@/components/navbar/dashboard-navbar";
import { useSyncedData } from "@/lib/sync";
import { toast } from "sonner";

export default function SettingsPage() {
  const { syncedData, updateSyncedData, isLoading } = useSyncedData();
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateSyncedData('settings', {
        nickname: syncedData.settings.nickname,
        dailyCalorieGoal: syncedData.settings.dailyCalorieGoal,
        streakGoal: syncedData.settings.streakGoal,
      });
      toast.success('Settings saved successfully!');
    } catch {
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <DashboardNavbar />
      <main className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black pt-20 p-8">
        <div className="container mx-auto max-w-2xl">
          <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>
          
          <div className="space-y-6 bg-gray-800/50 p-6 rounded-xl border border-gray-700">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nickname
              </label>
              <input
                type="text"
                value={syncedData.settings.nickname}
                onChange={(e) => updateSyncedData('settings', { ...syncedData.settings, nickname: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your nickname"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Daily Calorie Goal
              </label>
              <input
                type="number"
                value={syncedData.settings.dailyCalorieGoal}
                onChange={(e) => updateSyncedData('settings', { ...syncedData.settings, dailyCalorieGoal: parseInt(e.target.value) })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Streak Goal (days)
              </label>
              <input
                type="number"
                value={syncedData.settings.streakGoal}
                onChange={(e) => updateSyncedData('settings', { ...syncedData.settings, streakGoal: parseInt(e.target.value) })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
              />
            </div>

            <button
              onClick={handleSave}
              disabled={loading}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </main>
    </>
  );
} 