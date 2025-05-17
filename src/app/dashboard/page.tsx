'use client';

import { useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardNavbar } from "@/components/navbar/dashboard-navbar";
import { useState, useEffect } from "react";
import { CircularProgress } from "@/components/dashboard/progress-cards";
import { LogMealModal } from "@/components/dashboard/log-meal-modal";
import { useSyncedData, MealData } from "@/lib/sync";
import { addDays, isSameDay, startOfToday } from 'date-fns';
import { Confetti } from '@/components/confetti';

export default function DashboardPage() {
  const { user } = useUser();
  const { syncedData, updateSyncedData, isLoading, error } = useSyncedData();
  const [isLogMealModalOpen, setIsLogMealModalOpen] = useState(false);
  const [isConfettiActive, setIsConfettiActive] = useState(false);

  // Destructure data from syncedData for easier access
  const { settings, meals, streak, goalsAchieved } = syncedData;
  const { nickname, dailyCalorieGoal, streakGoal } = settings;
  const { lastLogDate, currentStreak, longestStreak } = streak;

  const [currentCalorieIntake, setCurrentCalorieIntake] = useState(0);

  // Calculate current calorie intake whenever meals change
  useEffect(() => {
    const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
    setCurrentCalorieIntake(totalCalories);
  }, [meals]);

  // Streak logic
  useEffect(() => {
    if (currentCalorieIntake >= dailyCalorieGoal) {
      const today = startOfToday();
      const lastLog = lastLogDate ? new Date(lastLogDate) : null;

      if (!lastLog || !isSameDay(lastLog, today)) {
        // Check if it's the day after the last log to continue streak
        const yesterday = addDays(today, -1);
        const newStreak = (lastLog && isSameDay(lastLog, yesterday)) ? currentStreak + 1 : 1;

        updateSyncedData('streak', {
          lastLogDate: today.toISOString(),
          currentStreak: newStreak,
          longestStreak: Math.max(longestStreak, newStreak),
        });

        // Check for streak goals achieved
        if (newStreak >= streakGoal && goalsAchieved < streakGoal) {
          setIsConfettiActive(true);
          updateSyncedData('goalsAchieved', goalsAchieved + 1);
        }
      }
    }
    // Reset confetti after animation
    if (isConfettiActive) {
      const timer = setTimeout(() => setIsConfettiActive(false), 5000); // Adjust time as needed
      return () => clearTimeout(timer);
    }
  }, [currentCalorieIntake, dailyCalorieGoal, lastLogDate, currentStreak, longestStreak, streakGoal, goalsAchieved, updateSyncedData, isConfettiActive]);

  const handleLogMeal = (mealData: MealData) => {
    const updatedMeals = [...meals, mealData];
    updateSyncedData('meals', updatedMeals);
    setIsLogMealModalOpen(false);
  };

  // Determine greeting and motivational quote based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const motivationalQuotes = [
    'Fuel your body, empower your mind.',
    'Every meal is a step towards a healthier you.',
    'Consistency is key. Keep tracking!',
    'Small changes lead to big results.',
    'Nourish to flourish.',
  ];

  const getMotivationalQuote = () => {
    const today = new Date();
    const quoteIndex = today.getDate() % motivationalQuotes.length;
    return motivationalQuotes[quoteIndex];
  };

  if (isLoading) {
    return <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center"><p className="text-white">Loading dashboard...</p></div>; // Loading state
  }

  if (error) {
    return <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center text-red-400">Error loading dashboard: {error.message}</div>; // Error state
  }

  return (
    <>
      {isConfettiActive && <Confetti />} {/* Confetti component */}
      <DashboardNavbar />
      <AnimatePresence mode="wait">
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black pt-20 p-8"
        >
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                {getGreeting()}, {nickname || user?.firstName || 'User'}!
              </h1>
              {getGreeting() === 'Good Morning' && (
                <div className="mt-2 text-lg text-blue-200 italic animate-fade-in">
                  {getMotivationalQuote()}
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Quick Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="p-6 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700"
                >
                  <h2 className="text-xl font-semibold mb-4 text-blue-400">Today&apos;s Overview</h2>
                  <div className="flex flex-col items-center space-y-6">
                    <CircularProgress
                      current={currentCalorieIntake}
                      goal={dailyCalorieGoal}
                      size={160}
                    />
                    <div className="w-full space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Calories Consumed</span>
                        <span className="text-white">{Math.round(currentCalorieIntake)} / {dailyCalorieGoal} kcal</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Quick Actions */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="p-6 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700"
                >
                  <h2 className="text-xl font-semibold mb-4 text-blue-400">Quick Actions</h2>
                  <div className="space-y-4">
                    <button
                      onClick={() => setIsLogMealModalOpen(true)}
                      className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
                    >
                      Log a Meal
                    </button>
                    <button className="w-full px-4 py-2 border border-gray-600 rounded-lg text-white font-medium hover:bg-gray-800 transition-colors">
                      View History
                    </button>
                  </div>
                </motion.div>

                {/* Progress */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="p-6 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700"
                >
                  <h2 className="text-xl font-semibold mb-4 text-blue-400">Your Progress</h2>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Current Streak</span>
                        <span className="text-white">{currentStreak} days</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Longest Streak</span>
                        <span className="text-white">{longestStreak} days</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Recent Meals */}
              {meals.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="p-6 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700"
                >
                  <h2 className="text-xl font-semibold mb-4 text-blue-400">Recent Meals</h2>
                  <div className="space-y-4">
                    {meals.slice(-3).reverse().map((meal: MealData, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-gray-700"
                      >
                        <div>
                          <h3 className="text-white font-medium">{meal.name}</h3>
                          <p className="text-sm text-gray-400">{new Date(meal.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                        <span className="text-white font-medium">{meal.calories} kcal</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </motion.main>
      </AnimatePresence>

      <LogMealModal
        isOpen={isLogMealModalOpen}
        onClose={() => setIsLogMealModalOpen(false)}
        onLogMeal={(mealData) => handleLogMeal(mealData)}
      />
    </>
  );
} 