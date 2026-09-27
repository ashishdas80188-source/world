import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { POI, RouteOption, RouteStep, Waypoint } from '../types/navigation';
import { RoutingService } from '../services/routingService';
import { GLOBAL_POI_DATABASE, GeocodingService } from '../services/geocodingService';
import { VoiceService } from '../services/voiceService';
import { useTranslation } from './I18nContext';
import { useSettings } from './SettingsContext';
import confetti from 'canvas-confetti';

interface NavigationContextType {
  origin: Waypoint;
  destination: Waypoint | null;
  waypoints: Waypoint[];
  availableRoutes: RouteOption[];
  selectedRoute: RouteOption | null;
  isNavigating: boolean;
  isSimulating: boolean;
  currentStepIndex: number;
  currentStep: RouteStep | null;
  currentDistanceRemainingMeters: number;
  currentSpeedKmh: number;
  activeCategory: string;
  searchResults: POI[];
  selectedPOI: POI | null;
  setOrigin: (point: Waypoint) => void;
  setDestination: (point: Waypoint | null) => void;
  addWaypoint: (point: Waypoint) => void;
  removeWaypoint: (id: string) => void;
  selectRoute: (route: RouteOption) => void;
  startNavigation: (simulate?: boolean) => void;
  stopNavigation: () => void;
  setActiveCategory: (cat: string) => void;
  setSelectedPOI: (poi: POI | null) => void;
  searchPlaces: (query: string) => Promise<void>;
  speakCurrentInstruction: () => void;
}

const DEFAULT_ORIGIN: Waypoint = {
  id: 'origin-current',
  name: 'Current Location (Paris City Center)',
  coordinate: [48.8566, 2.3522],
  isOrigin: true,
};

const NavigationContext = createContext<NavigationContextType | null>(null);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t, languageMeta } = useTranslation();
  const { preferences } = useSettings();

  const [origin, setOriginState] = useState<Waypoint>(DEFAULT_ORIGIN);
  const [destination, setDestinationState] = useState<Waypoint | null>({
    id: 'poi-eiffel-tower',
    name: 'Eiffel Tower, Paris',
    coordinate: [48.85837, 2.294481],
    isDestination: true,
  });
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [availableRoutes, setAvailableRoutes] = useState<RouteOption[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<RouteOption | null>(null);

  const [isNavigating, setIsNavigating] = useState<boolean>(false);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [currentDistanceRemainingMeters, setCurrentDistanceRemainingMeters] = useState<number>(0);
  const [currentSpeedKmh, setCurrentSpeedKmh] = useState<number>(0);

  const [activeCategory, setActiveCategoryState] = useState<string>('all');
  const [searchResults, setSearchResults] = useState<POI[]>(GLOBAL_POI_DATABASE);
  const [selectedPOI, setSelectedPOI] = useState<POI | null>(null);

  const simIntervalRef = useRef<any>(null);

  // Recalculate routes whenever origin or destination changes
  useEffect(() => {
    if (origin && destination) {
      const routes = RoutingService.calculateRoutes(
        origin.coordinate,
        destination.coordinate,
        origin.name,
        destination.name
      );
      setAvailableRoutes(routes);
      setSelectedRoute(routes[0] || null);
    } else {
      setAvailableRoutes([]);
      setSelectedRoute(null);
    }
  }, [origin, destination]);

  const searchPlaces = async (query: string) => {
    const results = await GeocodingService.searchPlaces(query, activeCategory);
    setSearchResults(results);
  };

  const setActiveCategory = async (cat: string) => {
    setActiveCategoryState(cat);
    const results = await GeocodingService.searchPlaces('', cat);
    setSearchResults(results);
  };

  const setOrigin = (point: Waypoint) => {
    setOriginState(point);
  };

  const setDestination = (point: Waypoint | null) => {
    setDestinationState(point);
    if (isNavigating) {
      stopNavigation();
    }
  };

  const addWaypoint = (point: Waypoint) => {
    setWaypoints((prev) => [...prev, point]);
  };

  const removeWaypoint = (id: string) => {
    setWaypoints((prev) => prev.filter((w) => w.id !== id));
  };

  const selectRoute = (route: RouteOption) => {
    setSelectedRoute(route);
  };

  const currentStep =
    selectedRoute && selectedRoute.steps[currentStepIndex]
      ? selectedRoute.steps[currentStepIndex]
      : null;

  const speakCurrentInstruction = () => {
    if (!currentStep || !preferences.voice.enabled) return;
    const translatedInstruction = t(currentStep.instructionKey, {
      street: currentStep.streetName,
      destination: destination?.name || '',
      exit: 2,
    });
    const speechText = `${translatedInstruction}. ${t('nav.inMeters', {
      count: currentDistanceRemainingMeters || currentStep.distanceMeters,
    })}`;

    const voiceLang =
      preferences.voiceLanguage === 'match_app'
        ? languageMeta.bcp47
        : preferences.voiceLanguage;

    VoiceService.speak(speechText, preferences.voice, voiceLang).catch(() => {});
  };

  const startNavigation = (simulate: boolean = true) => {
    if (!selectedRoute) return;
    setIsNavigating(true);
    setIsSimulating(simulate);
    setCurrentStepIndex(0);
    setCurrentDistanceRemainingMeters(selectedRoute.steps[0]?.distanceMeters || 300);
    setCurrentSpeedKmh(simulate ? 48 : 0);

    // Initial announcement
    setTimeout(() => {
      speakCurrentInstruction();
    }, 400);

    if (simulate) {
      if (simIntervalRef.current) clearInterval(simIntervalRef.current);
      let stepIdx = 0;
      let distRemaining = selectedRoute.steps[0]?.distanceMeters || 300;

      simIntervalRef.current = setInterval(() => {
        distRemaining -= 40;

        if (distRemaining <= 0) {
          stepIdx += 1;
          if (stepIdx >= selectedRoute.steps.length) {
            // Reached destination!
            clearInterval(simIntervalRef.current);
            setIsNavigating(false);
            setIsSimulating(false);
            setCurrentSpeedKmh(0);
            try {
              confetti({
                particleCount: 120,
                spread: 70,
                origin: { y: 0.6 },
              });
            } catch {}
            VoiceService.speak(
              t('nav.destinationReached'),
              preferences.voice,
              languageMeta.bcp47
            ).catch(() => {});
            return;
          }
          const nextStep = selectedRoute.steps[stepIdx];
          distRemaining = nextStep.distanceMeters;
          setCurrentStepIndex(stepIdx);
          setCurrentDistanceRemainingMeters(distRemaining);

          // Announce next turn
          if (preferences.voice.autoAnnounce) {
            const nextInstruction = t(nextStep.instructionKey, {
              street: nextStep.streetName,
              destination: destination?.name || '',
              exit: 2,
            });
            VoiceService.speak(
              nextInstruction,
              preferences.voice,
              languageMeta.bcp47
            ).catch(() => {});
          }
        } else {
          setCurrentDistanceRemainingMeters(distRemaining);
          setCurrentSpeedKmh(Math.floor(45 + Math.random() * 8));
        }
      }, 1500);
    }
  };

  const stopNavigation = () => {
    if (simIntervalRef.current) {
      clearInterval(simIntervalRef.current);
      simIntervalRef.current = null;
    }
    setIsNavigating(false);
    setIsSimulating(false);
    setCurrentStepIndex(0);
    setCurrentSpeedKmh(0);
    VoiceService.stopSpeaking();
  };

  useEffect(() => {
    return () => {
      if (simIntervalRef.current) clearInterval(simIntervalRef.current);
    };
  }, []);

  return (
    <NavigationContext.Provider
      value={{
        origin,
        destination,
        waypoints,
        availableRoutes,
        selectedRoute,
        isNavigating,
        isSimulating,
        currentStepIndex,
        currentStep,
        currentDistanceRemainingMeters,
        currentSpeedKmh,
        activeCategory,
        searchResults,
        selectedPOI,
        setOrigin,
        setDestination,
        addWaypoint,
        removeWaypoint,
        selectRoute,
        startNavigation,
        stopNavigation,
        setActiveCategory,
        setSelectedPOI,
        searchPlaces,
        speakCurrentInstruction,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};
