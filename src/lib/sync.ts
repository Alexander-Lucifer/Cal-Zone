import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export interface UserSettings {
  nickname: string;
  dailyCalorieGoal: number;
  streakGoal: number;
}

export interface StreakData {
  lastGoalMet: string; // ISO date string
  currentStreak: number;
}

export interface MealData {
  name: string;
  calories: number;
  time: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

// Helper to get a user-specific key
export const getKey = (userId: string, base: string) => `${base}_${userId}`;

// Function to sync data with Clerk's user metadata
export async function syncWithClerk<T>(userId: string, key: string, data: T) {
  try {
    const response = await fetch('/api/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        key,
        data,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to sync data');
    }

    return await response.json();
  } catch (error) {
    console.error('Error syncing data:', error);
    throw error;
  }
}

// Hook to manage synced data
export function useSyncedData<T>(key: string, initialValue: T) {
  const { user } = useUser();
  const [data, setData] = useState<T>(initialValue);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const userId = user.id;
    const storageKey = getKey(userId, key);

    // Load from localStorage first for immediate access
    const localData = localStorage.getItem(storageKey);
    if (localData) {
      setData(JSON.parse(localData));
    }

    // Then sync with Clerk
    const syncData = async () => {
      try {
        const response = await fetch(`/api/sync?userId=${userId}&key=${key}`);
        if (response.ok) {
          const { data: syncedData } = await response.json();
          if (syncedData) {
            setData(syncedData);
            localStorage.setItem(storageKey, JSON.stringify(syncedData));
          }
        }
      } catch (error) {
        console.error('Error syncing data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    syncData();
  }, [user, key]);

  const updateData = async (newData: T) => {
    if (!user) return;

    const userId = user.id;
    const storageKey = getKey(userId, key);

    // Update local state and localStorage
    setData(newData);
    localStorage.setItem(storageKey, JSON.stringify(newData));

    // Sync with Clerk
    try {
      await syncWithClerk(userId, key, newData);
    } catch (error) {
      console.error('Error updating synced data:', error);
    }
  };

  return { data, updateData, isLoading };
} 