import { useState, useEffect, useRef } from 'react';
import { api, getToken } from './interpreter';

const STORAGE_KEY = 'listify_tab_focus_time_v1';

export interface DailyFocusMap {
  [dateStr: string]: number; // date YYYY-MM-DD -> seconds
}

export const getStoredFocusTime = (): DailyFocusMap => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
};

export const saveFocusTime = (data: DailyFocusMap) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save focus time', e);
  }
};

export const getTodayStr = (): string => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Flush focus time to backend database (works synchronously during pageunload / tab close)
 */
export const flushFocusTimeToDatabase = (dateStr: string, seconds: number) => {
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';
  const token = getToken();
  const payload = JSON.stringify({
    date: dateStr,
    seconds,
    minutes: Math.floor(seconds / 60),
  });

  if (navigator.sendBeacon) {
    const blob = new Blob([payload], { type: 'application/json' });
    navigator.sendBeacon(`${API_BASE_URL}/focus/sync`, blob);
  } else {
    fetch(`${API_BASE_URL}/focus/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: payload,
      keepalive: true,
    }).catch((e) => console.warn('Keepalive flush failed:', e));
  }
};

/**
 * Custom Hook to track active tab focus time in minutes, sync with database, and handle tab closing
 */
export const useTabFocusTime = () => {
  const [focusMap, setFocusMap] = useState<DailyFocusMap>(getStoredFocusTime);
  const focusMapRef = useRef<DailyFocusMap>(focusMap);

  // Keep ref synchronized with state for unload event handlers
  useEffect(() => {
    focusMapRef.current = focusMap;
  }, [focusMap]);

  // Load user's focus time from database on mount & merge
  useEffect(() => {
    let isMounted = true;
    api.getFocusTime().then((records) => {
      if (!isMounted || !Array.isArray(records) || records.length === 0) return;
      setFocusMap((prev) => {
        const merged = { ...prev };
        records.forEach((r) => {
          if (r.date) {
            const dbSecs = r.seconds || ((r.minutes || 0) * 60);
            merged[r.date] = Math.max(merged[r.date] || 0, dbSecs);
          }
        });
        saveFocusTime(merged);
        return merged;
      });
    }).catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  // Interval timer & tab unload listener to save focus time to database upon closing
  useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        const today = getTodayStr();
        setFocusMap((prev) => {
          const currentSecs = prev[today] || 0;
          const updatedSecs = currentSecs + 1;
          const updated = { ...prev, [today]: updatedSecs };
          saveFocusTime(updated);
          
          // Sync to backend every 10 seconds
          if (updatedSecs % 10 === 0) {
            api.syncFocusTime(today, Math.floor(updatedSecs / 60), updatedSecs);
          }
          return updated;
        });
      }
    }, 1000);

    // Save and send focus time to database when tab is closed or hidden
    const handleUnloadOrHide = () => {
      const today = getTodayStr();
      const currentSecs = focusMapRef.current[today] || 0;
      if (currentSecs > 0) {
        saveFocusTime(focusMapRef.current);
        flushFocusTimeToDatabase(today, currentSecs);
      }
    };

    window.addEventListener('beforeunload', handleUnloadOrHide);
    window.addEventListener('pagehide', handleUnloadOrHide);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        handleUnloadOrHide();
      }
    });

    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', handleUnloadOrHide);
      window.removeEventListener('pagehide', handleUnloadOrHide);
    };
  }, []);

  // Calculate focus minutes for current week (Mon-Sun)
  const getWeeklyFocusMinutes = (): number[] => {
    const now = new Date();
    const dayOfWeek = (now.getDay() + 6) % 7; // Mon: 0, Sun: 6
    const monday = new Date(now);
    monday.setDate(now.getDate() - dayOfWeek);
    monday.setHours(0, 0, 0, 0);

    const result = [0, 0, 0, 0, 0, 0, 0];

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateKey = `${year}-${month}-${day}`;

      const seconds = focusMap[dateKey] || 0;
      result[i] = Math.floor(seconds / 60);
    }

    return result;
  };

  const weeklyFocusMinutes = getWeeklyFocusMinutes();
  const totalFocusSeconds = Object.values(focusMap).reduce((a, b) => a + b, 0);
  const totalFocusMinutes = Math.floor(totalFocusSeconds / 60);

  const formatFocusString = (totalSeconds: number): string => {
    const mins = Math.floor(totalSeconds / 60);
    if (mins === 1) return '1 min';
    return `${mins} mins`;
  };

  return {
    focusMap,
    weeklyFocusMinutes,
    totalFocusSeconds,
    totalFocusMinutes,
    formattedTotalFocus: formatFocusString(totalFocusSeconds),
  };
};
