import React, { useState } from 'react';
import { useTranslation } from '../../context/I18nContext';
import { useSettings } from '../../context/SettingsContext';
import { useNavigation } from '../../context/NavigationContext';
import { VoiceService } from '../../services/voiceService';
import {
  Search,
  Mic,
  MicOff,
  Navigation as NavIcon,
  Play,
  Zap,
  Leaf,
  Compass,
  DollarSign,
  Clock,
  Gauge,
  X,
  Sparkles,
} from 'lucide-react';

export const SearchPanel: React.FC = () => {
  const { t, languageMeta } = useTranslation();
  const { formatDistance, formatCurrency, preferences } = useSettings();
  const {
    activeCategory,
    setActiveCategory,
    searchPlaces,
    destination,
    setDestination,
    availableRoutes,
    selectedRoute,
    selectRoute,
    startNavigation,
    isNavigating,
    stopNavigation,
  } = useNavigation();

  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);

  const categories = [
    { id: 'all', labelKey: 'categories.all', icon: '🌐' },
    { id: 'restaurant', labelKey: 'categories.restaurants', icon: '🍽️' },
    { id: 'ev', labelKey: 'categories.evCharging', icon: '⚡' },
    { id: 'gas', labelKey: 'categories.gasStations', icon: '⛽' },
    { id: 'tourist', labelKey: 'categories.touristAttractions', icon: '🏛️' },
    { id: 'hospital', labelKey: 'categories.hospitals', icon: '🏥' },
    { id: 'hotel', labelKey: 'categories.hotels', icon: '🏨' },
  ];

  const popularDestinations = [
    { name: 'Tokyo Station (東京駅)', coord: [35.681236, 139.767125] as [number, number] },
    { name: 'Eiffel Tower (Tour Eiffel)', coord: [48.85837, 2.294481] as [number, number] },
    { name: 'India Gate (इण्डिया गेट)', coord: [28.612912, 77.22951] as [number, number] },
    { name: 'Burj Khalifa (برج خليفة)', coord: [25.197197, 55.274376] as [number, number] },
  ];

  const handleSearchChange = (val: string) => {
    setQuery(val);
    searchPlaces(val);
  };

  const handleVoiceSearch = () => {
    if (isListening) return;

    setVoiceError(null);
    setIsListening(true);

    const voiceLang =
      preferences.voiceLanguage === 'match_app'
        ? languageMeta.bcp47
        : preferences.voiceLanguage;

    VoiceService.startListening(
      voiceLang,
      (transcript) => {
        setQuery(transcript);
        searchPlaces(transcript);
        setIsListening(false);
      },
      (err) => {
        setVoiceError(`Voice input error: ${err}`);
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      }
    );
  };

  return (
    <div className="hud-panel" style={{ maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}>
      {/* Category Pills */}
      <div className="category-scroller" style={{ marginBottom: '12px' }}>
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`category-chip ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat.id)}
          >
            <span>{cat.icon}</span>
            <span>{t(cat.labelKey)}</span>
          </button>
        ))}
      </div>

      {/* Multilingual Place Search Bar */}
      <div className="search-input-wrapper" style={{ marginBottom: '12px' }}>
        <Search size={18} color="var(--text-muted)" />
        <input
          type="text"
          className="search-input"
          placeholder={t('nav.searchPlaceholder')}
          value={query}
          onChange={(e) => handleSearchChange(e.target.value)}
          id="search-destinations-input"
        />
        {query && (
          <button
            onClick={() => handleSearchChange('')}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={16} />
          </button>
        )}
        <button
          className={`btn-icon ${isListening ? 'listening-pulse' : ''}`}
          onClick={handleVoiceSearch}
          title={isListening ? t('voice.micListening') : t('voice.title')}
          style={{ width: '32px', height: '32px', borderRadius: '8px' }}
          id="voice-search-button"
        >
          {isListening ? <Mic size={16} color="#ffffff" /> : <Mic size={16} color="var(--accent-blue)" />}
        </button>
      </div>

      {voiceError && (
        <div
          style={{
            fontSize: '0.75rem',
            color: '#f87171',
            padding: '6px 10px',
            background: 'rgba(239, 68, 68, 0.15)',
            borderRadius: '6px',
            marginBottom: '10px',
          }}
        >
          {voiceError}
        </div>
      )}

      {/* Popular Destination Fast Chips */}
      {!destination && (
        <div style={{ marginBottom: '14px' }}>
          <div
            style={{
              fontSize: '0.78rem',
              color: 'var(--text-muted)',
              fontWeight: 600,
              marginBottom: '6px',
            }}
          >
            {t('nav.popularDestinations')}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {popularDestinations.map((p, idx) => (
              <button
                key={idx}
                className="btn-pill"
                onClick={() => {
                  setDestination({
                    id: `preset-${idx}`,
                    name: p.name,
                    coordinate: p.coord,
                    isDestination: true,
                  });
                }}
                style={{ padding: '4px 10px', fontSize: '0.78rem' }}
              >
                <span>📍</span>
                <span>{p.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selected Destination Card */}
      {destination && (
        <div
          style={{
            background: 'rgba(56, 189, 248, 0.08)',
            border: '1px solid var(--border-glow)',
            borderRadius: '12px',
            padding: '12px 14px',
            marginBottom: '14px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: '#ef4444',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '12px',
                }}
              >
                ★
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {t('nav.chooseDestination')}
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{destination.name}</div>
              </div>
            </div>
            <button
              className="btn-icon"
              onClick={() => setDestination(null)}
              style={{ width: '28px', height: '28px', borderRadius: '50%' }}
              title="Change destination"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Available Route Options */}
      {availableRoutes.length > 0 && (
        <div>
          <div
            style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Compass size={14} color="var(--accent-blue)" />
            <span>Optimal Routes ({availableRoutes.length})</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
            {availableRoutes.map((route) => {
              const isSelected = selectedRoute?.id === route.id;
              const durationMin = Math.round(route.durationSeconds / 60);

              return (
                <div
                  key={route.id}
                  className={`route-option-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => selectRoute(route)}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span className={`route-badge ${route.type}`}>
                        {route.type === 'fastest'
                          ? t('nav.fastestRoute')
                          : route.type === 'eco'
                          ? t('nav.ecoRoute')
                          : t('nav.scenicRoute')}
                      </span>
                      {route.trafficStatus === 'smooth' && (
                        <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 600 }}>
                          ● {t('nav.smoothTraffic')}
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.84rem' }}>
                      <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                        {durationMin} min
                      </span>
                      <span style={{ color: 'var(--text-muted)' }}>
                        {formatDistance(route.distanceMeters)}
                      </span>
                      <span style={{ color: 'var(--accent-amber)', fontWeight: 600 }}>
                        {route.tollCostUSD > 0
                          ? `${t('common.toll')}: ${formatCurrency(route.tollCostUSD)}`
                          : t('common.free')}
                      </span>
                    </div>
                  </div>

                  {route.type === 'eco' && route.co2SavingsKg && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        color: '#10b981',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                      }}
                    >
                      <Leaf size={14} />
                      <span>-{route.co2SavingsKg} kg CO₂</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Action Launch Buttons */}
          <div style={{ display: 'flex', gap: '10px' }}>
            {!isNavigating ? (
              <button
                className="btn-pill primary"
                style={{ flex: 1, justifyContent: 'center', padding: '12px' }}
                onClick={() => startNavigation(true)}
                id="start-simulation-btn"
              >
                <Play size={18} />
                <span>{t('nav.simulateTrip')}</span>
              </button>
            ) : (
              <button
                className="btn-pill"
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  padding: '12px',
                  background: '#ef4444',
                  color: 'white',
                  borderColor: '#ef4444',
                }}
                onClick={stopNavigation}
                id="stop-navigation-btn"
              >
                <X size={18} />
                <span>{t('nav.stopNavigation')}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
