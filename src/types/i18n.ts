export type LanguageCode =
  | 'en'    // English
  | 'hi'    // Hindi (हिन्दी)
  | 'or'    // Odia (ଓଡ଼ିଆ)
  | 'bn'    // Bengali (বাংলা)
  | 'te'    // Telugu (తెలుగు)
  | 'ta'    // Tamil (தமிழ்)
  | 'kn'    // Kannada (ಕನ್ನಡ)
  | 'ml'    // Malayalam (മലയാളം)
  | 'mr'    // Marathi (मराठी)
  | 'gu'    // Gujarati (ગુજરાતી)
  | 'pa'    // Punjabi (ਪੰਜਾਬੀ)
  | 'ur'    // Urdu (اردو)
  | 'as'    // Assamese (অসমীয়া)
  | 'ne'    // Nepali (नेपाली)
  | 'sa'    // Sanskrit (संस्कृतम्)
  | 'es'    // Spanish (Español)
  | 'fr'    // French (Français)
  | 'de'    // German (Deutsch)
  | 'it'    // Italian (Italiano)
  | 'pt'    // Portuguese (Português)
  | 'nl'    // Dutch (Nederlands)
  | 'ru'    // Russian (Русский)
  | 'uk'    // Ukrainian (Українська)
  | 'ar'    // Arabic (العربية)
  | 'he'    // Hebrew (עברית)
  | 'tr'    // Turkish (Türkçe)
  | 'fa'    // Persian (فارسی)
  | 'zh-CN' // Chinese Simplified (简体中文)
  | 'zh-TW' // Chinese Traditional (繁體中文)
  | 'ja'    // Japanese (日本語)
  | 'ko'    // Korean (한국어)
  | 'th'    // Thai (ไทย)
  | 'vi'    // Vietnamese (Tiếng Việt)
  | 'id'    // Indonesian (Bahasa Indonesia)
  | 'ms'    // Malay (Bahasa Melayu)
  | 'tl'    // Filipino (Tagalog)
  | 'sw'    // Swahili (Kiswahili)
  | 'pl'    // Polish (Polski)
  | 'ro'    // Romanian (Română)
  | 'el'    // Greek (Ελληνικά)
  | 'cs'    // Czech (Čeština)
  | 'sv'    // Swedish (Svenska)
  | 'da'    // Danish (Dansk)
  | 'no'    // Norwegian (Norsk)
  | 'fi';   // Finnish (Suomi)

export type TextDirection = 'ltr' | 'rtl';

export interface LanguageMeta {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  dir: TextDirection;
  region: 'South Asia' | 'Middle East & Africa' | 'Europe & Americas' | 'East & Southeast Asia' | 'Global';
  bcp47: string;
  sampleGreeting: string;
}

export interface TranslationDictionary {
  [key: string]: any;
}
