import React, { useState } from 'react';
import { I18nProvider, useTranslation } from './context/I18nContext';
import { SettingsProvider, useSettings } from './context/SettingsContext';
import { NavigationProvider, useNavigation } from './context/NavigationContext';
import { Header } from './components/header/Header';
import { MapView } from './components/map/MapView';
import { SearchPanel } from './components/navigation/SearchPanel';
import { TurnByTurnHUD } from './components/navigation/TurnByTurnHUD';
import { AIAssistantModal } from './components/ai/AIAssistantModal';
import { SettingsDrawer } from './components/settings/SettingsDrawer';
import { ProfileModal } from './components/header/ProfileModal';
import { LanguageSelectorModal } from './components/header/LanguageSelectorModal';

const MainAppContent: React.FC = () => {
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);

  const { isNavigating } = useNavigation();

  return (
    <div className="navia-app">
      {/* Top Global Header */}
      <Header
        onOpenAI={() => setIsAIOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* Main Map & Navigation HUD Workspace */}
      <main className="main-viewport" role="main">
        {/* Interactive Global Leaflet Map */}
        <MapView />

        {/* Floating HUD Navigation Overlay */}
        <div className="hud-overlay">
          {/* Active Turn-by-Turn Guidance HUD */}
          {isNavigating && <TurnByTurnHUD />}

          {/* Place Search, Categories & Route Selector */}
          <SearchPanel />
        </div>
      </main>

      {/* AI Assistant Modal */}
      <AIAssistantModal
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
      />

      {/* Settings & Localization Drawer */}
      <SettingsDrawer
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* User Profile & Sync Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onOpenLanguageSelector={() => setIsLanguageModalOpen(true)}
      />

      {/* Direct Language Selector Modal */}
      <LanguageSelectorModal
        isOpen={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
      />
    </div>
  );
};

export function App() {
  return (
    <I18nProvider>
      <SettingsProvider>
        <NavigationProvider>
          <MainAppContent />
        </NavigationProvider>
      </SettingsProvider>
    </I18nProvider>
  );
}

export default App;
