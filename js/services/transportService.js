/**
 * BusTrack AI - Transport Service Layer
 * 
 * ARCHITECTURE NOTICE:
 * This service abstracts all public and private transportation API calls.
 * In a production environment with authorized transport APIs (e.g., State Transport
 * Corporations, private fleet APIs, GTFS-RT feeds), this module dispatches HTTP
 * requests to real backend endpoints.
 * 
 * CURRENT STATUS:
 * [Prototype Simulation / Demo Data]
 * Returns high-fidelity prototype transit data without breaking frontend UI.
 */

const TransportService = (() => {
  const isLive = () => window.API_CONFIG?.IS_REAL_TRANSPORT_API_CONNECTED || false;

  /**
   * Fetch all active buses / city transit routes
   */
  const getBuses = async (filters = {}) => {
    if (isLive()) {
      // Future Real Transport API Hook:
      // const res = await fetch(`${API_CONFIG.BASE_URL.TRANSPORT}/buses?${new URLSearchParams(filters)}`);
      // return await res.json();
    }

    // Prototype Simulation Data
    let buses = BusTrackData.getBuses();

    if (filters.type && filters.type !== 'all') {
      buses = buses.filter(b => b.type.toLowerCase() === filters.type.toLowerCase());
    }
    if (filters.from) {
      const fromLower = filters.from.toLowerCase();
      buses = buses.filter(b => b.from.toLowerCase().includes(fromLower) || b.routeName.toLowerCase().includes(fromLower));
    }
    if (filters.to) {
      const toLower = filters.to.toLowerCase();
      buses = buses.filter(b => b.to.toLowerCase().includes(toLower) || b.routeName.toLowerCase().includes(toLower));
    }
    if (filters.category && filters.category !== 'all') {
      buses = buses.filter(b => b.category.toLowerCase().includes(filters.category.toLowerCase()));
    }

    return buses;
  };

  /**
   * Fetch long-distance intercity fleet
   */
  const getLongDistanceBuses = async (filters = {}) => {
    if (isLive()) {
      // Future Real Transport API Hook
    }

    let buses = BusTrackData.getLongDistance();

    if (filters.type && filters.type !== 'all') {
      buses = buses.filter(b => b.type.toLowerCase() === filters.type.toLowerCase());
    }
    if (filters.from) {
      const fromLower = filters.from.toLowerCase();
      buses = buses.filter(b => b.from.toLowerCase().includes(fromLower) || b.routeName?.toLowerCase().includes(fromLower));
    }
    if (filters.to) {
      const toLower = filters.to.toLowerCase();
      buses = buses.filter(b => b.to.toLowerCase().includes(toLower) || b.routeName?.toLowerCase().includes(toLower));
    }

    return buses;
  };

  /**
   * Get single bus details by ID or Number
   */
  const getBusById = async (busId) => {
    if (isLive()) {
      // Future API: fetch(`${API_CONFIG.BASE_URL.TRANSPORT}/buses/${busId}`)
    }

    const all = [...BusTrackData.getBuses(), ...BusTrackData.getLongDistance()];
    return all.find(b => b.id === busId || b.number === busId || b.busNumber === busId) || null;
  };

  /**
   * Get all active transit routes
   */
  const getRoutes = async () => {
    if (isLive()) {
      // Future API: fetch(`${API_CONFIG.BASE_URL.TRANSPORT}/routes`)
    }

    // Extract unique routes from prototype dataset
    const buses = BusTrackData.getBuses();
    const routeMap = new Map();
    buses.forEach(b => {
      if (!routeMap.has(b.routeId)) {
        routeMap.set(b.routeId, {
          routeId: b.routeId,
          routeName: b.routeName,
          from: b.from,
          to: b.to,
          distanceKm: b.distanceKm,
          stopsCount: 5
        });
      }
    });

    return Array.from(routeMap.values());
  };

  /**
   * Get route stops / waypoints
   */
  const getBusStops = async (routeId) => {
    if (isLive()) {
      // Future API: fetch(`${API_CONFIG.BASE_URL.TRANSPORT}/routes/${routeId}/stops`)
    }

    return [
      { name: 'Gandhipuram Central', x: 0.15, y: 0.25, time: '10:30 AM' },
      { name: 'Lakshmi Mills Jn.', x: 0.38, y: 0.38, time: '10:38 AM' },
      { name: 'Nava India Hub', x: 0.58, y: 0.52, time: '10:45 AM' },
      { name: 'Peelamedu Tech Zone', x: 0.72, y: 0.68, time: '10:52 AM' },
      { name: 'Singanallur Hub', x: 0.85, y: 0.82, time: '11:00 AM' }
    ];
  };

  /**
   * Get active service alerts & transit notices
   */
  const getServiceAlerts = async () => {
    if (isLive()) {
      // Future API: fetch(`${API_CONFIG.BASE_URL.TRANSPORT}/alerts`)
    }

    return [
      {
        id: 'ALT-101',
        title: 'Route Diversion on Avinashi Road',
        severity: 'info',
        affectedRoutes: ['CHE-CBE-01', 'TNSTC-101'],
        message: 'Elevated corridor construction work active near Hope College. Expect +5 mins delay.',
        timestamp: 'Today, 08:00 AM'
      },
      {
        id: 'ALT-102',
        title: 'Festival Special Fleet Deployed',
        severity: 'success',
        affectedRoutes: ['CBE-MAD-01', 'SETC-201'],
        message: 'Additional government semi-sleeper buses operating on Southern corridors.',
        timestamp: 'Today, 06:30 AM'
      }
    ];
  };

  /**
   * Get all registered fleet operators (Government & Private)
   */
  const getOperators = async () => {
    return [
      { id: 'TNSTC', name: 'TNSTC Express', type: 'Government', fleetSize: 45, rating: 4.2 },
      { id: 'SETC', name: 'SETC Ultra Deluxe', type: 'Government', fleetSize: 28, rating: 4.4 },
      { id: 'PKR', name: 'PKR Travels', type: 'Private', fleetSize: 20, rating: 4.6 },
      { id: 'SRS', name: 'SRS Travels', type: 'Private', fleetSize: 32, rating: 4.5 },
      { id: 'KPN', name: 'KPN Speedlines', type: 'Private', fleetSize: 25, rating: 4.5 }
    ];
  };

  /**
   * Admin: Add or update bus in dataset
   */
  const saveBus = async (busData) => {
    const buses = BusTrackData.getBuses();
    const existingIndex = buses.findIndex(b => b.id === busData.id);
    if (existingIndex >= 0) {
      buses[existingIndex] = { ...buses[existingIndex], ...busData };
    } else {
      buses.unshift(busData);
    }
    BusTrackData.saveBuses(buses);
    return { success: true, bus: busData };
  };

  /**
   * Admin: Delete bus from dataset
   */
  const deleteBus = async (busId) => {
    let buses = BusTrackData.getBuses();
    buses = buses.filter(b => b.id !== busId);
    BusTrackData.saveBuses(buses);
    return { success: true };
  };

  return {
    getBuses,
    getLongDistanceBuses,
    getBusById,
    getRoutes,
    getBusStops,
    getServiceAlerts,
    getOperators,
    saveBus,
    deleteBus
  };
})();

// Export globally
window.TransportService = TransportService;
