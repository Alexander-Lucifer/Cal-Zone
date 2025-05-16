'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface LogMealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogMeal: (mealData: MealData) => void;
}

export interface MealData {
  name: string;
  calories: number;
  time: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

export function LogMealModal({ isOpen, onClose, onLogMeal }: LogMealModalProps) {
  const [mealData, setMealData] = useState<MealData>({
    name: '',
    calories: 0,
    time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
    type: 'breakfast',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogMeal(mealData);
    setMealData({
      name: '',
      calories: 0,
      time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      type: 'breakfast',
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-gray-900 rounded-xl shadow-xl z-50 border border-gray-800"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                  Log a Meal
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <XMarkIcon className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Meal Name
                  </label>
                  <input
                    type="text"
                    value={mealData.name}
                    onChange={(e) => setMealData({ ...mealData, name: e.target.value })}
                    placeholder="e.g., Grilled Chicken Salad"
                    required
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Calories
                  </label>
                  <input
                    type="number"
                    value={mealData.calories}
                    onChange={(e) => setMealData({ ...mealData, calories: parseInt(e.target.value) })}
                    min="0"
                    required
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    value={mealData.time}
                    onChange={(e) => setMealData({ ...mealData, time: e.target.value })}
                    required
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Meal Type
                  </label>
                  <select
                    value={mealData.type}
                    onChange={(e) => setMealData({ ...mealData, type: e.target.value as MealData['type'] })}
                    required
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snack">Snack</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
                >
                  Log Meal
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 