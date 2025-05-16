'use client';

import { motion } from 'framer-motion';

interface CircularProgressProps {
  current: number;
  goal: number;
  size?: number;
  strokeWidth?: number;
}

export function CircularProgress({ current, goal, size = 120, strokeWidth = 8 }: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = Math.min(current / goal, 1);
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Background circle */}
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(75, 85, 99, 0.3)"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#gradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "easeInOut" }}
          style={{ strokeDasharray: circumference }}
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#A78BFA" />
          </linearGradient>
        </defs>
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-white">{current}</span>
        <span className="text-sm text-gray-400">of {goal}</span>
      </div>
    </div>
  );
}

interface StreakOrbsProps {
  currentStreak: number;
  goal: number;
}

export function StreakOrbs({ currentStreak, goal }: StreakOrbsProps) {
  return (
    <div className="flex items-center space-x-2">
      {Array.from({ length: goal }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className={`w-3 h-3 rounded-full ${
            index < currentStreak
              ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]'
              : 'bg-gray-800'
          }`}
        />
      ))}
    </div>
  );
} 