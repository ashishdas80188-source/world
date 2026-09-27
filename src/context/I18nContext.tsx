import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { LanguageCode, LanguageMeta, TextDirection } from '../types/i18n';
import { SUPPORTED_LANGUAGES, LANGUAGE_LIST } from '../locales/languages';
import { getTranslation, AppTranslations } from '../locales/translations';

interface I18nContextType {
  currentLanguage: LanguageCode;
  languageMeta: LanguageMeta;
  direction: TextDirection;
  isRTL: boolean;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  recentLanguages: LanguageCode[];
  allLanguages: LanguageMeta[];
}

const I18nContext = createContext<I18nContextType | null>(null);

const STORAGE_KEY_LANG = 'navia_app_language';
const STORAGE_KEY_RECENT = 'navia_recent_languages';

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguageState] = useState<LanguageCode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY_LANG) as LanguageCode;
      if (saved && SUPPORTED_LANGUAGES[saved]) return saved;

      // Auto-detect browser locale if available
      const browserLang = navigator.language?.split('-')[0] as LanguageCode;
      if (browserLang && SUPPORTED_LANGUAGES[browserLang]) return browserLang;
    }
    return 'en';
  });

  const [recentLanguages, setRecentLanguages] = useState<LanguageCode[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY_RECENT) || '[]');
        if (Array.isArray(saved) && saved.length > 0) return saved;
      } catch {}
    }
    return ['en', 'hi', 'or', 'es', 'ar', 'ja'];
  });

  const languageMeta = useMemo(() => {
    return SUPPORTED_LANGUAGES[currentLanguage] || SUPPORTED_LANGUAGES.en;
  }, [currentLanguage]);

  const direction = languageMeta.dir;
  const isRTL = direction === 'rtl';

  const translations = useMemo(() => {
    return getTranslation(currentLanguage);
  }, [currentLanguage]);

  // Synchronize document attributes
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = currentLanguage;
      document.documentElement.dir = direction;
      document.body.dir = direction;
      if (isRTL) {
        document.documentElement.classList.add('rtl-layout');
      } else {
        document.documentElement.classList.remove('rtl-layout');
      }
    }
  }, [currentLanguage, direction, isRTL]);

  const setLanguage = (lang: LanguageCode) => {
    if (!SUPPORTED_LANGUAGES[lang]) return;
    setCurrentLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_LANG, lang);
      setRecentLanguages((prev) => {
        const filtered = prev.filter((code) => code !== lang);
        const updated = [lang, ...filtered].slice(0, 8);
        localStorage.setItem(STORAGE_KEY_RECENT, JSON.stringify(updated));
        return updated;
      });
    }
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    const parts = key.split('.');
    let current: any = translations;
    for (const part of parts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part];
      } else {
        // Fallback to English
        let enFallback: any = getTranslation('en');
        for (const enPart of parts) {
          if (enFallback && typeof enFallback === 'object' && enPart in enFallback) {
            enFallback = enFallback[enPart];
          } else {
            enFallback = null;
            break;
          }
        }
        current = enFallback || key;
        break;
      }
    }

    if (typeof current !== 'string') {
      return key;
    }

    if (params) {
      let interpolated = current;
      for (const [pKey, pVal] of Object.entries(params)) {
        interpolated = interpolated.replace(new RegExp(`\\{${pKey}\\}`, 'g'), String(pVal));
      }
      return interpolated;
    }

    return current;
  };

  return (
    <I18nContext.Provider
      value={{
        currentLanguage,
        languageMeta,
        direction,
        isRTL,
        setLanguage,
        t,
        recentLanguages,
        allLanguages: LANGUAGE_LIST,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
};
