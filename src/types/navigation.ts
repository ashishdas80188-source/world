export interface POI {
  id: string;
  name: string;
  nativeNames?: Record<string, string>;
  category: 'restaurant' | 'gas' | 'ev' | 'hotel' | 'hospital' | 'tourist' | 'transit' | 'parking' | 'cafe';
  lat: number;
  lng: number;
  address: string;
  rating: number;
  reviewsCount: number;
  priceLevel?: number; // 1 to 4 ($ to $$$$)
  openNow?: boolean;
  distanceMeters?: number;
  tags?: string[];
  phone?: string;
  estimatedTollCost?: number;
}

export interface RouteStep {
  instructionKey: string;
  fallbackText: string;
  streetName: string;
  distanceMeters: number;
  durationSeconds: number;
  icon: 'turn-left' | 'turn-right' | 'turn-slight-left' | 'turn-slight-right' | 'straight' | 'u-turn' | 'roundabout' | 'destination' | 'merge' | 'fork';
  coordinate: [number, number];
}

export interface RouteOption {
  id: string;
  name: string;
  type: 'fastest' | 'eco' | 'scenic' | 'toll_free';
  distanceMeters: number;
  durationSeconds: number;
  tollCostUSD: number; // baseline USD, converted via CurrencyService
  fuelEstimateLiters: number;
  co2SavingsKg?: number;
  trafficStatus: 'smooth' | 'moderate' | 'heavy';
  steps: RouteStep[];
  polyline: [number, number][];
}

export interface Waypoint {
  id: string;
  name: string;
  coordinate: [number, number];
  isOrigin?: boolean;
  isDestination?: boolean;
}
