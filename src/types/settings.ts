import { LanguageCode } from './i18n';

export type DistanceUnit = 'km' | 'mi';
export type SpeedUnit = 'km/h' | 'mph';
export type TemperatureUnit = 'celsius' | 'fahrenheit';
export type TimeFormat = '12h' | '24h';

export type CurrencyCode =
  | 'USD'
  | 'INR'
  | 'EUR'
  | 'GBP'
  | 'JPY'
  | 'CNY'
  | 'AUD'
  | 'CAD'
  | 'SGD'
  | 'AED'
  | 'SAR'
  | 'CHF'
  | 'NZD'
  | 'KRW'
  | 'BRL'
  | 'MXN';

export interface CurrencyMeta {
  code: CurrencyCode;
  symbol: string;
  name: string;
  rateAgainstUSD: number; // dynamically configurable
  flag: string;
}

export interface VoiceSettings {
  enabled: boolean;
  autoAnnounce: boolean;
  voiceUri: string;
  rate: number; // 0.5 - 2.0
  pitch: number; // 0.5 - 1.5
  volume: number; // 0 - 1.0
  language: string; // BCP 47 code or 'auto'
}

export interface AccessibilitySettings {
  highContrast: boolean;
  reducedMotion: boolean;
  fontSizeMultiplier: number; // 0.9, 1.0, 1.15, 1.3
  screenReaderAnnouncements: boolean;
}

export interface UserPreferences {
  appLanguage: LanguageCode;
  navLanguage: LanguageCode;
  voiceLanguage: string; // BCP 47 or 'match_app'
  region: string;
  currency: CurrencyCode;
  distanceUnit: DistanceUnit;
  speedUnit: SpeedUnit;
  temperatureUnit: TemperatureUnit;
  timeFormat: TimeFormat;
  mapTheme: 'dark' | 'light' | 'satellite' | 'night_cyber';
  voice: VoiceSettings;
  accessibility: AccessibilitySettings;
  recentLanguages: LanguageCode[];
}
