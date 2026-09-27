import { RouteOption, RouteStep } from '../types/navigation';

export class RoutingService {
  public static calculateRoutes(
    start: [number, number],
    end: [number, number],
    originName: string = 'Origin',
    destinationName: string = 'Destination'
  ): RouteOption[] {
    const [startLat, startLng] = start;
    const [endLat, endLng] = end;

    // Euclidean approximate distance in meters
    const dLat = (endLat - startLat) * 111320;
    const dLng = (endLng - startLng) * (111320 * Math.cos((startLat * Math.PI) / 180));
    const directDist = Math.hypot(dLat, dLng);
    const baseDist = Math.max(1200, Math.round(directDist * 1.3));
    const baseDuration = Math.max(180, Math.round((baseDist / 13.88) * 1.2)); // avg 50km/h in seconds

    // Generate polyline steps
    const numPoints = 12;
    const polyline: [number, number][] = [];
    for (let i = 0; i <= numPoints; i++) {
      const t = i / numPoints;
      // Add a slight realistic curve
      const jitterLat = Math.sin(t * Math.PI) * 0.003;
      const jitterLng = Math.cos(t * Math.PI) * 0.002;
      polyline.push([startLat + (endLat - startLat) * t + jitterLat, startLng + (endLng - startLng) * t + jitterLng]);
    }

    const fastestSteps: RouteStep[] = [
      {
        instructionKey: 'nav.keepStraight',
        fallbackText: 'Continue straight onto Main Boulevard',
        streetName: 'Main Boulevard',
        distanceMeters: Math.round(baseDist * 0.2),
        durationSeconds: Math.round(baseDuration * 0.15),
        icon: 'straight',
        coordinate: polyline[1],
      },
      {
        instructionKey: 'nav.turnLeft',
        fallbackText: 'Turn left onto Grand Avenue Express',
        streetName: 'Grand Avenue Express',
        distanceMeters: Math.round(baseDist * 0.35),
        durationSeconds: Math.round(baseDuration * 0.3),
        icon: 'turn-left',
        coordinate: polyline[4],
      },
      {
        instructionKey: 'nav.turnRight',
        fallbackText: 'Turn right onto Central Highway',
        streetName: 'Central Highway',
        distanceMeters: Math.round(baseDist * 0.3),
        durationSeconds: Math.round(baseDuration * 0.35),
        icon: 'turn-right',
        coordinate: polyline[8],
      },
      {
        instructionKey: 'nav.arriveAtDestination',
        fallbackText: `Arrive at destination: ${destinationName}`,
        streetName: destinationName,
        distanceMeters: Math.round(baseDist * 0.15),
        durationSeconds: Math.round(baseDuration * 0.2),
        icon: 'destination',
        coordinate: polyline[polyline.length - 1],
      },
    ];

    const ecoSteps: RouteStep[] = [
      {
        instructionKey: 'nav.keepStraight',
        fallbackText: 'Continue along Green Parkway',
        streetName: 'Green Parkway',
        distanceMeters: Math.round(baseDist * 0.4),
        durationSeconds: Math.round(baseDuration * 0.35),
        icon: 'straight',
        coordinate: polyline[2],
      },
      {
        instructionKey: 'nav.turnSlightRight',
        fallbackText: 'Slight right onto Riverfront Eco Corridor',
        streetName: 'Riverfront Eco Corridor',
        distanceMeters: Math.round(baseDist * 0.4),
        durationSeconds: Math.round(baseDuration * 0.4),
        icon: 'turn-slight-right',
        coordinate: polyline[7],
      },
      {
        instructionKey: 'nav.arriveAtDestination',
        fallbackText: `Arrive at destination: ${destinationName}`,
        streetName: destinationName,
        distanceMeters: Math.round(baseDist * 0.2),
        durationSeconds: Math.round(baseDuration * 0.25),
        icon: 'destination',
        coordinate: polyline[polyline.length - 1],
      },
    ];

    const scenicSteps: RouteStep[] = [
      {
        instructionKey: 'nav.turnSlightLeft',
        fallbackText: 'Slight left onto Panoramic Hills Way',
        streetName: 'Panoramic Hills Way',
        distanceMeters: Math.round(baseDist * 0.5),
        durationSeconds: Math.round(baseDuration * 0.5),
        icon: 'turn-slight-left',
        coordinate: polyline[3],
      },
      {
        instructionKey: 'nav.keepStraight',
        fallbackText: 'Continue along Historic View Overlook',
        streetName: 'Historic View Overlook',
        distanceMeters: Math.round(baseDist * 0.4),
        durationSeconds: Math.round(baseDuration * 0.4),
        icon: 'straight',
        coordinate: polyline[8],
      },
      {
        instructionKey: 'nav.arriveAtDestination',
        fallbackText: `Arrive at destination: ${destinationName}`,
        streetName: destinationName,
        distanceMeters: Math.round(baseDist * 0.2),
        durationSeconds: Math.round(baseDuration * 0.2),
        icon: 'destination',
        coordinate: polyline[polyline.length - 1],
      },
    ];

    return [
      {
        id: 'route-fastest',
        name: 'Fastest Highway Route',
        type: 'fastest',
        distanceMeters: baseDist,
        durationSeconds: baseDuration,
        tollCostUSD: 4.5,
        fuelEstimateLiters: +(baseDist / 14000).toFixed(1),
        trafficStatus: 'smooth',
        steps: fastestSteps,
        polyline,
      },
      {
        id: 'route-eco',
        name: 'Eco Fuel & Energy Saver',
        type: 'eco',
        distanceMeters: Math.round(baseDist * 1.05),
        durationSeconds: Math.round(baseDuration * 1.1),
        tollCostUSD: 0,
        fuelEstimateLiters: +(baseDist / 19000).toFixed(1),
        co2SavingsKg: +(baseDist / 20000).toFixed(2),
        trafficStatus: 'smooth',
        steps: ecoSteps,
        polyline,
      },
      {
        id: 'route-scenic',
        name: 'Scenic & Landmarks',
        type: 'scenic',
        distanceMeters: Math.round(baseDist * 1.25),
        durationSeconds: Math.round(baseDuration * 1.3),
        tollCostUSD: 0,
        fuelEstimateLiters: +(baseDist / 13000).toFixed(1),
        trafficStatus: 'moderate',
        steps: scenicSteps,
        polyline,
      },
    ];
  }
}
