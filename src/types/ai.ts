import { POI, RouteOption } from './navigation';

export interface QuickAction {
  labelKey: string;
  defaultLabel: string;
  action: 'search_category' | 'plan_route' | 'toggle_traffic' | 'weather_route' | 'emergency' | 'change_lang' | 'clear_route';
  payload?: any;
  iconName?: string;
}

export interface AIMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: Date;
  detectedLang?: string;
  quickActions?: QuickAction[];
  poiResults?: POI[];
  routeResult?: RouteOption;
  isStreaming?: boolean;
}
