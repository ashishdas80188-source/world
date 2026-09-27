import React, { useState } from 'react';
import { useTranslation } from '../../context/I18nContext';
import { useSettings } from '../../context/SettingsContext';
import {
  Navigation,
  Globe,
  Bot,
  Settings as SettingsIcon,
  Moon,
  Sun,
  Radio,
  User,
  Sparkles,
} from 'lucide-react';
import { LanguageSelectorModal } from './LanguageSelectorModal';

interface Props {
  onOpenAI: () => void;
  onOpenSettings: () => void;
  onOpenProfile: () => void;
}

export const Header: React.FC<Props> = ({ onOpenAI, onOpenSettings, onOpenProfile }) => {
  const { languageMeta, isRTL, t } = useTranslation();
  const { preferences, updatePreferences } = useSettings();
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);

  const toggleTheme = () => {
    const nextTheme =
      preferences.mapTheme === 'dark'
        ? 'light'
        : preferences.mapTheme === 'light'
        ? 'night_cyber'
        : 'dark';
    updatePreferences({ mapTheme: nextTheme });
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', nextTheme);
    }
  };

  return (
    <header className="app-header" role="banner">
      {/* Brand */}
      <div className="header-brand" onClick={() => window.location.reload()}>
        <div className="logo-badge">
          <Navigation size={22} />
        </div>
        <div className="brand-text">
          <h1>
            NAVIA <span style={{ color: 'var(--accent-cyan)' }}>AI</span>
          </h1>
          <span className="brand-tagline">{t('common.tagline')}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="header-actions">
        {/* RTL Badge if active */}
        {isRTL && (
          <span
            style={{
              padding: '4px 10px',
              borderRadius: '9999px',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#f87171',
              fontSize: '0.72rem',
              fontWeight: 700,
            }}
          >
            RTL עברית/العربية
          </span>
        )}

        {/* Global Language Selector Trigger */}
        <button
          className="btn-pill"
          onClick={() => setIsLangModalOpen(true)}
          title={t('selector.selectLanguage')}
          aria-label={t('selector.selectLanguage')}
          id="global-language-trigger"
        >
          <span style={{ fontSize: '1.1rem' }}>{languageMeta.flag}</span>
          <span style={{ fontWeight: 700 }}>{languageMeta.nativeName}</span>
          <Globe size={16} color="var(--accent-blue)" />
        </button>

        {/* AI Copilot Launcher */}
        <button
          className="btn-pill primary"
          onClick={onOpenAI}
          title={t('ai.title')}
          aria-label={t('ai.title')}
          id="ai-assistant-trigger"
        >
          <Bot size={18} />
          <span>{t('ai.title')}</span>
          <Sparkles size={14} color="#fef08a" />
        </button>

        {/* Theme Toggle */}
        <button
          className="btn-icon"
          onClick={toggleTheme}
          title={`Switch Theme: ${preferences.mapTheme}`}
          aria-label="Toggle Map Cartography Theme"
        >
          {preferences.mapTheme === 'dark' ? (
            <Moon size={18} color="var(--accent-cyan)" />
          ) : preferences.mapTheme === 'light' ? (
            <Sun size={18} color="#f59e0b" />
          ) : (
            <Radio size={18} color="#ec4899" />
          )}
        </button>

        {/* Settings Launcher */}
        <button
          className="btn-icon"
          onClick={onOpenSettings}
          title={t('settings.title')}
          aria-label={t('settings.title')}
          id="settings-drawer-trigger"
        >
          <SettingsIcon size={19} />
        </button>

        {/* User Profile / Region */}
        <button
          className="btn-icon"
          onClick={onOpenProfile}
          title="User Preferences & Account Sync"
          aria-label="User Profile"
        >
          <User size={19} />
        </button>
      </div>

      {/* Language Selector Modal */}
      <LanguageSelectorModal
        isOpen={isLangModalOpen}
        onClose={() => setIsLangModalOpen(false)}
      />
    </header>
  );
};
