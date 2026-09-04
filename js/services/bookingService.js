/**
 * BusTrack AI - Booking Service Layer
 * 
 * ARCHITECTURE NOTICE:
 * This service abstracts seat reservations, transactional booking flows,
 * ticket cancellation, and e-ticket validation.
 * 
 * DATABASE MAPPING:
 * Maps directly to the 'bookings' table defined in DBSchema.
 * In production, requests will be handled by a secure transactional backend
 * (e.g. Node.js / Python FastAPI) with atomic database transactions and
 * PCI-compliant payment gateway callbacks.
 * 
 * CURRENT STATUS:
 * [Prototype Simulation / Demo Data]
 * Saves bookings to localStorage repository and generates QR e-tickets.
 */

const BookingService = (() => {
  const isLive = () => window.API_CONFIG?.IS_LIVE_BACKEND_CONNECTED || false;

  /**
   * Search available buses for booking
   */
  const searchBuses = async (params = {}) => {
    return await TransportService.getLongDistanceBuses(params);
  };

  /**
   * Get booked seats for a specific bus and travel date
   */
  const getOccupiedSeats = async (busId, travelDate) => {
    if (isLive()) {
      // Future API: fetch(`${API_CONFIG.BASE_URL.BOOKING}/occupied-seats?busId=${busId}&date=${travelDate}`)
    }

    const bookings = BusTrackData.getBookings();
    const active = bookings.filter(b => 
      (b.busNumber === busId || b.busId === busId) && 
      b.travelDate === travelDate && 
      b.status !== 'Cancelled'
    );

    const occupied = new Set();
    active.forEach(b => {
      (b.seats || []).forEach(s => occupied.add(s));
    });

    return Array.from(occupied);
  };

  /**
   * Create a new booking transaction
   */
  const createBooking = async (payload) => {
    if (isLive()) {
      // Future API: POST to /api/v1/bookings/create
    }

    const bookingId = 'BT-' + Math.floor(100000 + Math.random() * 900000);
    const newBooking = {
      bookingId,
      username: payload.username || 'passenger001',
      passengerName: payload.passengerName,
      email: payload.email,
      mobile: payload.mobile,
      phone: payload.mobile,
      from: payload.from,
      to: payload.to,
      busNumber: payload.busNumber,
      operator: payload.operator,
      busType: payload.busType,
      travelDate: payload.travelDate,
      departure: payload.departure,
      arrival: payload.arrival || 'On Schedule',
      seats: payload.seats || [],
      passengersCount: payload.seats?.length || 1,
      fare: payload.fare,
      status: 'Upcoming',
      paymentStatus: 'Demo Paid',
      bookedAt: new Date().toLocaleString()
    };

    const bookings = BusTrackData.getBookings();
    bookings.unshift(newBooking);
    BusTrackData.saveBookings(bookings);

    return {
      success: true,
      booking: newBooking,
      message: 'Booking confirmed (Prototype Simulation)'
    };
  };

  /**
   * Get bookings for the authenticated user
   */
  const getUserBookings = async (username) => {
    if (isLive()) {
      // Future API: GET /api/v1/bookings/user/:userId
    }

    const bookings = BusTrackData.getBookings();
    if (!username) return bookings;

    return bookings.filter(b => 
      !b.username || 
      b.username.toLowerCase() === username.toLowerCase() || 
      b.email?.toLowerCase() === username.toLowerCase()
    );
  };

  /**
   * Cancel an existing booking
   */
  const cancelBooking = async (bookingId) => {
    if (isLive()) {
      // Future API: POST /api/v1/bookings/cancel/:id
    }

    const bookings = BusTrackData.getBookings();
    const item = bookings.find(b => b.bookingId === bookingId);
    if (item) {
      item.status = 'Cancelled';
      BusTrackData.saveBookings(bookings);
      return { success: true, booking: item };
    }
    return { success: false, message: 'Booking not found' };
  };

  /**
   * Verify digital QR E-Ticket authenticity
   */
  const verifyETicket = async (bookingId) => {
    const bookings = BusTrackData.getBookings();
    const item = bookings.find(b => b.bookingId === bookingId);
    if (item) {
      return {
        valid: true,
        booking: item,
        status: item.status,
        verifiedAt: new Date().toISOString()
      };
    }
    return { valid: false, message: 'Invalid or expired ticket ID' };
  };

  return {
    searchBuses,
    getOccupiedSeats,
    createBooking,
    getUserBookings,
    cancelBooking,
    verifyETicket
  };
})();

// Export globally
window.BookingService = BookingService;
