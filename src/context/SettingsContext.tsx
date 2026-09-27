import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserPreferences,
  DistanceUnit,
  SpeedUnit,
  TemperatureUnit,
  TimeFormat,
  CurrencyCode,
} from '../types/settings';
import { CurrencyService } from '../services/currencyService';
import { useTranslation } from './I18nContext';

interface SettingsContextType {
  preferences: UserPreferences;
  updatePreferences: (patch: Partial<UserPreferences>) => void;
  formatDistance: (meters: number) => string;
  formatSpeed: (kmh: number) => string;
  formatTemperature: (celsius: number) => string;
  formatTime: (date: Date) => string;
  formatCurrency: (amountInUSD: number) => string;
  resetToDefaults: () => void;
  exportSettingsJson: () => string;
  importSettingsJson: (jsonStr: string) => boolean;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  appLanguage: 'en',
  navLanguage: 'en',
  voiceLanguage: 'match_app',
  region: 'Global',
  currency: 'USD',
  distanceUnit: 'km',
  speedUnit: 'km/h',
  temperatureUnit: 'celsius',
  timeFormat: '12h',
  mapTheme: 'dark',
  voice: {
    enabled: true,
    autoAnnounce: true,
    voiceUri: 'auto',
    rate: 1.0,
    pitch: 1.0,
    volume: 1.0,
    language: 'auto',
  },
  accessibility: {
    highContrast: false,
    reducedMotion: false,
    fontSizeMultiplier: 1.0,
    screenReaderAnnouncements: true,
  },
  recentLanguages: ['en', 'hi', 'or', 'es', 'ar', 'ja'],
};

const STORAGE_KEY_PREFS = 'navia_user_preferences';

const SettingsContext = createContext<SettingsContextType | null>(null);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentLanguage, languageMeta, setLanguage } = useTranslation();

  const [preferences, setPreferencesState] = useState<UserPreferences>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_PREFS);
        if (saved) {
          return { ...DEFAULT_PREFERENCES, ...JSON.parse(saved) };
        }
      } catch {}
    }
    return DEFAULT_PREFERENCES;
  });

  // Sync appLanguage from i18n
  useEffect(() => {
    if (preferences.appLanguage !== currentLanguage) {
      setPreferencesState((prev) => ({ ...prev, appLanguage: currentLanguage }));
    }
  }, [currentLanguage]);

  // Apply visual accessibility variables to document root
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;

      if (preferences.accessibility.highContrast) {
        root.classList.add('high-contrast-mode');
      } else {
        root.classList.remove('high-contrast-mode');
      }

      if (preferences.accessibility.reducedMotion) {
        root.classList.add('reduced-motion-mode');
      } else {
        root.classList.remove('reduced-motion-mode');
      }

      root.style.setProperty(
        '--app-font-scale',
        String(preferences.accessibility.fontSizeMultiplier)
      );
    }
  }, [preferences.accessibility]);

  const updatePreferences = (patch: Partial<UserPreferences>) => {
    setPreferencesState((prev) => {
      const updated = { ...prev, ...patch };
      if (patch.voice) {
        updated.voice = { ...prev.voice, ...patch.voice };
      }
      if (patch.accessibility) {
        updated.accessibility = { ...prev.accessibility, ...patch.accessibility };
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY_PREFS, JSON.stringify(updated));
      }
      if (patch.appLanguage && patch.appLanguage !== currentLanguage) {
        setLanguage(patch.appLanguage);
      }
      return updated;
    });
  };

  const formatDistance = (meters: number): string => {
    if (preferences.distanceUnit === 'mi') {
      const miles = meters / 1609.344;
      if (miles < 0.1) {
        const feet = Math.round(meters * 3.28084);
        return `${feet} ft`;
      }
      return `${miles.toFixed(1)} mi`;
    } else {
      if (meters < 1000) {
        return `${Math.round(meters)} m`;
      }
      return `${(meters / 1000).toFixed(1)} km`;
    }
  };

  const formatSpeed = (kmh: number): string => {
    if (preferences.speedUnit === 'mph') {
      const mph = Math.round(kmh * 0.621371);
      return `${mph} mph`;
    }
    return `${Math.round(kmh)} km/h`;
  };

  const formatTemperature = (celsius: number): string => {
    if (preferences.temperatureUnit === 'fahrenheit') {
      const f = Math.round((celsius * 9) / 5 + 32);
      return `${f}°F`;
    }
    return `${Math.round(celsius)}°C`;
  };

  const formatTime = (date: Date): string => {
    try {
      return new Intl.DateTimeFormat(languageMeta.bcp47, {
        hour: 'numeric',
        minute: 'numeric',
        hour12: preferences.timeFormat === '12h',
      }).format(date);
    } catch {
      return date.toLocaleTimeString();
    }
  };

  const formatCurrency = (amountInUSD: number): string => {
    return CurrencyService.format(amountInUSD, preferences.currency, languageMeta.bcp47);
  };

  const resetToDefaults = () => {
    setPreferencesState(DEFAULT_PREFERENCES);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_PREFS, JSON.stringify(DEFAULT_PREFERENCES));
    }
    setLanguage('en');
  };

  const exportSettingsJson = (): string => {
    return JSON.stringify(preferences, null, 2);
  };

  const importSettingsJson = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed && typeof parsed === 'object') {
        updatePreferences(parsed);
        return true;
      }
    } catch {}
    return false;
  };

  return (
    <SettingsContext.Provider
      value={{
        preferences,
        updatePreferences,
        formatDistance,
        formatSpeed,
        formatTemperature,
        formatTime,
        formatCurrency,
        resetToDefaults,
        exportSettingsJson,
        importSettingsJson,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
