// ==========================================
// ACTIVE TAB FOCUS TIME TRACKER HOOK
// This file automatically tracks the total time (in minutes and seconds)
// the user spends actively viewing and working on the application.
// It syncs focus duration to localStorage and the backend database.
// ==========================================

import { useState, useEffect, useRef } from 'react';
import { syncFocusTime, getFocusTime } from '../service/task';
import { getToken } from '../service/auth';

const STORAGE_KEY = 'listify_tab_focus_time_v1';

// Mapping structure: Date string ("2026-07-22") -> total focus seconds
export interface DailyFocusMap {
  [dateStr: string]: number;
}

// Read focus map from browser localStorage
export const getStoredFocusTime = (): DailyFocusMap => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
};

// Save focus map to browser localStorage
export const saveFocusTime = (data: DailyFocusMap) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save focus time', e);
  }
};

// Helper: Get today's date formatted as YYYY-MM-DD
export const getTodayStr = (): string => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Flush focus time to backend database during page unload / tab close
 */
export const flushFocusTimeToDatabase = (dateStr: string, seconds: number) => {
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';
  const token = getToken();
  const payload = JSON.stringify({
    date: dateStr,
    seconds,
    minutes: Math.floor(seconds / 60),
  });

  // Use browser sendBeacon API if available for safe background delivery
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
 * React Hook: Tracks active workspace focus time in real time.
 */
export const useTabFocusTime = () => {
  const [focusMap, setFocusMap] = useState<DailyFocusMap>(getStoredFocusTime);
  const focusMapRef = useRef<DailyFocusMap>(focusMap);

  // Keep ref synchronized with state for unload event listeners
  useEffect(() => {
    focusMapRef.current = focusMap;
  }, [focusMap]);

  // Fetch initial focus records from backend database on mount
  useEffect(() => {
    let isMounted = true;
    getFocusTime().then((records) => {
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

  // Timer interval: Increments focus time by +1 second while tab is visible
  useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        const today = getTodayStr();
        setFocusMap((prev) => {
          const currentSecs = prev[today] || 0;
          const updatedSecs = currentSecs + 1;
          const updated = { ...prev, [today]: updatedSecs };
          saveFocusTime(updated);
          
          // Auto-sync to backend database every 10 seconds
          if (updatedSecs % 10 === 0) {
            syncFocusTime(today, Math.floor(updatedSecs / 60), updatedSecs);
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

  // Compute daily focus minutes for the current week (Mon-Sun)
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
