/**
 * BusTrack AI - API Configuration & Integration Points
 * 
 * ARCHITECTURE NOTICE:
 * This configuration file establishes the client-side gateway constants and 
 * integration endpoints for future backend REST APIs, WebSocket GPS streams, 
 * secure auth servers, and AI/ML prediction microservices.
 * 
 * SECURITY BEST PRACTICE:
 * NEVER store production secret keys, private database passwords, or service-role 
 * credentials in client-side code. All sensitive credentials belong strictly in 
 * server-side environment variables (.env / Key Vaults).
 */

const API_CONFIG = Object.freeze({
  // Environment Mode: 'prototype' | 'development' | 'production'
  ENV: 'prototype',

  // Flag indicating if live backend connection is established
  IS_LIVE_BACKEND_CONNECTED: false,

  // Flag indicating if authorized transport APIs are active
  IS_REAL_TRANSPORT_API_CONNECTED: false,

  // Flag indicating if a trained ML/NLP backend model is serving predictions
  IS_TRAINED_AI_MODEL_CONNECTED: false,

  // Base URLs for future backend microservices
  BASE_URL: {
    AUTH: 'https://api.bustrack.ai/v1/auth',             // Future Secure Auth (OAuth2 / JWT)
    TRANSPORT: 'https://api.bustrack.ai/v1/transport',   // Future Authorized Transport API Gateway
    BOOKING: 'https://api.bustrack.ai/v1/bookings',      // Future Transactional Database Backend
    TRACKING: 'wss://telematics.bustrack.ai/v1/gps',     // Future WebSocket Telematics Feed
    AI: 'https://ai.bustrack.ai/v1/models',              // Future Trained ML/NLP Inference API
    PAYMENTS: 'https://api.bustrack.ai/v1/payments'      // Future PCI-DSS Payment Gateway
  },

  // REST API Endpoints Map
  ENDPOINTS: {
    // Transport & Routes
    BUSES: '/buses',
    BUS_DETAILS: '/buses/:id',
    ROUTES: '/routes',
    SCHEDULES: '/schedules',
    STOPS: '/stops',
    ALERTS: '/service-alerts',
    OPERATORS: '/operators',

    // Bookings & Inventory
    SEARCH_BUSES: '/search',
    SEAT_LAYOUT: '/seats/:busId',
    CREATE_BOOKING: '/book',
    USER_BOOKINGS: '/user/:userId',
    CANCEL_BOOKING: '/cancel/:bookingId',
    VERIFY_TICKET: '/verify-ticket/:ticketId',

    // GPS Telematics
    LIVE_GPS: '/gps/:busId',
    FLEET_LOCATIONS: '/gps/fleet',
    ROUTE_WAYPOINTS: '/waypoints/:routeId',

    // AI & ML Services
    PREDICT_ETA: '/predict/eta',
    PREDICT_CROWD: '/predict/crowd',
    ANALYZE_FEEDBACK: '/nlp/sentiment',
    CLASSIFY_ISSUE: '/nlp/classify',
    TRANSPORT_INSIGHTS: '/analytics/insights'
  },

  // HTTP Request Helper with Prototype Simulation Fallback
  async request(endpoint, options = {}, fallbackData = null) {
    if (!this.IS_LIVE_BACKEND_CONNECTED) {
      // Prototype Simulation Mode: Return local prototype data
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            status: 'prototype_simulation',
            source: 'Prototype Data Repository',
            data: typeof fallbackData === 'function' ? fallbackData() : fallbackData
          });
        }, options.simulatedDelay || 120);
      });
    }

    // Future Real API Fetch implementation
    try {
      const token = sessionStorage.getItem('btai_auth_token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...(options.headers || {})
      };

      const response = await fetch(`${this.BASE_URL.TRANSPORT}${endpoint}`, {
        ...options,
        headers
      });

      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.warn(`[APIConfig] Backend call to ${endpoint} failed. Falling back to prototype simulation.`, error);
      return {
        success: false,
        status: 'fallback_prototype',
        error: error.message,
        data: typeof fallbackData === 'function' ? fallbackData() : fallbackData
      };
    }
  }
});

// Export globally
window.API_CONFIG = API_CONFIG;
