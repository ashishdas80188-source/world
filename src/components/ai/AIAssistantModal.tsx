import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from '../../context/I18nContext';
import { useSettings } from '../../context/SettingsContext';
import { useNavigation } from '../../context/NavigationContext';
import { AIAssistantService } from '../../services/aiAssistantService';
import { VoiceService } from '../../services/voiceService';
import { AIMessage } from '../../types/ai';
import { POI } from '../../types/navigation';
import {
  Bot,
  Send,
  Mic,
  MicOff,
  X,
  Sparkles,
  Volume2,
  Navigation,
  Compass,
  Coffee,
  Zap,
  Activity,
  Trash2,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AIAssistantModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { t, currentLanguage, languageMeta } = useTranslation();
  const { preferences } = useSettings();
  const { setDestination, setSelectedPOI, startNavigation } = useNavigation();

  const [inputQuery, setInputQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);

  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: t('ai.welcomeMsg'),
      timestamp: new Date(),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  if (!isOpen) return null;

  const handleSend = async (queryText?: string) => {
    const textToSend = (queryText || inputQuery).trim();
    if (!textToSend || isThinking) return;

    setInputQuery('');
    const userMsg: AIMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsThinking(true);

    try {
      const result = await AIAssistantService.processQuery(textToSend, currentLanguage);

      const assistantMsg: AIMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: result.replyText,
        timestamp: new Date(),
        poiResults: result.pois,
      };

      setMessages((prev) => [...prev, assistantMsg]);

      // Spoken response if voice is enabled
      if (preferences.voice.enabled) {
        const voiceLang =
          preferences.voiceLanguage === 'match_app'
            ? languageMeta.bcp47
            : preferences.voiceLanguage;
        VoiceService.speak(result.replyText, preferences.voice, voiceLang).catch(() => {});
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'assistant',
          text: t('common.error'),
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleVoiceInput = () => {
    if (isListening) return;

    setIsListening(true);
    const voiceLang =
      preferences.voiceLanguage === 'match_app'
        ? languageMeta.bcp47
        : preferences.voiceLanguage;

    VoiceService.startListening(
      voiceLang,
      (transcript) => {
        setInputQuery(transcript);
        setIsListening(false);
        handleSend(transcript);
      },
      () => {
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      }
    );
  };

  const handleNavigateToPOI = (poi: POI) => {
    setDestination({
      id: poi.id,
      name: poi.name,
      coordinate: [poi.lat, poi.lng],
      isDestination: true,
    });
    setSelectedPOI(poi);
    onClose();
    setTimeout(() => {
      startNavigation(true);
    }, 300);
  };

  const quickPrompts = [
    { label: t('ai.promptRestaurant'), query: t('ai.promptRestaurant'), icon: <Coffee size={14} /> },
    { label: t('ai.promptEv'), query: t('ai.promptEv'), icon: <Zap size={14} /> },
    { label: t('ai.promptTraffic'), query: t('ai.promptTraffic'), icon: <Activity size={14} /> },
    { label: t('ai.promptScenic'), query: t('ai.promptScenic'), icon: <Compass size={14} /> },
  ];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '640px' }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={t('ai.title')}
      >
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="logo-badge" style={{ width: '38px', height: '38px' }}>
              <Bot size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{t('ai.title')}</h2>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                {t('ai.tagline')} ({languageMeta.nativeName})
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              className="btn-icon"
              onClick={() =>
                setMessages([
                  {
                    id: 'welcome-reset',
                    sender: 'assistant',
                    text: t('ai.welcomeMsg'),
                    timestamp: new Date(),
                  },
                ])
              }
              title={t('ai.clearChat')}
              aria-label={t('ai.clearChat')}
            >
              <Trash2 size={16} />
            </button>
            <button className="btn-icon" onClick={onClose} aria-label={t('common.close')}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Chat Body */}
        <div className="modal-body" style={{ padding: '12px' }}>
          <div className="chat-container">
            {/* Quick Prompts Carousel */}
            <div className="category-scroller" style={{ marginBottom: '10px' }}>
              {quickPrompts.map((p, idx) => (
                <button
                  key={idx}
                  className="category-chip"
                  onClick={() => handleSend(p.query)}
                  style={{ fontSize: '0.76rem' }}
                >
                  {p.icon}
                  <span>{p.label}</span>
                </button>
              ))}
            </div>

            {/* Messages */}
            <div className="chat-messages">
              {messages.map((msg) => (
                <div key={msg.id} className={`chat-bubble ${msg.sender}`}>
                  <div>{msg.text}</div>

                  {/* Render POI Cards if assistant returned them */}
                  {msg.poiResults && msg.poiResults.length > 0 && (
                    <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {msg.poiResults.map((poi) => (
                        <div
                          key={poi.id}
                          style={{
                            background: 'rgba(0,0,0,0.25)',
                            padding: '10px 12px',
                            borderRadius: '10px',
                            border: '1px solid var(--border-color)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.86rem' }}>{poi.name}</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                              ⭐ {poi.rating} • {poi.address}
                            </div>
                          </div>
                          <button
                            className="btn-pill primary"
                            style={{ padding: '6px 10px', fontSize: '0.76rem' }}
                            onClick={() => handleNavigateToPOI(poi)}
                          >
                            <Navigation size={12} />
                            <span>{t('nav.navigateNow')}</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {isThinking && (
                <div className="chat-bubble assistant" style={{ fontStyle: 'italic', opacity: 0.8 }}>
                  <Sparkles size={14} style={{ display: 'inline', marginInlineEnd: '6px' }} />
                  {t('ai.thinking')}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Row */}
            <div className="chat-input-row">
              <div className="search-input-wrapper" style={{ flex: 1 }}>
                <input
                  type="text"
                  className="search-input"
                  placeholder={t('ai.placeholder')}
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  id="ai-chat-input"
                />
                <button
                  className={`btn-icon ${isListening ? 'listening-pulse' : ''}`}
                  onClick={handleVoiceInput}
                  title={isListening ? t('voice.micListening') : t('ai.askVoice')}
                  style={{ width: '32px', height: '32px', borderRadius: '8px' }}
                >
                  <Mic size={16} />
                </button>
              </div>

              <button
                className="btn-pill primary"
                onClick={() => handleSend()}
                disabled={!inputQuery.trim() || isThinking}
                style={{ padding: '10px 16px' }}
                id="ai-send-btn"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
