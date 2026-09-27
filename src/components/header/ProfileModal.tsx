import React, { useState } from 'react';
import { useTranslation } from '../../context/I18nContext';
import { useSettings } from '../../context/SettingsContext';
import { User, Shield, Cloud, Check, Globe, X, MapPin } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpenLanguageSelector: () => void;
}

export const ProfileModal: React.FC<Props> = ({ isOpen, onClose, onOpenLanguageSelector }) => {
  const { languageMeta, isRTL, t } = useTranslation();
  const { preferences } = useSettings();
  const [synced, setSynced] = useState(false);

  if (!isOpen) return null;

  const handleSync = () => {
    setSynced(true);
    setTimeout(() => setSynced(false), 3000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '540px' }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="User Profile"
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="logo-badge" style={{ width: '38px', height: '38px' }}>
              <User size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Global Navigator Profile</h2>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                Session & Preferences Sync
              </p>
            </div>
          </div>
          <button className="btn-icon" onClick={onClose} aria-label={t('common.close')}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* User Card */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.15), rgba(129, 140, 248, 0.15))',
              border: '1px solid var(--border-glow)',
              borderRadius: '14px',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #00f2fe, #4facfe)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 800,
                fontSize: '1.2rem',
              }}
            >
              N
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>Guest Explorer</div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                Active Session • Region: {preferences.region}
              </div>
            </div>
            <span
              style={{
                padding: '4px 10px',
                background: 'rgba(16, 185, 129, 0.2)',
                color: '#10b981',
                borderRadius: '9999px',
                fontSize: '0.72rem',
                fontWeight: 700,
              }}
            >
              ONLINE
            </span>
          </div>

          {/* Active Settings Overview */}
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '14px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px',
              fontSize: '0.84rem',
            }}
          >
            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.74rem' }}>App Language:</span>
              <div style={{ fontWeight: 700 }}>
                {languageMeta.flag} {languageMeta.nativeName}
              </div>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.74rem' }}>Layout Direction:</span>
              <div style={{ fontWeight: 700 }}>{isRTL ? 'Right-to-Left (RTL)' : 'Left-to-Right (LTR)'}</div>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.74rem' }}>Currency:</span>
              <div style={{ fontWeight: 700 }}>{preferences.currency}</div>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.74rem' }}>Units:</span>
              <div style={{ fontWeight: 700 }}>
                {preferences.distanceUnit.toUpperCase()} • {preferences.temperatureUnit === 'celsius' ? '°C' : '°F'}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              className="btn-pill"
              style={{ flex: 1, justifyContent: 'center' }}
              onClick={() => {
                onClose();
                onOpenLanguageSelector();
              }}
            >
              <Globe size={16} color="var(--accent-blue)" />
              <span>Change Language</span>
            </button>

            <button
              className="btn-pill primary"
              style={{ flex: 1, justifyContent: 'center' }}
              onClick={handleSync}
            >
              {synced ? <Check size={16} /> : <Cloud size={16} />}
              <span>{synced ? 'Synced!' : 'Sync to Cloud'}</span>
            </button>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-pill" onClick={onClose}>
            {t('common.close')}
          </button>
        </div>
      </div>
    </div>
  );
};
