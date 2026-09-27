import React, { useState, useMemo } from 'react';
import { useTranslation } from '../../context/I18nContext';
import { LanguageCode, LanguageMeta } from '../../types/i18n';
import { Search, X, Globe, Check, Sparkles } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const LanguageSelectorModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { currentLanguage, setLanguage, t, allLanguages, recentLanguages, isRTL } =
    useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');

  const regions = ['All', 'South Asia', 'Europe & Americas', 'Middle East & Africa', 'East & Southeast Asia', 'Global'];

  const filteredLanguages = useMemo(() => {
    return allLanguages.filter((lang) => {
      const matchesSearch =
        lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lang.code.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRegion = selectedRegion === 'All' || lang.region === selectedRegion;

      return matchesSearch && matchesRegion;
    });
  }, [allLanguages, searchQuery, selectedRegion]);

  if (!isOpen) return null;

  const handleSelect = (code: LanguageCode) => {
    setLanguage(code);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '780px' }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={t('selector.selectLanguage')}
      >
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="logo-badge" style={{ width: '36px', height: '36px' }}>
              <Globe size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                {t('selector.selectLanguage')}
              </h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {t('selector.allLanguages')} (45+)
              </p>
            </div>
          </div>
          <button
            className="btn-icon"
            onClick={onClose}
            aria-label={t('common.close')}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Search Input */}
          <div className="search-input-wrapper" style={{ marginBottom: '14px' }}>
            <Search size={18} color="var(--text-muted)" />
            <input
              type="text"
              className="search-input"
              placeholder={t('selector.searchLanguage')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Region Tabs */}
          <div className="category-scroller" style={{ marginBottom: '16px' }}>
            {regions.map((region) => (
              <button
                key={region}
                className={`category-chip ${selectedRegion === region ? 'active' : ''}`}
                onClick={() => setSelectedRegion(region)}
              >
                {region}
              </button>
            ))}
          </div>

          {/* Recently Used Languages */}
          {recentLanguages.length > 0 && !searchQuery && selectedRegion === 'All' && (
            <div style={{ marginBottom: '20px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: 'var(--accent-blue)',
                  marginBottom: '8px',
                }}
              >
                <Sparkles size={14} />
                {t('selector.recentLanguages')}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {recentLanguages.map((code) => {
                  const meta = allLanguages.find((l) => l.code === code);
                  if (!meta) return null;
                  const isCurrent = meta.code === currentLanguage;
                  return (
                    <button
                      key={meta.code}
                      className={`btn-pill ${isCurrent ? 'primary' : ''}`}
                      onClick={() => handleSelect(meta.code)}
                      style={{ padding: '6px 12px', fontSize: '0.82rem' }}
                    >
                      <span>{meta.flag}</span>
                      <span>{meta.nativeName}</span>
                      {meta.dir === 'rtl' && (
                        <span style={{ fontSize: '0.68rem', opacity: 0.8 }}>(RTL)</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Language Cards Grid */}
          <div className="lang-grid">
            {filteredLanguages.map((lang: LanguageMeta) => {
              const isSelected = lang.code === currentLanguage;
              return (
                <div
                  key={lang.code}
                  className={`lang-card ${isSelected ? 'active' : ''}`}
                  onClick={() => handleSelect(lang.code)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && handleSelect(lang.code)}
                >
                  <span className="lang-flag">{lang.flag}</span>
                  <div className="lang-info" style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span className="lang-native">{lang.nativeName}</span>
                      {lang.dir === 'rtl' && (
                        <span
                          style={{
                            fontSize: '0.65rem',
                            padding: '1px 5px',
                            background: 'rgba(56, 189, 248, 0.2)',
                            borderRadius: '4px',
                            color: 'var(--accent-cyan)',
                          }}
                        >
                          RTL
                        </span>
                      )}
                    </div>
                    <span className="lang-english">{lang.name}</span>
                  </div>
                  {isSelected && <Check size={18} color="var(--accent-cyan)" />}
                </div>
              );
            })}
          </div>

          {filteredLanguages.length === 0 && (
            <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)' }}>
              <p>No matching languages found for "{searchQuery}"</p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginInlineEnd: 'auto' }}>
            {isRTL ? '🌐 Right-to-Left (RTL) Active' : '🌐 Left-to-Right (LTR) Active'}
          </span>
          <button className="btn-pill" onClick={onClose}>
            {t('common.close')}
          </button>
        </div>
      </div>
    </div>
  );
};
