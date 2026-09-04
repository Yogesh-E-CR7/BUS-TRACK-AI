/**
 * BusTrack AI - Database Schema Definition & Entity Models
 * 
 * ARCHITECTURE NOTICE:
 * This file defines the structured relational data models and validation contracts 
 * for future database integration (PostgreSQL / MySQL / Supabase / MongoDB).
 * 
 * Future Database Schema:
 * 1. PASSENGERS
 * 2. DRIVERS
 * 3. BUSES
 * 4. ROUTES
 * 5. BOOKINGS
 * 6. TRIPS
 * 7. FEEDBACK
 * 
 * NOTE: In this prototype version, entities are validated client-side and saved to 
 * localStorage. When a real backend is connected, these schemas directly map to 
 * SQL tables or ORM models (e.g. Prisma / TypeORM / SQLAlchemy).
 */

const DBSchema = Object.freeze({
  /**
   * Entity: PASSENGERS
   * Primary Key: passenger_id (UUID / Serial)
   */
  Passenger: {
    tableName: 'passengers',
    fields: {
      passenger_id: { type: 'String/UUID', primaryKey: true, required: true },
      name: { type: 'String', required: true },
      email: { type: 'String', unique: true, required: true },
      mobile: { type: 'String', required: true, format: '+91 XXXXX XXXXX' },
      password_hash: { type: 'String', required: true, note: 'Stored strictly on backend server' },
      preferred_language: { type: 'String', default: 'en' },
      created_at: { type: 'Timestamp', default: 'CURRENT_TIMESTAMP' },
      updated_at: { type: 'Timestamp', default: 'CURRENT_TIMESTAMP' }
    }
  },

  /**
   * Entity: DRIVERS
   * Primary Key: driver_id (UUID / Serial)
   */
  Driver: {
    tableName: 'drivers',
    fields: {
      driver_id: { type: 'String/UUID', primaryKey: true, required: true },
      name: { type: 'String', required: true },
      license_number: { type: 'String', unique: true, required: true },
      assigned_bus: { type: 'String', foreignKey: 'buses.bus_id' },
      route: { type: 'String', foreignKey: 'routes.route_id' },
      status: { type: 'String', enum: ['On Duty', 'Resting', 'Off Duty'], default: 'On Duty' },
      phone: { type: 'String', required: true },
      created_at: { type: 'Timestamp', default: 'CURRENT_TIMESTAMP' }
    }
  },

  /**
   * Entity: BUSES
   * Primary Key: bus_id (UUID / Serial)
   */
  Bus: {
    tableName: 'buses',
    fields: {
      bus_id: { type: 'String/UUID', primaryKey: true, required: true },
      bus_number: { type: 'String', unique: true, required: true },
      operator_type: { type: 'String', enum: ['Government', 'Private'], required: true },
      bus_type: { type: 'String', required: true }, // e.g. Ultra Deluxe, Non-AC Seater, AC Sleeper
      route: { type: 'String', foreignKey: 'routes.route_id', required: true },
      capacity: { type: 'Integer', default: 40, required: true },
      amenities: { type: 'Array<String>', default: [] },
      fare: { type: 'Numeric(10,2)', required: true },
      status: { type: 'String', enum: ['On Time', 'Approaching', 'Delayed', 'Maintenance'], default: 'On Time' },
      created_at: { type: 'Timestamp', default: 'CURRENT_TIMESTAMP' }
    }
  },

  /**
   * Entity: ROUTES
   * Primary Key: route_id (UUID / Serial)
   */
  Route: {
    tableName: 'routes',
    fields: {
      route_id: { type: 'String/UUID', primaryKey: true, required: true },
      source: { type: 'String', required: true },
      destination: { type: 'String', required: true },
      distance_km: { type: 'Numeric(6,2)', required: true },
      stops: { type: 'JSON/Array<Object>', required: true }, // [{ name, lat, lng, time }]
      schedule: { type: 'JSON/Array<String>', required: true }, // ['06:00 AM', '08:30 AM', ...]
      created_at: { type: 'Timestamp', default: 'CURRENT_TIMESTAMP' }
    }
  },

  /**
   * Entity: BOOKINGS
   * Primary Key: booking_id (UUID / Serial)
   */
  Booking: {
    tableName: 'bookings',
    fields: {
      booking_id: { type: 'String/UUID', primaryKey: true, required: true },
      passenger_id: { type: 'String', foreignKey: 'passengers.passenger_id', required: true },
      bus_id: { type: 'String', foreignKey: 'buses.bus_id', required: true },
      travel_date: { type: 'Date', required: true },
      seats: { type: 'Array<String>', required: true }, // ['1A', '1B']
      fare: { type: 'Numeric(10,2)', required: true },
      booking_status: { type: 'String', enum: ['Confirmed', 'Upcoming', 'Cancelled', 'Completed'], default: 'Upcoming' },
      payment_status: { type: 'String', enum: ['Demo Paid', 'Pending', 'Failed', 'Refunded'], default: 'Demo Paid' },
      created_at: { type: 'Timestamp', default: 'CURRENT_TIMESTAMP' }
    }
  },

  /**
   * Entity: TRIPS
   * Primary Key: trip_id (UUID / Serial)
   */
  Trip: {
    tableName: 'trips',
    fields: {
      trip_id: { type: 'String/UUID', primaryKey: true, required: true },
      bus_id: { type: 'String', foreignKey: 'buses.bus_id', required: true },
      route_id: { type: 'String', foreignKey: 'routes.route_id', required: true },
      start_time: { type: 'Timestamp', required: true },
      end_time: { type: 'Timestamp' },
      gps_latitude: { type: 'Numeric(10,7)' },
      gps_longitude: { type: 'Numeric(10,7)' },
      current_speed_kmh: { type: 'Numeric(5,2)' },
      trip_status: { type: 'String', enum: ['Scheduled', 'In Transit', 'Completed', 'Cancelled'], default: 'Scheduled' }
    }
  },

  /**
   * Entity: FEEDBACK
   * Primary Key: feedback_id (UUID / Serial)
   */
  Feedback: {
    tableName: 'feedback',
    fields: {
      feedback_id: { type: 'String/UUID', primaryKey: true, required: true },
      passenger_id: { type: 'String', foreignKey: 'passengers.passenger_id', required: true },
      trip_id: { type: 'String', foreignKey: 'trips.trip_id' },
      bus_id: { type: 'String', foreignKey: 'buses.bus_id' },
      rating: { type: 'Integer', min: 1, max: 5, required: true },
      feedback_text: { type: 'Text', required: true },
      sentiment: { type: 'String', enum: ['Positive', 'Neutral', 'Negative'] },
      detected_issue: { type: 'String' },
      suggested_action: { type: 'Text' },
      created_at: { type: 'Timestamp', default: 'CURRENT_TIMESTAMP' }
    }
  }
});

// Export globally
window.DBSchema = DBSchema;
