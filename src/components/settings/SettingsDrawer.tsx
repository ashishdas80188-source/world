import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../context/I18nContext';
import { useSettings } from '../../context/SettingsContext';
import { LanguageCode } from '../../types/i18n';
import {
  CurrencyCode,
  DistanceUnit,
  SpeedUnit,
  TemperatureUnit,
  TimeFormat,
} from '../../types/settings';
import { CURRENCY_METAS } from '../../services/currencyService';
import { VoiceService } from '../../services/voiceService';
import {
  Settings as SettingsIcon,
  X,
  Globe,
  Compass,
  Volume2,
  DollarSign,
  Clock,
  Eye,
  RotateCcw,
  Download,
  Upload,
  Check,
  AlertTriangle,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsDrawer: React.FC<Props> = ({ isOpen, onClose }) => {
  const { currentLanguage, setLanguage, allLanguages, t, languageMeta } = useTranslation();
  const {
    preferences,
    updatePreferences,
    resetToDefaults,
    exportSettingsJson,
    importSettingsJson,
    formatCurrency,
  } = useSettings();

  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [testPlaying, setTestPlaying] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [importText, setImportText] = useState('');
  const [showImport, setShowImport] = useState(false);

  useEffect(() => {
    VoiceService.getVoices().then((v) => setVoices(v));
  }, []);

  if (!isOpen) return null;

  const handleTestVoice = async () => {
    setTestPlaying(true);
    const voiceLang =
      preferences.voiceLanguage === 'match_app'
        ? languageMeta.bcp47
        : preferences.voiceLanguage;

    try {
      await VoiceService.speak(
        t('voice.voiceTestMessage'),
        preferences.voice,
        voiceLang
      );
    } catch {}
    setTestPlaying(false);
  };

  const handleExport = () => {
    const jsonStr = exportSettingsJson();
    navigator.clipboard?.writeText(jsonStr);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleImportSubmit = () => {
    if (importSettingsJson(importText)) {
      setShowImport(false);
      setImportText('');
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '720px' }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={t('settings.title')}
      >
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="logo-badge" style={{ width: '38px', height: '38px' }}>
              <SettingsIcon size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{t('settings.title')}</h2>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                {t('settings.unitsAndFormatting')}
              </p>
            </div>
          </div>
          <button className="btn-icon" onClick={onClose} aria-label={t('common.close')}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {/* Section 1: Languages */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.9rem',
                fontWeight: 700,
                color: 'var(--accent-cyan)',
                marginBottom: '12px',
              }}
            >
              <Globe size={18} />
              <span>Internationalization (i18n) & Language Overrides</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              {/* App Language */}
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  {t('settings.appLanguage')}
                </label>
                <select
                  className="search-input"
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                  value={currentLanguage}
                  onChange={(e) => setLanguage(e.target.value as LanguageCode)}
                >
                  {allLanguages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.nativeName} ({lang.name})
                    </option>
                  ))}
                </select>
              </div>

              {/* Navigation Language */}
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  {t('settings.navLanguage')}
                </label>
                <select
                  className="search-input"
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                  value={preferences.navLanguage}
                  onChange={(e) => updatePreferences({ navLanguage: e.target.value as LanguageCode })}
                >
                  {allLanguages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.nativeName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Regional Units & Formatting */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.9rem',
                fontWeight: 700,
                color: 'var(--accent-blue)',
                marginBottom: '12px',
              }}
            >
              <Compass size={18} />
              <span>{t('settings.unitsAndFormatting')}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
              {/* Distance Unit */}
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  {t('settings.distanceUnit')}
                </label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    className={`btn-pill ${preferences.distanceUnit === 'km' ? 'primary' : ''}`}
                    style={{ flex: 1, justifyContent: 'center', padding: '6px' }}
                    onClick={() => updatePreferences({ distanceUnit: 'km', speedUnit: 'km/h' })}
                  >
                    km
                  </button>
                  <button
                    className={`btn-pill ${preferences.distanceUnit === 'mi' ? 'primary' : ''}`}
                    style={{ flex: 1, justifyContent: 'center', padding: '6px' }}
                    onClick={() => updatePreferences({ distanceUnit: 'mi', speedUnit: 'mph' })}
                  >
                    mi
                  </button>
                </div>
              </div>

              {/* Temperature Unit */}
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  {t('settings.tempUnit')}
                </label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    className={`btn-pill ${preferences.temperatureUnit === 'celsius' ? 'primary' : ''}`}
                    style={{ flex: 1, justifyContent: 'center', padding: '6px' }}
                    onClick={() => updatePreferences({ temperatureUnit: 'celsius' })}
                  >
                    °C
                  </button>
                  <button
                    className={`btn-pill ${preferences.temperatureUnit === 'fahrenheit' ? 'primary' : ''}`}
                    style={{ flex: 1, justifyContent: 'center', padding: '6px' }}
                    onClick={() => updatePreferences({ temperatureUnit: 'fahrenheit' })}
                  >
                    °F
                  </button>
                </div>
              </div>

              {/* Time Format */}
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  {t('settings.timeFormat')}
                </label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    className={`btn-pill ${preferences.timeFormat === '12h' ? 'primary' : ''}`}
                    style={{ flex: 1, justifyContent: 'center', padding: '6px' }}
                    onClick={() => updatePreferences({ timeFormat: '12h' })}
                  >
                    12-Hour
                  </button>
                  <button
                    className={`btn-pill ${preferences.timeFormat === '24h' ? 'primary' : ''}`}
                    style={{ flex: 1, justifyContent: 'center', padding: '6px' }}
                    onClick={() => updatePreferences({ timeFormat: '24h' })}
                  >
                    24-Hour
                  </button>
                </div>
              </div>
            </div>

            {/* Currency Selector & Sample Preview */}
            <div style={{ marginTop: '14px' }}>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                {t('settings.currency')} (16+ International Currencies)
              </label>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <select
                  className="search-input"
                  style={{
                    flex: 1,
                    padding: '8px 10px',
                    borderRadius: '8px',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                  value={preferences.currency}
                  onChange={(e) => updatePreferences({ currency: e.target.value as CurrencyCode })}
                  id="currency-select-dropdown"
                >
                  {Object.values(CURRENCY_METAS).map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.code} ({c.symbol}) - {c.name}
                    </option>
                  ))}
                </select>
                <div
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    background: 'rgba(245, 158, 11, 0.15)',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    color: 'var(--accent-amber)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                  }}
                >
                  Sample Toll: {formatCurrency(12.5)}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Voice Guidance & Audio Synthesizer */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.9rem',
                fontWeight: 700,
                color: 'var(--accent-purple)',
                marginBottom: '12px',
              }}
            >
              <Volume2 size={18} />
              <span>{t('voice.title')}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '12px' }}>
              {/* Rate */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
                  <span>{t('voice.speechRate')}</span>
                  <span>{preferences.voice.rate}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={preferences.voice.rate}
                  onChange={(e) =>
                    updatePreferences({ voice: { ...preferences.voice, rate: parseFloat(e.target.value) } })
                  }
                  style={{ width: '100%' }}
                />
              </div>

              {/* Pitch */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
                  <span>{t('voice.speechPitch')}</span>
                  <span>{preferences.voice.pitch}</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="1.5"
                  step="0.1"
                  value={preferences.voice.pitch}
                  onChange={(e) =>
                    updatePreferences({ voice: { ...preferences.voice, pitch: parseFloat(e.target.value) } })
                  }
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                className="btn-pill primary"
                onClick={handleTestVoice}
                disabled={testPlaying}
                style={{ padding: '8px 14px', fontSize: '0.82rem' }}
                id="test-voice-guidance-btn"
              >
                <Volume2 size={16} />
                <span>{testPlaying ? 'Speaking...' : t('voice.testVoiceBtn')}</span>
              </button>
            </div>
          </div>

          {/* Section 4: Accessibility */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.9rem',
                fontWeight: 700,
                color: 'var(--accent-green)',
                marginBottom: '12px',
              }}
            >
              <Eye size={18} />
              <span>{t('settings.accessibility')}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
              <button
                className={`btn-pill ${preferences.accessibility.highContrast ? 'primary' : ''}`}
                onClick={() =>
                  updatePreferences({
                    accessibility: {
                      ...preferences.accessibility,
                      highContrast: !preferences.accessibility.highContrast,
                    },
                  })
                }
              >
                <span>{t('settings.highContrast')}</span>
              </button>

              <button
                className={`btn-pill ${preferences.accessibility.reducedMotion ? 'primary' : ''}`}
                onClick={() =>
                  updatePreferences({
                    accessibility: {
                      ...preferences.accessibility,
                      reducedMotion: !preferences.accessibility.reducedMotion,
                    },
                  })
                }
              >
                <span>{t('settings.reducedMotion')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button
            className="btn-pill"
            onClick={resetToDefaults}
            style={{ color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.4)' }}
          >
            <RotateCcw size={14} />
            <span>{t('settings.resetDefaults')}</span>
          </button>

          <button className="btn-pill" onClick={handleExport}>
            {copySuccess ? <Check size={14} color="#10b981" /> : <Download size={14} />}
            <span>{copySuccess ? 'Copied to Clipboard!' : t('settings.exportSettings')}</span>
          </button>

          <button className="btn-pill primary" onClick={onClose}>
            {t('common.save')}
          </button>
        </div>
      </div>
    </div>
  );
};
