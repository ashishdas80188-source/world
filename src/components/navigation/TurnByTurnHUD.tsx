import React from 'react';
import { useTranslation } from '../../context/I18nContext';
import { useSettings } from '../../context/SettingsContext';
import { useNavigation } from '../../context/NavigationContext';
import {
  ArrowUp,
  ArrowUpLeft,
  ArrowUpRight,
  CornerUpLeft,
  CornerUpRight,
  RotateCcw,
  Volume2,
  VolumeX,
  X,
  Gauge,
  Sparkles,
  CheckCircle,
} from 'lucide-react';

export const TurnByTurnHUD: React.FC = () => {
  const { t } = useTranslation();
  const { formatDistance, formatSpeed, preferences, updatePreferences } = useSettings();
  const {
    isNavigating,
    currentStep,
    currentDistanceRemainingMeters,
    currentSpeedKmh,
    selectedRoute,
    destination,
    stopNavigation,
    speakCurrentInstruction,
  } = useNavigation();

  if (!isNavigating || !currentStep) return null;

  const renderTurnIcon = (iconType: string) => {
    switch (iconType) {
      case 'turn-left':
        return <CornerUpLeft size={28} color="#ffffff" />;
      case 'turn-right':
        return <CornerUpRight size={28} color="#ffffff" />;
      case 'turn-slight-left':
        return <ArrowUpLeft size={28} color="#ffffff" />;
      case 'turn-slight-right':
        return <ArrowUpRight size={28} color="#ffffff" />;
      case 'u-turn':
        return <RotateCcw size={28} color="#ffffff" />;
      case 'destination':
        return <CheckCircle size={28} color="#10b981" />;
      default:
        return <ArrowUp size={28} color="#ffffff" />;
    }
  };

  const translatedInstruction = t(currentStep.instructionKey, {
    street: currentStep.streetName,
    destination: destination?.name || '',
    exit: 2,
  });

  return (
    <div className="guidance-banner" role="status" aria-live="assertive">
      {/* Icon */}
      <div className="turn-icon-large">{renderTurnIcon(currentStep.icon)}</div>

      {/* Instruction Content */}
      <div className="turn-text-content">
        <div className="turn-distance">{formatDistance(currentDistanceRemainingMeters)}</div>
        <div className="turn-instruction">{translatedInstruction}</div>
      </div>

      {/* Speed & Audio Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Speedometer */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'rgba(0, 0, 0, 0.25)',
            padding: '6px 10px',
            borderRadius: '10px',
          }}
        >
          <span style={{ fontSize: '0.68rem', opacity: 0.8 }}>{t('nav.currentSpeed')}</span>
          <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>
            {formatSpeed(currentSpeedKmh)}
          </span>
        </div>

        {/* Speak / Audio Replay */}
        <button
          className="btn-icon"
          onClick={speakCurrentInstruction}
          title={t('voice.testVoiceBtn')}
          style={{ background: 'rgba(255, 255, 255, 0.2)', color: 'white', border: 'none' }}
          id="replay-voice-guidance"
        >
          {preferences.voice.enabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>

        {/* End Navigation */}
        <button
          className="btn-icon"
          onClick={stopNavigation}
          title={t('nav.stopNavigation')}
          style={{ background: 'rgba(239, 68, 68, 0.8)', color: 'white', border: 'none' }}
          id="hud-close-navigation"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};
