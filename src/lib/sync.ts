import { useUser } from "@clerk/nextjs";
import { useEffect, useState, useCallback } from "react";

export interface UserSettings {
  nickname: string;
  dailyCalorieGoal: number;
  streakGoal: number;
}

export interface StreakData {
  lastLogDate: string | null;
  currentStreak: number;
  longestStreak: number;
}

export interface MealData {
  id: string;
  name: string;
  calories: number;
  timestamp: number;
}

interface SyncedData {
  settings: UserSettings;
  meals: MealData[];
  streak: StreakData;
  goalsAchieved: number; // New field for goals achieved count
}

const DEFAULT_SETTINGS: UserSettings = {
  nickname: '',
  dailyCalorieGoal: 2000,
  streakGoal: 7,
};

const DEFAULT_STREAK_DATA: StreakData = {
  lastLogDate: null,
  currentStreak: 0,
  longestStreak: 0,
};

const DEFAULT_SYNCED_DATA: SyncedData = {
    settings: DEFAULT_SETTINGS,
    meals: [],
    streak: DEFAULT_STREAK_DATA,
    goalsAchieved: 0,
};

// Helper to get Supabase column keys
type SyncedDataKeys = keyof SyncedData;

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

export function useSyncedData() {
  const { user } = useUser();
  const userId = user?.id;

  const [syncedData, setSyncedData] = useState<SyncedData>(DEFAULT_SYNCED_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Function to fetch data for a specific key
  const fetchData = useCallback(async (key: SyncedDataKeys): Promise<SyncedData[SyncedDataKeys] | null> => {
    if (!userId) return null;

    try {
      console.log(`Fetching key ${key} for user ${userId}`);
      const response = await fetch(`/api/sync?key=${key}`);

      if (!response.ok) {
        console.error(`Failed to fetch ${key}:`, response.status);
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Failed to fetch ${key}: Status ${response.status}`);
      }

      const data = await response.json();
      console.log(`Fetched ${key}:`, data);
      return data;

    } catch (err) {
      console.error(`Error fetching ${key}:`, err);
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      return null;
    }
  }, [userId]);

  // Function to sync data for a specific key
  const syncKey = useCallback(async (key: SyncedDataKeys, data: SyncedData[SyncedDataKeys]) => {
    if (!userId) return;

    try {
      console.log(`Syncing key ${key} for user ${userId}`);
      const response = await fetch('/api/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key, data }),
      });

      if (!response.ok) {
        console.error(`Failed to sync ${key}:`, response.status);
        throw new Error(`Failed to sync ${key}: Status ${response.status}`);
      }
      console.log(`Successfully synced ${key}`);
    } catch (err) {
      console.error(`Error syncing ${key}:`, err);
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      throw err; // Re-throw to handle in the component
    }
  }, [userId]);

  // Effect to load data from Supabase on mount and poll for updates
  useEffect(() => {
    let isMounted = true;
    let lastData: string | null = null;

    const loadData = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }
      
      if (isMounted) {
        setIsLoading(true);
        setError(null);
      }

      try {
        // Fetch all keys in parallel
        const [settings, meals, streak, goalsAchieved] = await Promise.all([
          fetchData('settings') as Promise<UserSettings | null>,
          fetchData('meals') as Promise<MealData[] | null>,
          fetchData('streak') as Promise<StreakData | null>,
          fetchData('goalsAchieved') as Promise<number | null>,
        ]);

        if (isMounted) {
          const newData = {
            settings: settings || DEFAULT_SETTINGS,
            meals: meals || [],
            streak: streak || DEFAULT_STREAK_DATA,
            goalsAchieved: goalsAchieved || 0,
          };

          // Only update if data has changed
          const newDataString = JSON.stringify(newData);
          if (newDataString !== lastData) {
            lastData = newDataString;
            setSyncedData(newData);
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Unknown error occurred'));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    // Initial load
    loadData();

    // Set up polling every 30 seconds
    const pollInterval: NodeJS.Timeout = setInterval(loadData, 30000);

    // Cleanup
    return () => {
      isMounted = false;
      clearInterval(pollInterval);
    };
  }, [userId, fetchData]);

  // Function to update and sync data for a specific key
  const updateSyncedData = useCallback(async <K extends SyncedDataKeys>(key: K, data: SyncedData[K]) => {
    // Optimistically update local state
    setSyncedData(prevData => ({
      ...prevData,
      [key]: data,
    }));

    try {
      // Sync with server
      await syncKey(key, data);
    } catch (err) {
      // Revert on error
      setSyncedData(prevData => ({
        ...prevData,
        [key]: prevData[key],
      }));
      throw err;
    }
  }, [syncKey]);

  return {
    syncedData,
    updateSyncedData,
    isLoading,
    error,
  };
} 