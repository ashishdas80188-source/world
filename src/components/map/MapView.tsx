import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useNavigation } from '../../context/NavigationContext';
import { useSettings } from '../../context/SettingsContext';
import { Locate, Layers, ZoomIn, ZoomOut, Navigation as NavIcon } from 'lucide-react';

export const MapView: React.FC = () => {
  const {
    origin,
    destination,
    selectedRoute,
    isNavigating,
    isSimulating,
    currentStepIndex,
    searchResults,
    selectedPOI,
    setSelectedPOI,
    setDestination,
  } = useNavigation();

  const { preferences } = useSettings();

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const routeLayerRef = useRef<L.Polyline | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const vehicleMarkerRef = useRef<L.Marker | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const initialCenter = origin?.coordinate || [48.8566, 2.3522];
    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: 13,
      zoomControl: false,
    });

    mapInstanceRef.current = map;
    markersLayerRef.current = L.layerGroup().addTo(map);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Tile Layer based on theme
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }

    let tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}';
    let attribution = 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ';
    let maxZoom = 19;
    let subdomains = 'abc';

    if (preferences.mapTheme === 'light') {
      tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
      maxZoom = 19;
      subdomains = 'abc';
    } else if (preferences.mapTheme === 'satellite') {
      tileUrl =
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      attribution = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';
      maxZoom = 18;
      subdomains = 'abc';
    } else if (preferences.mapTheme === 'night_cyber') {
      tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}';
      attribution = 'Tiles &copy; Esri';
      maxZoom = 19;
      subdomains = 'abc';
    }

    const newTileLayer = L.tileLayer(tileUrl, {
      attribution,
      maxZoom,
      subdomains,
    }).addTo(mapInstanceRef.current);

    tileLayerRef.current = newTileLayer;
  }, [preferences.mapTheme]);

  // Update Markers (Origin, Destination, Search POIs)
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    // Custom Origin Icon
    const originIcon = L.divIcon({
      className: 'custom-map-icon',
      html: `<div style="width:20px;height:20px;border-radius:50%;background:#38bdf8;border:3px solid #ffffff;box-shadow:0 0 12px #38bdf8;"></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });

    // Custom Destination Icon
    const destIcon = L.divIcon({
      className: 'custom-map-icon',
      html: `<div style="width:28px;height:28px;border-radius:50%;background:#ef4444;border:3px solid #ffffff;box-shadow:0 0 15px #ef4444;display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;font-size:12px;">★</div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

    // Custom POI Icon
    const poiIcon = L.divIcon({
      className: 'custom-map-icon',
      html: `<div style="width:22px;height:22px;border-radius:6px;background:#818cf8;border:2px solid #ffffff;box-shadow:0 0 8px #818cf8;display:flex;align-items:center;justify-content:center;color:white;font-size:10px;">📍</div>`,
      iconSize: [22, 22],
      iconAnchor: [11, 11],
    });

    if (origin) {
      const originMarker = L.marker(origin.coordinate, { icon: originIcon }).bindPopup(
        `<b>${origin.name}</b><br/>Start Location`
      );
      markersLayerRef.current.addLayer(originMarker);
    }

    if (destination) {
      const destMarker = L.marker(destination.coordinate, { icon: destIcon }).bindPopup(
        `<b>${destination.name}</b><br/>Destination`
      );
      markersLayerRef.current.addLayer(destMarker);
    }

    // Add POIs
    searchResults.forEach((poi) => {
      if (
        (destination && poi.lat === destination.coordinate[0] && poi.lng === destination.coordinate[1]) ||
        (origin && poi.lat === origin.coordinate[0] && poi.lng === origin.coordinate[1])
      ) {
        return;
      }

      const marker = L.marker([poi.lat, poi.lng], { icon: poiIcon });
      marker.bindPopup(`
        <div style="font-family:inherit;min-width:140px;">
          <h4 style="font-weight:700;margin-bottom:4px;">${poi.name}</h4>
          <p style="font-size:11px;color:#666;">${poi.address}</p>
          <div style="margin-top:6px;display:flex;gap:4px;">
            <button id="nav-btn-${poi.id}" style="padding:4px 8px;background:#0ea5e9;color:white;border:none;border-radius:4px;cursor:pointer;font-size:11px;font-weight:600;">Navigate Here</button>
          </div>
        </div>
      `);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`nav-btn-${poi.id}`);
        if (btn) {
          btn.onclick = () => {
            setDestination({
              id: poi.id,
              name: poi.name,
              coordinate: [poi.lat, poi.lng],
              isDestination: true,
            });
            setSelectedPOI(poi);
          };
        }
      });

      markersLayerRef.current?.addLayer(marker);
    });
  }, [origin, destination, searchResults]);

  // Update Route Polyline
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (routeLayerRef.current) {
      mapInstanceRef.current.removeLayer(routeLayerRef.current);
      routeLayerRef.current = null;
    }

    if (selectedRoute && selectedRoute.polyline.length > 0) {
      const polylineColor =
        selectedRoute.type === 'eco'
          ? '#10b981'
          : selectedRoute.type === 'scenic'
          ? '#f59e0b'
          : '#38bdf8';

      const polyline = L.polyline(selectedRoute.polyline, {
        color: polylineColor,
        weight: 6,
        opacity: 0.85,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(mapInstanceRef.current);

      routeLayerRef.current = polyline;

      // Fit bounds
      mapInstanceRef.current.fitBounds(polyline.getBounds(), {
        padding: [60, 60],
        maxZoom: 16,
      });
    }
  }, [selectedRoute]);

  // Update Vehicle position during simulation
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (!isNavigating || !selectedRoute) {
      if (vehicleMarkerRef.current) {
        mapInstanceRef.current.removeLayer(vehicleMarkerRef.current);
        vehicleMarkerRef.current = null;
      }
      return;
    }

    const currentCoord =
      selectedRoute.polyline[currentStepIndex] ||
      selectedRoute.polyline[0] ||
      origin?.coordinate;

    if (!currentCoord) return;

    const vehicleIcon = L.divIcon({
      className: 'vehicle-nav-icon',
      html: `<div style="width:32px;height:32px;border-radius:50%;background:#00f2fe;border:3px solid #ffffff;box-shadow:0 0 20px #00f2fe;display:flex;align-items:center;justify-content:center;color:#090d16;"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/></svg></div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    if (!vehicleMarkerRef.current) {
      vehicleMarkerRef.current = L.marker(currentCoord, { icon: vehicleIcon }).addTo(
        mapInstanceRef.current
      );
    } else {
      vehicleMarkerRef.current.setLatLng(currentCoord);
    }

    if (isSimulating) {
      mapInstanceRef.current.panTo(currentCoord, { animate: true });
    }
  }, [isNavigating, isSimulating, currentStepIndex, selectedRoute]);

  const handleRecenter = () => {
    if (mapInstanceRef.current && origin) {
      mapInstanceRef.current.setView(origin.coordinate, 15, { animate: true });
    }
  };

  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  return (
    <div className="map-container" style={{ position: 'relative' }}>
      <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }} />

      {/* Floating Map Controls */}
      <div
        style={{
          position: 'absolute',
          bottom: '24px',
          insetInlineEnd: '20px',
          zIndex: 800,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <button
          className="btn-icon"
          onClick={handleRecenter}
          title="Recenter Map to Origin"
          aria-label="Recenter"
        >
          <Locate size={18} color="var(--accent-cyan)" />
        </button>
        <button
          className="btn-icon"
          onClick={handleZoomIn}
          title="Zoom In"
          aria-label="Zoom In"
        >
          <ZoomIn size={18} />
        </button>
        <button
          className="btn-icon"
          onClick={handleZoomOut}
          title="Zoom Out"
          aria-label="Zoom Out"
        >
          <ZoomOut size={18} />
        </button>
      </div>
    </div>
  );
};
