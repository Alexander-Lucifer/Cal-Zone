'use client';

import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { DashboardNavbar } from "@/components/navbar/dashboard-navbar";
import { useState, useEffect, useCallback } from "react";
import { CircularProgress, StreakOrbs } from "@/components/dashboard/progress-cards";
import { LogMealModal, MealData } from "@/components/dashboard/log-meal-modal";
import { ConfettiBurst } from "@/components/effects/confetti-burst";
import { toast } from "sonner";

interface UserSettings {
  nickname: string;
  dailyCalorieGoal: number;
  streakGoal: number;
}

interface StreakData {
  lastGoalMet: string; // ISO date string
  currentStreak: number;
}

export default function DashboardPage() {
  const { user } = useUser();
  const [settings, setSettings] = useState<UserSettings>({
    nickname: '',
    dailyCalorieGoal: 2000,
    streakGoal: 7,
  });
  const [currentCalories, setCurrentCalories] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [isLogMealModalOpen, setIsLogMealModalOpen] = useState(false);
  const [meals, setMeals] = useState<MealData[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [goalsAchieved, setGoalsAchieved] = useState(0);

  // Helper to get a user-specific key
  const userId = user?.id || 'guest';
  const getKey = useCallback((base: string) => `${base}_${userId}`, [userId]);

  useEffect(() => {
    // Load user settings from localStorage
    const savedSettings = localStorage.getItem(getKey('userSettings'));
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }

    // Load meals from localStorage
    const savedMeals = localStorage.getItem(getKey('meals'));
    if (savedMeals) {
      const parsedMeals = JSON.parse(savedMeals);
      setMeals(parsedMeals);
      // Calculate total calories
      const totalCalories = parsedMeals.reduce((sum: number, meal: MealData) => sum + meal.calories, 0);
      setCurrentCalories(totalCalories);
    }

    // Load streak data
    const savedStreak = localStorage.getItem(getKey('streakData'));
    if (savedStreak) {
      const streakData: StreakData = JSON.parse(savedStreak);
      setCurrentStreak(streakData.currentStreak);
    }

    // Load goals achieved
    const savedGoals = localStorage.getItem(getKey('goalsAchieved'));
    if (savedGoals) {
      const goalsArr = JSON.parse(savedGoals);
      setGoalsAchieved(goalsArr.length);
    }
  }, [getKey]);

  const updateStreak = (newCalories: number) => {
    const today = new Date().toISOString().split('T')[0];
    const savedStreak = localStorage.getItem(getKey('streakData'));
    const streakData: StreakData = savedStreak ? JSON.parse(savedStreak) : { lastGoalMet: '', currentStreak: 0 };

    // Check if we've already met the goal today
    if (streakData.lastGoalMet === today) {
      return;
    }

    // If calories meet or exceed the goal
    if (newCalories >= settings.dailyCalorieGoal) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      // If the last goal was met yesterday, increment streak
      if (streakData.lastGoalMet === yesterdayStr) {
        streakData.currentStreak += 1;
      } else {
        // If it's been more than a day, reset streak to 1
        streakData.currentStreak = 1;
      }

      streakData.lastGoalMet = today;
      setCurrentStreak(streakData.currentStreak);
      localStorage.setItem(getKey('streakData'), JSON.stringify(streakData));

      // Update goals achieved
      let goalsArr: string[] = [];
      const savedGoals = localStorage.getItem(getKey('goalsAchieved'));
      if (savedGoals) {
        goalsArr = JSON.parse(savedGoals);
      }
      if (!goalsArr.includes(today)) {
        goalsArr.push(today);
        localStorage.setItem(getKey('goalsAchieved'), JSON.stringify(goalsArr));
        setGoalsAchieved(goalsArr.length);
      }

      // Show confetti and achievement toast
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000); // Hide confetti after 3 seconds

      if (streakData.currentStreak > 1) {
        toast.success(`🔥 ${streakData.currentStreak} day streak! Keep it up!`);
      } else {
        toast.success('🎯 Daily goal achieved!');
      }
    }
  };

  const handleLogMeal = (mealData: MealData) => {
    const updatedMeals = [...meals, mealData];
    setMeals(updatedMeals);
    localStorage.setItem(getKey('meals'), JSON.stringify(updatedMeals));
    
    // Update calories
    const newTotalCalories = currentCalories + mealData.calories;
    setCurrentCalories(newTotalCalories);
    
    // Check and update streak
    updateStreak(newTotalCalories);
    
    // Show success message
    toast.success('Meal logged successfully!');
  };

  // Helper to get greeting based on time
  function getGreeting() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Good morning';
    if (hour >= 12 && hour < 17) return 'Good afternoon';
    if (hour >= 17 && hour < 21) return 'Good evening';
    return 'Good night';
  }

  // Motivational quotes for the morning
  const morningQuotes = [
    "Rise and shine! Today is full of possibilities.",
    "Every morning is a new beginning.",
    "Start your day with a smile and positive thoughts.",
    "You are capable of amazing things!",
    "Make today count!",
    "Small steps every day lead to big results.",
    "Your only limit is your mind."
  ];
  // Deterministic random quote per user per day
  function getDailyQuote() {
    const today = new Date().toISOString().split('T')[0];
    const userKey = (settings.nickname || user?.firstName || 'User') + today;
    // Simple hash function
    let hash = 0;
    for (let i = 0; i < userKey.length; i++) {
      hash = ((hash << 5) - hash) + userKey.charCodeAt(i);
      hash |= 0;
    }
    const idx = Math.abs(hash) % morningQuotes.length;
    return morningQuotes[idx];
  }

  return (
    <>
      <DashboardNavbar />
      <main className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black pt-20 p-8">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              {getGreeting()}, {settings.nickname || user?.firstName || 'User'}!
            </h1>
            {getGreeting() === 'Good morning' && (
              <div className="mt-2 text-lg text-blue-200 italic animate-fade-in">
                {getDailyQuote()}
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
                    current={currentCalories}
                    goal={settings.dailyCalorieGoal}
                    size={160}
                  />
                  <div className="w-full space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Meals Tracked</span>
                      <span className="text-white">{meals.length}</span>
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
                      <span className="text-gray-400">Weekly Streak</span>
                      <span className="text-white">{currentStreak} / {settings.streakGoal} days</span>
                    </div>
                    <StreakOrbs currentStreak={currentStreak} goal={settings.streakGoal} />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Goals Achieved</span>
                    <span className="text-white">{goalsAchieved}</span>
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
                  {meals.slice(-3).reverse().map((meal, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-gray-700"
                    >
                      <div>
                        <h3 className="text-white font-medium">{meal.name}</h3>
                        <p className="text-sm text-gray-400">{meal.type} &apos; {meal.time}</p>
                      </div>
                      <span className="text-white font-medium">{meal.calories} cal</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </main>

      <LogMealModal
        isOpen={isLogMealModalOpen}
        onClose={() => setIsLogMealModalOpen(false)}
        onLogMeal={handleLogMeal}
      />

      {/* Show confetti only when showConfetti is true */}
      {showConfetti && <ConfettiBurst />}
    </>
  );
} 