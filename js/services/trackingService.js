/**
 * BusTrack AI - Telematics & Live Tracking Service Layer
 * 
 * ARCHITECTURE NOTICE:
 * This service abstracts real-time bus GPS telematics and waypoint interpolation.
 * 
 * In production:
 * - Listens to real IoT GPS hardware feeds via WebSockets (WSS) / Server-Sent Events (SSE).
 * - Dispatches geofencing events, waypoint arrival triggers, and speed alarms.
 * 
 * CURRENT STATUS:
 * [Prototype Simulation / Demo Data]
 * Provides smooth canvas-based route interpolation and telemetry HUD metrics.
 */

const TrackingService = (() => {
  const isLive = () => window.API_CONFIG?.IS_REAL_TRANSPORT_API_CONNECTED || false;

  // Active tracking listeners
  const subscribers = new Map();

  /**
   * Fetch current GPS coordinate and speed of a bus
   */
  const getLiveBusLocation = async (busId) => {
    if (isLive()) {
      // Future Real GPS API: fetch(`${API_CONFIG.BASE_URL.TRACKING}/gps/${busId}`)
    }

    const bus = await TransportService.getBusById(busId);
    if (!bus) return null;

    return {
      busId: bus.id,
      busNumber: bus.number || bus.busNumber,
      lat: bus.lat || 11.0168,
      lng: bus.lng || 76.9558,
      speedKm: bus.speedKm || 35,
      status: bus.status || 'On Time',
      crowd: bus.crowd || 'Medium',
      mode: 'Prototype Simulation'
    };
  };

  /**
   * Get waypoints and stop coordinates for a route
   */
  const getRouteWaypoints = async (routeId = 'CHE-CBE-01') => {
    return [
      { name: 'Gandhipuram Central', x: 0.15, y: 0.25, time: '10:30 AM', lat: 11.0168, lng: 76.9678 },
      { name: 'Lakshmi Mills Jn.', x: 0.38, y: 0.38, time: '10:38 AM', lat: 11.0125, lng: 76.9840 },
      { name: 'Nava India Hub', x: 0.58, y: 0.52, time: '10:45 AM', lat: 11.0200, lng: 77.0010 },
      { name: 'Peelamedu Tech Zone', x: 0.72, y: 0.68, time: '10:52 AM', lat: 11.0280, lng: 77.0250 },
      { name: 'Singanallur Hub', x: 0.85, y: 0.82, time: '11:00 AM', lat: 10.9980, lng: 77.0320 }
    ];
  };

  /**
   * Calculate interpolated position along route (t: 0.0 to 1.0)
   */
  const interpolatePosition = (waypoints, t, containerWidth, containerHeight) => {
    const segCount = waypoints.length - 1;
    const segIndex = Math.min(Math.floor(t * segCount), segCount - 1);
    const segT = (t * segCount) - segIndex;

    const p0 = waypoints[segIndex];
    const p1 = waypoints[segIndex + 1];

    return {
      x: (p0.x + (p1.x - p0.x) * segT) * containerWidth,
      y: (p0.y + (p1.y - p0.y) * segT) * containerHeight,
      stopIndex: segIndex,
      currentStop: p0,
      nextStop: p1
    };
  };

  /**
   * Subscribe to live tracking stream
   */
  const subscribeLiveTracking = (busId, callback) => {
    if (!subscribers.has(busId)) {
      subscribers.set(busId, new Set());
    }
    subscribers.get(busId).add(callback);

    // Return unsubscribe function
    return () => {
      const list = subscribers.get(busId);
      if (list) {
        list.delete(callback);
        if (list.size === 0) subscribers.delete(busId);
      }
    };
  };

  return {
    getLiveBusLocation,
    getRouteWaypoints,
    interpolatePosition,
    subscribeLiveTracking
  };
})();

// Export globally
window.TrackingService = TrackingService;
