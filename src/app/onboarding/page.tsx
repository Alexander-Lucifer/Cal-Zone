"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSyncedData } from "@/lib/sync";
import { toast } from "sonner";

export default function OnboardingPage() {
  const router = useRouter();
  const { syncedData, updateSyncedData } = useSyncedData();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const steps = [
    {
      label: "What's your nickname?",
      content: (
        <input
          className="w-full p-3 rounded-lg border border-gray-700 bg-gray-900 text-white focus:outline-none focus:border-blue-500"
          placeholder="e.g. Alex"
          value={syncedData.settings.nickname}
          onChange={e => updateSyncedData('settings', { ...syncedData.settings, nickname: e.target.value })}
          autoFocus
        />
      ),
      canContinue: syncedData.settings.nickname.trim().length > 0,
    },
    {
      label: "What's your daily calorie goal?",
      content: (
        <input
          type="number"
          className="w-full p-3 rounded-lg border border-gray-700 bg-gray-900 text-white focus:outline-none focus:border-blue-500"
          value={syncedData.settings.dailyCalorieGoal}
          min={1000}
          max={5000}
          step={50}
          onChange={e => updateSyncedData('settings', { ...syncedData.settings, dailyCalorieGoal: Number(e.target.value) })}
        />
      ),
      canContinue: syncedData.settings.dailyCalorieGoal >= 1000 && syncedData.settings.dailyCalorieGoal <= 5000,
    },
    {
      label: "What's your streak goal?",
      content: (
        <input
          type="number"
          className="w-full p-3 rounded-lg border border-gray-700 bg-gray-900 text-white focus:outline-none focus:border-blue-500"
          value={syncedData.settings.streakGoal}
          min={3}
          max={30}
          step={1}
          onChange={e => updateSyncedData('settings', { ...syncedData.settings, streakGoal: Number(e.target.value) })}
        />
      ),
      canContinue: syncedData.settings.streakGoal >= 3 && syncedData.settings.streakGoal <= 30,
    },
  ];

  const handleNext = async () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      setLoading(true);
      try {
        await updateSyncedData('settings', {
          nickname: syncedData.settings.nickname,
          dailyCalorieGoal: syncedData.settings.dailyCalorieGoal,
          streakGoal: syncedData.settings.streakGoal,
        });
        toast.success('Settings saved!');
        router.push('/dashboard');
      } catch {
        toast.error('Failed to save settings');
      } finally {
        setLoading(false);
      }
    }
  };

  // If already onboarded, redirect
  if (typeof window !== "undefined" && syncedData.settings.nickname) {
    router.replace("/dashboard");
    return null;
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="w-full max-w-md p-8 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl">
        <h1 className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          Welcome to Cal-Zone!
        </h1>
        <div className="mb-6 text-lg text-blue-200 text-center font-medium">
          {steps[step].label}
        </div>
        <div className="mb-8 min-h-[64px]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
            >
              {steps[step].content}
            </motion.div>
          </AnimatePresence>
        </div>
        <button
          className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold text-lg shadow-md hover:opacity-90 transition disabled:opacity-50"
          onClick={handleNext}
          disabled={!steps[step].canContinue || loading}
        >
          {step < steps.length - 1 ? "Next" : loading ? "Finishing..." : "Finish"}
        </button>
        <div className="flex justify-center gap-2 mt-6">
          {steps.map((_, idx) => (
            <div
              key={idx}
              className={`w-3 h-3 rounded-full border-2 ${step === idx ? "bg-blue-400 border-blue-400" : "bg-gray-700 border-gray-500"}`}
            />
          ))}
        </div>
      </div>
    </main>
  );
} 