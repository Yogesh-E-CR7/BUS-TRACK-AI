/**
 * BusTrack AI - Master Application Controller (Cross-Platform + PWA Edition)
 * Handles Demo Data Seeding, Animated Transit Canvas Background,
 * Floating AI Travel Assistant, Notification System, PWA Service Worker & Install Flow.
 */

// ==========================================================================
// 1. Central Data Repository & Demo Seeder
// ==========================================================================
const BusTrackData = (() => {
  const SEED_VERSION = 'btai_v1.3';

  const SEED_BUSES = [
    // -------------------------------------------------------------
    // Route: Chennai ↔ Coimbatore (Full Day Schedule)
    // -------------------------------------------------------------
    {
      id: 'TNSTC-101',
      number: 'TNSTC 101',
      operator: 'TNSTC Express (Government)',
      type: 'Government',
      category: 'Non-AC Deluxe Seater',
      routeId: 'CHE-CBE-01',
      routeName: 'Chennai → Coimbatore',
      from: 'Chennai',
      to: 'Coimbatore',
      departure: '06:00 AM',
      arrival: '12:00 PM',
      duration: '6h 00m',
      distanceKm: 505,
      fare: 320,
      price: 320,
      totalSeats: 48,
      availableSeats: 26,
      speedKm: 65,
      status: 'On Time',
      crowd: 'Medium',
      rating: 4.2,
      lat: 13.0827,
      lng: 80.2707,
      driver: 'K. Rajendran',
      amenities: ['💺 Seater', '🥤 Water Bottle', '🔌 Charging Points']
    },
    {
      id: 'SETC-201',
      number: 'SETC 201',
      operator: 'SETC Ultra Deluxe (Government)',
      type: 'Government',
      category: 'Ultra Deluxe Semi-Sleeper',
      routeId: 'CHE-CBE-02',
      routeName: 'Chennai → Coimbatore',
      from: 'Chennai',
      to: 'Coimbatore',
      departure: '08:30 AM',
      arrival: '02:30 PM',
      duration: '6h 00m',
      distanceKm: 505,
      fare: 350,
      price: 350,
      totalSeats: 40,
      availableSeats: 18,
      speedKm: 68,
      status: 'On Time',
      crowd: 'Low',
      rating: 4.4,
      lat: 12.9800,
      lng: 79.9200,
      driver: 'S. Manikandan',
      amenities: ['💺 Recliner', '🔌 Charging Points', '🥤 Water Bottle']
    },
    {
      id: 'PKR-301',
      number: 'PKR Express',
      operator: 'PKR Travels (Private)',
      type: 'Private',
      category: 'AC Semi-Sleeper Seater',
      routeId: 'CHE-CBE-03',
      routeName: 'Chennai → Coimbatore',
      from: 'Chennai',
      to: 'Coimbatore',
      departure: '10:00 AM',
      arrival: '04:00 PM',
      duration: '6h 00m',
      distanceKm: 505,
      fare: 480,
      price: 480,
      totalSeats: 36,
      availableSeats: 12,
      speedKm: 70,
      status: 'Approaching',
      crowd: 'Low',
      rating: 4.6,
      lat: 12.5000,
      lng: 79.2000,
      driver: 'M. Senthil',
      amenities: ['❄️ AC', '🔌 USB Port', '📶 Free Wi-Fi', '🥤 Snacks']
    },
    {
      id: 'TNSTC-305',
      number: 'TNSTC 305',
      operator: 'TNSTC Express (Government)',
      type: 'Government',
      category: 'Non-AC Deluxe Seater',
      routeId: 'CHE-CBE-04',
      routeName: 'Chennai → Coimbatore',
      from: 'Chennai',
      to: 'Coimbatore',
      departure: '01:00 PM',
      arrival: '07:00 PM',
      duration: '6h 00m',
      distanceKm: 505,
      fare: 320,
      price: 320,
      totalSeats: 48,
      availableSeats: 30,
      speedKm: 64,
      status: 'On Time',
      crowd: 'High',
      rating: 4.1,
      lat: 12.0000,
      lng: 78.5000,
      driver: 'V. Murugesan',
      amenities: ['💺 Seater', '🥤 Water Bottle']
    },
    {
      id: 'SRS-402',
      number: 'SRS Travels',
      operator: 'SRS Travels (Private)',
      type: 'Private',
      category: 'Multi-Axle AC Sleeper',
      routeId: 'CHE-CBE-05',
      routeName: 'Chennai → Coimbatore',
      from: 'Chennai',
      to: 'Coimbatore',
      departure: '03:30 PM',
      arrival: '09:30 PM',
      duration: '6h 00m',
      distanceKm: 505,
      fare: 520,
      price: 520,
      totalSeats: 32,
      availableSeats: 15,
      speedKm: 72,
      status: 'On Time',
      crowd: 'Medium',
      rating: 4.5,
      lat: 11.6643,
      lng: 78.1460,
      driver: 'N. Ravichandran',
      amenities: ['❄️ AC', '🛏️ Sleeper', '🔌 Charging', '📶 Wi-Fi']
    },
    {
      id: 'XYZ-501',
      number: 'XYZ Travels',
      operator: 'XYZ Luxury Lines (Private)',
      type: 'Private',
      category: 'Volvo Multi-Axle AC Sleeper',
      routeId: 'CHE-CBE-06',
      routeName: 'Chennai → Coimbatore',
      from: 'Chennai',
      to: 'Coimbatore',
      departure: '06:30 PM',
      arrival: '12:30 AM',
      duration: '6h 00m',
      distanceKm: 505,
      fare: 550,
      price: 550,
      totalSeats: 30,
      availableSeats: 9,
      speedKm: 75,
      status: 'On Time',
      crowd: 'Low',
      rating: 4.7,
      lat: 11.3410,
      lng: 77.7172,
      driver: 'P. Anand',
      amenities: ['❄️ AC', '🛏️ Luxury Sleeper', '🚻 Restroom', '📶 Wi-Fi', '🥤 Refreshments']
    },
    {
      id: 'SETC-608',
      number: 'SETC 608',
      operator: 'SETC AC Sleeper (Government)',
      type: 'Government',
      category: 'AC Sleeper Service',
      routeId: 'CHE-CBE-07',
      routeName: 'Chennai → Coimbatore',
      from: 'Chennai',
      to: 'Coimbatore',
      departure: '08:00 PM',
      arrival: '02:00 AM',
      duration: '6h 00m',
      distanceKm: 505,
      fare: 650,
      price: 650,
      totalSeats: 36,
      availableSeats: 14,
      speedKm: 68,
      status: 'On Time',
      crowd: 'Medium',
      rating: 4.4,
      lat: 11.0168,
      lng: 76.9558,
      driver: 'T. Dharmaraj',
      amenities: ['❄️ AC', '🛏️ Sleeper Berth', '🔌 Charging', '🥤 Water']
    },
    {
      id: 'KPN-702',
      number: 'KPN Express',
      operator: 'KPN Travels (Private)',
      type: 'Private',
      category: 'Scania Multi-Axle AC Sleeper',
      routeId: 'CHE-CBE-08',
      routeName: 'Chennai → Coimbatore',
      from: 'Chennai',
      to: 'Coimbatore',
      departure: '10:00 PM',
      arrival: '04:30 AM',
      duration: '6h 30m',
      distanceKm: 505,
      fare: 890,
      price: 890,
      totalSeats: 30,
      availableSeats: 6,
      speedKm: 74,
      status: 'On Time',
      crowd: 'Low',
      rating: 4.8,
      lat: 13.0827,
      lng: 80.2707,
      driver: 'K. Balaji',
      amenities: ['❄️ AC', '🛏️ Premium Bedding', '🚻 Restroom', '📶 5G Wi-Fi', '🥤 Midnight Snack']
    },
    {
      id: 'TNSTC-812',
      number: 'TNSTC 812',
      operator: 'TNSTC Super Deluxe (Government)',
      type: 'Government',
      category: 'Super Deluxe Seater',
      routeId: 'CHE-CBE-09',
      routeName: 'Chennai → Coimbatore',
      from: 'Chennai',
      to: 'Coimbatore',
      departure: '11:15 PM',
      arrival: '05:45 AM',
      duration: '6h 30m',
      distanceKm: 505,
      fare: 390,
      price: 390,
      totalSeats: 44,
      availableSeats: 22,
      speedKm: 65,
      status: 'On Time',
      crowd: 'Medium',
      rating: 4.1,
      lat: 13.0827,
      lng: 80.2707,
      driver: 'S. Loganathan',
      amenities: ['💺 Push-back Seater', '🥤 Water Bottle']
    },

    // -------------------------------------------------------------
    // Route: Coimbatore ↔ Chennai (Return Departures)
    // -------------------------------------------------------------
    {
      id: 'TNSTC-102',
      number: 'TNSTC 102',
      operator: 'TNSTC Express (Government)',
      type: 'Government',
      category: 'Non-AC Deluxe Seater',
      routeId: 'CBE-CHE-01',
      routeName: 'Coimbatore → Chennai',
      from: 'Coimbatore',
      to: 'Chennai',
      departure: '06:00 AM',
      arrival: '12:00 PM',
      duration: '6h 00m',
      distanceKm: 505,
      fare: 320,
      price: 320,
      totalSeats: 48,
      availableSeats: 20,
      speedKm: 65,
      status: 'On Time',
      crowd: 'Medium',
      rating: 4.2,
      lat: 11.0168,
      lng: 76.9558,
      driver: 'G. Shanmugam',
      amenities: ['💺 Seater', '🥤 Water Bottle']
    },
    {
      id: 'SETC-202',
      number: 'SETC 202',
      operator: 'SETC Ultra Deluxe (Government)',
      type: 'Government',
      category: 'Ultra Deluxe Semi-Sleeper',
      routeId: 'CBE-CHE-02',
      routeName: 'Coimbatore → Chennai',
      from: 'Coimbatore',
      to: 'Chennai',
      departure: '08:30 AM',
      arrival: '02:30 PM',
      duration: '6h 00m',
      distanceKm: 505,
      fare: 350,
      price: 350,
      totalSeats: 40,
      availableSeats: 16,
      speedKm: 68,
      status: 'On Time',
      crowd: 'Low',
      rating: 4.4,
      lat: 11.0168,
      lng: 76.9558,
      driver: 'M. Vijay',
      amenities: ['💺 Recliner', '🔌 Charging Points', '🥤 Water Bottle']
    },
    {
      id: 'PKR-302',
      number: 'PKR Express',
      operator: 'PKR Travels (Private)',
      type: 'Private',
      category: 'AC Semi-Sleeper Seater',
      routeId: 'CBE-CHE-03',
      routeName: 'Coimbatore → Chennai',
      from: 'Coimbatore',
      to: 'Chennai',
      departure: '10:00 AM',
      arrival: '04:00 PM',
      duration: '6h 00m',
      distanceKm: 505,
      fare: 480,
      price: 480,
      totalSeats: 36,
      availableSeats: 11,
      speedKm: 70,
      status: 'Approaching',
      crowd: 'Low',
      rating: 4.6,
      lat: 11.0168,
      lng: 76.9558,
      driver: 'R. Karthikeyan',
      amenities: ['❄️ AC', '🔌 USB Port', '📶 Free Wi-Fi', '🥤 Snacks']
    },
    {
      id: 'XYZ-502',
      number: 'XYZ Travels',
      operator: 'XYZ Luxury Lines (Private)',
      type: 'Private',
      category: 'Volvo Multi-Axle AC Sleeper',
      routeId: 'CBE-CHE-04',
      routeName: 'Coimbatore → Chennai',
      from: 'Coimbatore',
      to: 'Chennai',
      departure: '06:30 PM',
      arrival: '12:30 AM',
      duration: '6h 00m',
      distanceKm: 505,
      fare: 550,
      price: 550,
      totalSeats: 30,
      availableSeats: 8,
      speedKm: 75,
      status: 'On Time',
      crowd: 'Low',
      rating: 4.7,
      lat: 11.0168,
      lng: 76.9558,
      driver: 'P. Anand',
      amenities: ['❄️ AC', '🛏️ Luxury Sleeper', '🚻 Restroom', '📶 Wi-Fi']
    },
    {
      id: 'SETC-609',
      number: 'SETC 609',
      operator: 'SETC AC Sleeper (Government)',
      type: 'Government',
      category: 'AC Sleeper Service',
      routeId: 'CBE-CHE-05',
      routeName: 'Coimbatore → Chennai',
      from: 'Coimbatore',
      to: 'Chennai',
      departure: '09:00 PM',
      arrival: '06:30 AM',
      duration: '9h 30m',
      distanceKm: 505,
      fare: 850,
      price: 850,
      totalSeats: 36,
      availableSeats: 14,
      speedKm: 68,
      status: 'On Time',
      crowd: 'Medium',
      rating: 4.4,
      lat: 11.0168,
      lng: 76.9558,
      driver: 'D. Charles',
      amenities: ['❄️ AC', '🛏️ Sleeper Berth', '🔌 Charging', '🥤 Water']
    },

    // -------------------------------------------------------------
    // Route: Gandhipuram ↔ Ukkadam (City Corridor Multi-Departures)
    // -------------------------------------------------------------
    {
      id: 'TN-38-N-1025',
      number: 'TN-38-N-1025',
      operator: 'TNSTC City Link (Government)',
      type: 'Government',
      category: 'City Ordinary Seater',
      routeId: 'R-101',
      routeName: 'Gandhipuram → Ukkadam',
      from: 'Gandhipuram',
      to: 'Ukkadam',
      departure: '06:30 AM',
      arrival: '06:55 AM',
      duration: '25m',
      distanceKm: 4.8,
      fare: 15,
      price: 15,
      totalSeats: 42,
      availableSeats: 34,
      speedKm: 28,
      status: 'On Time',
      crowd: 'Low',
      rating: 4.3,
      lat: 11.0168,
      lng: 76.9558,
      driver: 'Murugan K.',
      amenities: ['💺 City Seater']
    },
    {
      id: 'TN-38-N-1028',
      number: 'TN-38-N-1028',
      operator: 'TNSTC City Link (Government)',
      type: 'Government',
      category: 'City Ordinary Seater',
      routeId: 'R-101',
      routeName: 'Gandhipuram → Ukkadam',
      from: 'Gandhipuram',
      to: 'Ukkadam',
      departure: '07:45 AM',
      arrival: '08:15 AM',
      duration: '30m',
      distanceKm: 4.8,
      fare: 15,
      price: 15,
      totalSeats: 42,
      availableSeats: 10,
      speedKm: 24,
      status: 'Approaching',
      crowd: 'High',
      rating: 4.1,
      lat: 11.0120,
      lng: 76.9580,
      driver: 'S. Selvam',
      amenities: ['💺 City Seater']
    },
    {
      id: 'PVT-METRO-09',
      number: 'City Metro 09',
      operator: 'Coimbatore City Express (Private)',
      type: 'Private',
      category: 'City Low-Floor AC Shuttle',
      routeId: 'R-101-P',
      routeName: 'Gandhipuram → Ukkadam',
      from: 'Gandhipuram',
      to: 'Ukkadam',
      departure: '08:30 AM',
      arrival: '08:55 AM',
      duration: '25m',
      distanceKm: 4.8,
      fare: 25,
      price: 25,
      totalSeats: 32,
      availableSeats: 16,
      speedKm: 30,
      status: 'Approaching',
      crowd: 'Medium',
      rating: 4.6,
      lat: 11.0100,
      lng: 76.9590,
      driver: 'R. Praveen',
      amenities: ['❄️ AC', '💺 Cushioned Seats']
    },
    {
      id: 'TN-38-N-1035',
      number: 'TN-38-N-1035',
      operator: 'TNSTC City Link (Government)',
      type: 'Government',
      category: 'City Ordinary Seater',
      routeId: 'R-101',
      routeName: 'Gandhipuram → Ukkadam',
      from: 'Gandhipuram',
      to: 'Ukkadam',
      departure: '09:15 AM',
      arrival: '09:42 AM',
      duration: '27m',
      distanceKm: 4.8,
      fare: 15,
      price: 15,
      totalSeats: 42,
      availableSeats: 8,
      speedKm: 26,
      status: 'Approaching',
      crowd: 'High',
      rating: 4.2,
      lat: 11.0080,
      lng: 76.9600,
      driver: 'K. Subramani',
      amenities: ['💺 City Seater']
    },
    {
      id: 'TN-38-N-1042',
      number: 'TN-38-N-1042',
      operator: 'TNSTC City Link (Government)',
      type: 'Government',
      category: 'City Ordinary Seater',
      routeId: 'R-101',
      routeName: 'Gandhipuram → Ukkadam',
      from: 'Gandhipuram',
      to: 'Ukkadam',
      departure: '10:30 AM',
      arrival: '10:55 AM',
      duration: '25m',
      distanceKm: 4.8,
      fare: 15,
      price: 15,
      totalSeats: 42,
      availableSeats: 22,
      speedKm: 32,
      status: 'Approaching',
      crowd: 'Medium',
      rating: 4.3,
      lat: 11.0168,
      lng: 76.9558,
      driver: 'Murugan K.',
      amenities: ['💺 City Seater']
    },
    {
      id: 'PVT-GREEN-12',
      number: 'Greenline Mini',
      operator: 'Greenline Transit (Private)',
      type: 'Private',
      category: 'Mini AC City Bus',
      routeId: 'R-101-P2',
      routeName: 'Gandhipuram → Ukkadam',
      from: 'Gandhipuram',
      to: 'Ukkadam',
      departure: '12:00 PM',
      arrival: '12:22 PM',
      duration: '22m',
      distanceKm: 4.8,
      fare: 20,
      price: 20,
      totalSeats: 24,
      availableSeats: 15,
      speedKm: 35,
      status: 'On Time',
      crowd: 'Low',
      rating: 4.5,
      lat: 11.0168,
      lng: 76.9558,
      driver: 'N. Vignesh',
      amenities: ['❄️ AC', '🔌 USB Port']
    },
    {
      id: 'TN-38-N-1055',
      number: 'TN-38-N-1055',
      operator: 'TNSTC City Link (Government)',
      type: 'Government',
      category: 'City Ordinary Seater',
      routeId: 'R-101',
      routeName: 'Gandhipuram → Ukkadam',
      from: 'Gandhipuram',
      to: 'Ukkadam',
      departure: '02:15 PM',
      arrival: '02:40 PM',
      duration: '25m',
      distanceKm: 4.8,
      fare: 15,
      price: 15,
      totalSeats: 42,
      availableSeats: 28,
      speedKm: 30,
      status: 'On Time',
      crowd: 'Low',
      rating: 4.2,
      lat: 11.0168,
      lng: 76.9558,
      driver: 'A. Joseph',
      amenities: ['💺 City Seater']
    },
    {
      id: 'TN-38-N-1062',
      number: 'TN-38-N-1062',
      operator: 'TNSTC City Link (Government)',
      type: 'Government',
      category: 'City Ordinary Seater',
      routeId: 'R-101',
      routeName: 'Gandhipuram → Ukkadam',
      from: 'Gandhipuram',
      to: 'Ukkadam',
      departure: '04:30 PM',
      arrival: '05:00 PM',
      duration: '30m',
      distanceKm: 4.8,
      fare: 15,
      price: 15,
      totalSeats: 42,
      availableSeats: 6,
      speedKm: 22,
      status: 'Approaching',
      crowd: 'High',
      rating: 4.0,
      lat: 11.0140,
      lng: 76.9570,
      driver: 'V. Sundaram',
      amenities: ['💺 City Seater']
    },
    {
      id: 'PVT-METRO-15',
      number: 'City Metro 15',
      operator: 'Coimbatore City Express (Private)',
      type: 'Private',
      category: 'City Low-Floor AC Shuttle',
      routeId: 'R-101-P3',
      routeName: 'Gandhipuram → Ukkadam',
      from: 'Gandhipuram',
      to: 'Ukkadam',
      departure: '06:15 PM',
      arrival: '06:45 PM',
      duration: '30m',
      distanceKm: 4.8,
      fare: 25,
      price: 25,
      totalSeats: 32,
      availableSeats: 8,
      speedKm: 24,
      status: 'Approaching',
      crowd: 'High',
      rating: 4.4,
      lat: 11.0120,
      lng: 76.9580,
      driver: 'G. Prakash',
      amenities: ['❄️ AC', '💺 Cushioned Seats']
    },
    {
      id: 'TN-38-N-1070',
      number: 'TN-38-N-1070',
      operator: 'TNSTC Night Express (Government)',
      type: 'Government',
      category: 'City Ordinary Seater',
      routeId: 'R-101',
      routeName: 'Gandhipuram → Ukkadam',
      from: 'Gandhipuram',
      to: 'Ukkadam',
      departure: '08:30 PM',
      arrival: '08:55 PM',
      duration: '25m',
      distanceKm: 4.8,
      fare: 18,
      price: 18,
      totalSeats: 42,
      availableSeats: 30,
      speedKm: 34,
      status: 'On Time',
      crowd: 'Medium',
      rating: 4.3,
      lat: 11.0168,
      lng: 76.9558,
      driver: 'C. Natarajan',
      amenities: ['💺 City Seater']
    },

    // -------------------------------------------------------------
    // Additional Hub Routes (Singanallur, Peelamedu, Town Hall, Saravanampatti)
    // -------------------------------------------------------------
    {
      id: 'TN-38-N-2048',
      number: 'TN-38-N-2048',
      operator: 'TNSTC City Link (Government)',
      type: 'Government',
      category: 'City Ordinary Seater',
      routeId: 'R-102',
      routeName: 'Gandhipuram → Singanallur',
      from: 'Gandhipuram',
      to: 'Singanallur',
      departure: '10:45 AM',
      arrival: '11:15 AM',
      duration: '30m',
      distanceKm: 5.8,
      fare: 18,
      price: 18,
      totalSeats: 42,
      availableSeats: 14,
      speedKm: 28,
      status: 'On Time',
      crowd: 'High',
      rating: 4.1,
      lat: 11.0020,
      lng: 77.0120,
      driver: 'Ramasamy V.',
      amenities: ['💺 City Seater']
    },
    {
      id: 'TN-38-P-3092',
      number: 'TN-38-P-3092',
      operator: 'Sri Krishna Transit (Private)',
      type: 'Private',
      category: 'City Semi-Deluxe',
      routeId: 'R-103',
      routeName: 'Ukkadam → Peelamedu',
      from: 'Ukkadam',
      to: 'Peelamedu',
      departure: '11:00 AM',
      arrival: '11:35 AM',
      duration: '35m',
      distanceKm: 8.2,
      fare: 22,
      price: 22,
      totalSeats: 36,
      availableSeats: 19,
      speedKm: 35,
      status: 'Approaching',
      crowd: 'Low',
      rating: 4.6,
      lat: 10.9980,
      lng: 76.9650,
      driver: 'Senthil Nathan',
      amenities: ['💺 Cushion Seats', '🔌 Mobile Charging']
    },
    {
      id: 'TN-38-G-4521',
      number: 'TN-38-G-4521',
      operator: 'TNSTC Town Service (Government)',
      type: 'Government',
      category: 'City Ordinary Seater',
      routeId: 'R-104',
      routeName: 'Town Hall → Gandhipuram',
      from: 'Town Hall',
      to: 'Gandhipuram',
      departure: '10:15 AM',
      arrival: '10:35 AM',
      duration: '20m',
      distanceKm: 3.2,
      fare: 12,
      price: 12,
      totalSeats: 42,
      availableSeats: 12,
      speedKm: 24,
      status: 'Approaching',
      crowd: 'High',
      rating: 4.0,
      lat: 10.9995,
      lng: 76.9602,
      driver: 'Praveen Kumar',
      amenities: ['💺 City Seater']
    },
    {
      id: 'TN-38-P-5110',
      number: 'TN-38-P-5110',
      operator: 'Cheran Express (Private)',
      type: 'Private',
      category: 'IT Corridor Express',
      routeId: 'R-105',
      routeName: 'Gandhipuram → Saravanampatti',
      from: 'Gandhipuram',
      to: 'Saravanampatti',
      departure: '11:15 AM',
      arrival: '11:45 AM',
      duration: '30m',
      distanceKm: 9.6,
      fare: 28,
      price: 28,
      totalSeats: 36,
      availableSeats: 22,
      speedKm: 38,
      status: 'On Time',
      crowd: 'Medium',
      rating: 4.5,
      lat: 11.0500,
      lng: 76.9950,
      driver: 'Dinesh Raj',
      amenities: ['❄️ AC', '📶 Wi-Fi']
    },

    // -------------------------------------------------------------
    // Route: Coimbatore ↔ Madurai
    // -------------------------------------------------------------
    {
      id: 'TNSTC-MDU-01',
      number: 'TNSTC Ultra Deluxe',
      operator: 'TNSTC Ultra Deluxe (Government)',
      type: 'Government',
      category: 'Semi-Sleeper Seater',
      routeId: 'CBE-MDU-01',
      routeName: 'Coimbatore → Madurai',
      from: 'Coimbatore',
      to: 'Madurai',
      departure: '07:00 AM',
      arrival: '12:00 PM',
      duration: '5h 00m',
      distanceKm: 215,
      fare: 340,
      price: 340,
      totalSeats: 40,
      availableSeats: 22,
      speedKm: 55,
      status: 'On Time',
      crowd: 'Medium',
      rating: 4.2,
      lat: 11.0168,
      lng: 76.9558,
      driver: 'R. Velusamy',
      amenities: ['🔌 Charging', '💺 Semi-Sleeper', '🥤 Water']
    },
    {
      id: 'PVT-MDU-02',
      number: 'Rathi Meena Travels',
      operator: 'Rathi Meena Travels (Private)',
      type: 'Private',
      category: 'AC Sleeper Seater',
      routeId: 'CBE-MDU-02',
      routeName: 'Coimbatore → Madurai',
      from: 'Coimbatore',
      to: 'Madurai',
      departure: '02:30 PM',
      arrival: '07:15 PM',
      duration: '4h 45m',
      distanceKm: 215,
      fare: 490,
      price: 490,
      totalSeats: 34,
      availableSeats: 16,
      speedKm: 60,
      status: 'On Time',
      crowd: 'Low',
      rating: 4.6,
      lat: 11.0168,
      lng: 76.9558,
      driver: 'K. Soundar',
      amenities: ['❄️ AC', '🔌 USB Port', '🛏️ Sleeper', '🥤 Water']
    },
    {
      id: 'SETC-MDU-03',
      number: 'SETC Super Deluxe',
      operator: 'SETC (Government)',
      type: 'Government',
      category: 'Air Conditioned Seater',
      routeId: 'CBE-MDU-03',
      routeName: 'Coimbatore → Madurai',
      from: 'Coimbatore',
      to: 'Madurai',
      departure: '09:00 PM',
      arrival: '02:00 AM',
      duration: '5h 00m',
      distanceKm: 215,
      fare: 420,
      price: 420,
      totalSeats: 38,
      availableSeats: 18,
      speedKm: 58,
      status: 'On Time',
      crowd: 'Low',
      rating: 4.4,
      lat: 11.0168,
      lng: 76.9558,
      driver: 'P. Murugan',
      amenities: ['❄️ AC', '💺 Recliner', '🔌 Charging']
    },

    // -------------------------------------------------------------
    // Route: Coimbatore ↔ Bengaluru
    // -------------------------------------------------------------
    {
      id: 'KSRTC-BLR-01',
      number: 'KSRTC Airavat Club Class',
      operator: 'KSRTC (Government)',
      type: 'Government',
      category: 'Multi-Axle Volvo AC',
      routeId: 'CBE-BLR-01',
      routeName: 'Coimbatore → Bengaluru',
      from: 'Coimbatore',
      to: 'Bengaluru',
      departure: '06:30 AM',
      arrival: '01:30 PM',
      duration: '7h 00m',
      distanceKm: 360,
      fare: 780,
      price: 780,
      totalSeats: 40,
      availableSeats: 19,
      speedKm: 65,
      status: 'On Time',
      crowd: 'Medium',
      rating: 4.6,
      lat: 11.0168,
      lng: 76.9558,
      driver: 'H. Manjunath',
      amenities: ['❄️ AC', '🔌 Charging', '📶 Wi-Fi', '🥤 Water']
    },
    {
      id: 'SRS-BLR-02',
      number: 'SRS Travels',
      operator: 'SRS Travels (Private)',
      type: 'Private',
      category: 'Scania Multi-Axle AC Sleeper',
      routeId: 'CBE-BLR-02',
      routeName: 'Coimbatore → Bengaluru',
      from: 'Coimbatore',
      to: 'Bengaluru',
      departure: '11:30 PM',
      arrival: '06:00 AM',
      duration: '6h 30m',
      distanceKm: 360,
      fare: 920,
      price: 920,
      totalSeats: 36,
      availableSeats: 14,
      speedKm: 70,
      status: 'On Time',
      crowd: 'Low',
      rating: 4.7,
      lat: 11.0168,
      lng: 76.9558,
      driver: 'K. Ramesh',
      amenities: ['❄️ AC', '🛏️ Sleeper', '🔌 Charging', '📶 Wi-Fi', '🥤 Blanket & Water']
    }
  ];

  const SEED_LONG_DISTANCE = [
    {
      id: 'LD-001',
      busNumber: 'TN-01-AN-4455',
      operator: 'SETC Express (Government)',
      type: 'Government',
      category: 'AC Sleeper',
      from: 'Coimbatore',
      to: 'Chennai',
      departure: '09:00 PM',
      arrival: '06:30 AM',
      duration: '9h 30m',
      totalSeats: 36,
      availableSeats: 14,
      price: 850,
      rating: 4.4,
      amenities: ['❄️ AC', '🔌 Charging', '🛏️ Sleeper', '🥤 Water', '📶 Wi-Fi']
    },
    {
      id: 'LD-002',
      busNumber: 'TN-38-PX-9921',
      operator: 'KPN Travels (Private)',
      type: 'Private',
      category: 'Multi-Axle AC Sleeper',
      from: 'Coimbatore',
      to: 'Chennai',
      departure: '10:15 PM',
      arrival: '07:00 AM',
      duration: '8h 45m',
      totalSeats: 30,
      availableSeats: 8,
      price: 1150,
      rating: 4.7,
      amenities: ['❄️ AC', '🔌 Charging', '🛏️ Sleeper', '🚻 Restroom', '📶 Wi-Fi', '🥤 Water']
    },
    {
      id: 'LD-003',
      busNumber: 'TN-38-N-8844',
      operator: 'TNSTC Ultra Deluxe (Government)',
      type: 'Government',
      category: 'Semi-Sleeper Seater',
      from: 'Coimbatore',
      to: 'Madurai',
      departure: '02:30 PM',
      arrival: '07:30 PM',
      duration: '5h 00m',
      totalSeats: 40,
      availableSeats: 22,
      price: 340,
      rating: 4.2,
      amenities: ['🔌 Charging', '💺 Semi-Sleeper', '🥤 Water']
    },
    {
      id: 'LD-004',
      busNumber: 'KA-01-MJ-7711',
      operator: 'SRS Travels (Private)',
      type: 'Private',
      category: 'Volvo AC Seater',
      from: 'Coimbatore',
      to: 'Bengaluru',
      departure: '11:30 PM',
      arrival: '06:00 AM',
      duration: '6h 30m',
      totalSeats: 38,
      availableSeats: 16,
      price: 920,
      rating: 4.6,
      amenities: ['❄️ AC', '🔌 Charging', '📶 Wi-Fi', '🥤 Water']
    },
    {
      id: 'LD-005',
      busNumber: 'TN-38-N-6612',
      operator: 'TNSTC City Link (Government)',
      type: 'Government',
      category: 'Non-AC Seater',
      from: 'Gandhipuram',
      to: 'Salem',
      departure: '04:00 PM',
      arrival: '07:45 PM',
      duration: '3h 45m',
      totalSeats: 48,
      availableSeats: 26,
      price: 190,
      rating: 4.0,
      amenities: ['💺 Seater', '🥤 Water']
    }
  ];

  const SEED_BOOKINGS = [
    {
      bookingId: 'BTAI-20260915-001',
      username: 'passenger001',
      passengerName: 'Priya Sharma',
      from: 'Coimbatore',
      to: 'Chennai',
      busNumber: 'TN-01-AN-4455',
      operator: 'SETC Express (Government)',
      busType: 'AC Sleeper',
      travelDate: '2026-09-15',
      departure: '09:00 PM',
      arrival: '06:30 AM',
      seats: ['03', '04'],
      passengersCount: 2,
      fare: 1700,
      status: 'Upcoming',
      bookedAt: '2026-09-04 14:30'
    },
    {
      bookingId: 'BTAI-20260820-044',
      username: 'passenger001',
      passengerName: 'Priya Sharma',
      from: 'Coimbatore',
      to: 'Madurai',
      busNumber: 'TN-38-N-8844',
      operator: 'TNSTC Ultra Deluxe (Government)',
      busType: 'Semi-Sleeper Seater',
      travelDate: '2026-08-20',
      departure: '02:30 PM',
      arrival: '07:30 PM',
      seats: ['11'],
      passengersCount: 1,
      fare: 340,
      status: 'Completed',
      bookedAt: '2026-08-18 10:15'
    }
  ];

  const SEED_FEEDBACK = [
    {
      id: 'FB-101',
      date: '2026-09-03',
      busNumber: 'TN-38-N-1025',
      passenger: 'Kavitha R.',
      rating: 5,
      comment: 'The bus arrived right on time and the driver was polite. Very smooth journey.',
      sentiment: 'Positive',
      issues: ['None'],
      positiveFactors: ['On-time arrival', 'Helpful driver']
    },
    {
      id: 'FB-102',
      date: '2026-09-02',
      busNumber: 'TN-38-N-2048',
      passenger: 'Arun Kumar',
      rating: 2,
      comment: 'The bus was late by 25 minutes and extremely crowded. Please increase frequency.',
      sentiment: 'Negative',
      issues: ['Delay', 'Overcrowding'],
      positiveFactors: ['None']
    },
    {
      id: 'FB-103',
      date: '2026-09-01',
      busNumber: 'TN-38-P-3092',
      passenger: 'Vikram S.',
      rating: 4,
      comment: 'Good clean private bus with working AC, though ticket fare is slightly high.',
      sentiment: 'Positive',
      issues: ['High Fare'],
      positiveFactors: ['Cleanliness', 'Air Conditioning']
    }
  ];

  const SEED_NOTIFICATIONS = [
    { id: 1, text: '🚌 Your bus TN-38-N-1025 is arriving in 8 minutes at Gandhipuram.', time: '5m ago', read: false },
    { id: 2, text: '🎫 E-Ticket BTAI-20260915-001 confirmed for Coimbatore → Chennai.', time: '1h ago', read: false },
    { id: 3, text: '⏱️ Traffic alert: Route 102 (Singanallur) has a 10-minute delay.', time: '3h ago', read: true },
    { id: 4, text: '⭐ How was your recent trip? Please leave your valuable feedback.', time: '1d ago', read: true },
    { id: 5, text: '🤖 AI Model Insight: Peak demand expected around 05:30 PM today.', time: '1d ago', read: true }
  ];

  const SEED_DRIVER_REPORTS = [
    { id: 'DR-01', bus: 'TN-38-N-1025', type: 'Traffic Delay', details: 'Heavy congestion near Lakshmi Mills junction. Delay +8m.', time: '10:12 AM', status: 'Active' },
    { id: 'DR-02', bus: 'TN-38-N-2048', type: 'High Passenger Demand', details: 'Bus at maximum capacity at Singanallur stop.', time: '09:45 AM', status: 'Acknowledged' }
  ];

  const initData = () => {
    if (localStorage.getItem('btai_seed_ver') !== SEED_VERSION) {
      localStorage.setItem('btai_seed_ver', SEED_VERSION);
      localStorage.setItem('buses', JSON.stringify(SEED_BUSES));
      localStorage.setItem('longDistanceBuses', JSON.stringify(SEED_LONG_DISTANCE));
      localStorage.setItem('bookings', JSON.stringify(SEED_BOOKINGS));
      localStorage.setItem('feedback', JSON.stringify(SEED_FEEDBACK));
      localStorage.setItem('notifications', JSON.stringify(SEED_NOTIFICATIONS));
      localStorage.setItem('driverReports', JSON.stringify(SEED_DRIVER_REPORTS));
    }
  };

  initData();

  return {
    getBuses: () => JSON.parse(localStorage.getItem('buses') || '[]'),
    saveBuses: (data) => localStorage.setItem('buses', JSON.stringify(data)),
    getLongDistance: () => JSON.parse(localStorage.getItem('longDistanceBuses') || '[]'),
    saveLongDistance: (data) => localStorage.setItem('longDistanceBuses', JSON.stringify(data)),
    getBookings: () => JSON.parse(localStorage.getItem('bookings') || '[]'),
    saveBookings: (data) => localStorage.setItem('bookings', JSON.stringify(data)),
    getFeedback: () => JSON.parse(localStorage.getItem('feedback') || '[]'),
    saveFeedback: (data) => localStorage.setItem('feedback', JSON.stringify(data)),
    getNotifications: () => JSON.parse(localStorage.getItem('notifications') || '[]'),
    getDriverReports: () => JSON.parse(localStorage.getItem('driverReports') || '[]'),
    saveDriverReports: (data) => localStorage.setItem('driverReports', JSON.stringify(data))
  };
})();

// ==========================================================================
// 2. Animated Smart City Transit Background (Canvas)
// ==========================================================================
class TransitBackground {
  constructor() {
    this.canvas = document.getElementById('transit-bg-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.nodes = [];
    this.routes = [];
    this.vehicles = [];
    this.animId = null;

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.createNetwork();
    this.animate();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  createNetwork() {
    const nodeCount = Math.floor(Math.max(10, Math.min(this.width / 120, 24)));
    this.nodes = [];
    for (let i = 0; i < nodeCount; i++) {
      this.nodes.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: Math.random() * 2.5 + 2,
        pulseRadius: 0,
        color: Math.random() > 0.6 ? '#06b6d4' : (Math.random() > 0.5 ? '#8b5cf6' : '#3b82f6')
      });
    }

    this.routes = [];
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = i + 1; j < this.nodes.length; j++) {
        const dx = this.nodes[i].x - this.nodes[j].x;
        const dy = this.nodes[i].y - this.nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 260) {
          this.routes.push({ from: this.nodes[i], to: this.nodes[j], dist });
        }
      }
    }

    this.vehicles = [];
    for (let i = 0; i < Math.min(14, this.routes.length); i++) {
      const route = this.routes[Math.floor(Math.random() * this.routes.length)];
      this.vehicles.push({
        route,
        progress: Math.random(),
        speed: 0.0015 + Math.random() * 0.002,
        color: Math.random() > 0.5 ? '#38bdf8' : '#34d399'
      });
    }
  }

  animate() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      this.drawStatic();
      return;
    }

    const { ctx, width, height } = this;
    ctx.clearRect(0, 0, width, height);

    ctx.lineWidth = 1;
    this.routes.forEach(route => {
      ctx.beginPath();
      ctx.moveTo(route.from.x, route.from.y);
      ctx.lineTo(route.to.x, route.to.y);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.06)';
      ctx.stroke();
    });

    this.vehicles.forEach(v => {
      v.progress += v.speed;
      if (v.progress >= 1) {
        v.progress = 0;
        v.route = this.routes[Math.floor(Math.random() * this.routes.length)];
      }

      const x = v.route.from.x + (v.route.to.x - v.route.from.x) * v.progress;
      const y = v.route.from.y + (v.route.to.y - v.route.from.y) * v.progress;

      const grad = ctx.createRadialGradient(x, y, 0, x, y, 10);
      grad.addColorStop(0, v.color);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, 7, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
    });

    this.nodes.forEach(node => {
      node.pulseRadius += 0.2;
      if (node.pulseRadius > 18) node.pulseRadius = 0;

      ctx.beginPath();
      ctx.arc(node.x, node.y, node.pulseRadius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(6, 182, 212, ${Math.max(0, 1 - node.pulseRadius / 18) * 0.25})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fillStyle = node.color;
      ctx.fill();
    });

    this.animId = requestAnimationFrame(() => this.animate());
  }

  drawStatic() {
    const { ctx, width, height } = this;
    ctx.clearRect(0, 0, width, height);
    this.routes.forEach(route => {
      ctx.beginPath();
      ctx.moveTo(route.from.x, route.from.y);
      ctx.lineTo(route.to.x, route.to.y);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.04)';
      ctx.stroke();
    });
  }
}

// ==========================================================================
// 3. Floating AI Travel Assistant Widget
// ==========================================================================
const AIAssistant = (() => {
  const KNOWLEDGE_BASE = [
    {
      keywords: ['track', 'location', 'live', 'gps', 'where is my bus', 'map'],
      response: "📍 You can track any city or long-distance bus in real-time from the **Live Tracking** page (`tracking.html`). The prototype map simulates GPS telematics, speed, waypoints, and automated ETA countdowns."
    },
    {
      keywords: ['book', 'ticket', 'reserve', 'seats', 'long distance', 'chennai', 'bengaluru'],
      response: "🎫 To book long-distance tickets, visit **Book Ticket** (`booking.html`). You can search routes (e.g. Coimbatore ↔ Chennai), compare Government vs. Private operators, pick your seat in the interactive seat map, and simulate demo payment."
    },
    {
      keywords: ['cheap', 'cheaper', 'lowest fare', 'cost', 'price', 'economy'],
      response: "💰 **Government buses (TNSTC / SETC)** offer great economy with fares from ₹190–₹850, whereas Private operators offer ultra-luxury sleeper berths and onboard amenities from ₹920–₹1,150."
    },
    {
      keywords: ['sleeper', 'luxury', 'comfort', 'ac', 'wifi'],
      response: "🛏️ For maximum comfort, our AI recommends **Private Multi-Axle AC Sleeper** buses featuring individual charging, Wi-Fi, blanket sets, and onboard restrooms."
    },
    {
      keywords: ['cancel', 'refund', 'cancellation'],
      response: "📋 You can cancel any active booking directly from **My Bookings** (`bookings.html`). Click the 'Cancel' button on any active ticket and confirm the cancellation."
    },
    {
      keywords: ['eta', 'predict', 'ai', 'arrival time', 'delay', 'algorithm'],
      response: "🤖 BusTrack AI uses a **Time-Series / Regression-Based ETA Forecasting Simulation** (`predictArrival()`) combining live distance, congestion multipliers, historical delay offsets, and time-of-day peak factors."
    },
    {
      keywords: ['pwa', 'install', 'app', 'iphone', 'android', 'offline'],
      response: "📱 **BusTrack AI is an installable PWA!** On iPhone/Safari, tap Share ➔ 'Add to Home Screen'. On Android Chrome, tap 'Install App' when prompted. Cached schedules and tickets are viewable offline."
    }
  ];

  const init = () => {
    if (!document.getElementById('ai-assistant-widget')) {
      const widgetHTML = `
        <div id="ai-assistant-widget" class="ai-assistant-widget">
          <button id="ai-fab-btn" class="ai-fab-btn" aria-label="Ask BusTrack AI">
            <span style="font-size: 1.25rem;">🤖</span>
            <span>Ask BusTrack AI</span>
          </button>
          <div id="ai-chat-window" class="ai-chat-window">
            <div class="ai-chat-header">
              <div style="display:flex; align-items:center; gap:0.5rem;">
                <span style="font-size: 1.3rem;">🤖</span>
                <div>
                  <h4 style="font-size:0.95rem; margin:0;">BusTrack AI Assistant</h4>
                  <span class="badge badge-ai" style="font-size:0.6rem; padding:0.1rem 0.4rem;">Prototype NLP</span>
                </div>
              </div>
              <button id="ai-chat-close-btn" class="modal-close-btn" style="font-size: 1.1rem;">✕</button>
            </div>
            <div id="ai-chat-messages" class="ai-chat-messages">
              <div class="chat-bubble bot">
                👋 Hello! I am your <strong>BusTrack AI Travel Assistant</strong>. Ask me anything about bus schedules, ETA predictions, PWA installation, or Govt vs. Private comparisons!
              </div>
            </div>
            <div class="ai-quick-prompts">
              <button class="prompt-pill" data-msg="How do I track my bus?">📍 How to track?</button>
              <button class="prompt-pill" data-msg="How do I book a ticket?">🎫 How to book?</button>
              <button class="prompt-pill" data-msg="How to install as app on iPhone/Android?">📱 Install App?</button>
              <button class="prompt-pill" data-msg="Which bus is cheaper: Govt or Private?">⚖️ Govt vs Private?</button>
            </div>
            <form id="ai-chat-form" class="ai-chat-input-area">
              <input type="text" id="ai-chat-input" class="form-control" placeholder="Ask BusTrack AI anything..." autocomplete="off" style="font-size: 16px; padding: 0.55rem 0.85rem;" />
              <button type="submit" class="btn btn-secondary btn-sm" style="padding: 0.55rem 0.9rem;">Send</button>
            </form>
          </div>
        </div>
      `;
      document.body.insertAdjacentHTML('beforeend', widgetHTML);
    }

    bindEvents();
  };

  const bindEvents = () => {
    const fabBtn = document.getElementById('ai-fab-btn');
    const closeBtn = document.getElementById('ai-chat-close-btn');
    const chatWindow = document.getElementById('ai-chat-window');
    const chatForm = document.getElementById('ai-chat-form');
    const chatInput = document.getElementById('ai-chat-input');
    const promptPills = document.querySelectorAll('.prompt-pill');

    if (fabBtn && chatWindow) {
      fabBtn.addEventListener('click', () => {
        chatWindow.classList.toggle('active');
        if (chatWindow.classList.contains('active')) {
          chatInput.focus();
        }
      });
    }

    if (closeBtn && chatWindow) {
      closeBtn.addEventListener('click', () => {
        chatWindow.classList.remove('active');
      });
    }

    if (chatForm) {
      chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = chatInput.value.trim();
        if (!text) return;
        sendMessage(text);
        chatInput.value = '';
      });
    }

    promptPills.forEach(pill => {
      pill.addEventListener('click', () => {
        const msg = pill.dataset.msg;
        sendMessage(msg);
      });
    });
  };

  const sendMessage = (text) => {
    const messagesContainer = document.getElementById('ai-chat-messages');
    if (!messagesContainer) return;

    const userBubble = document.createElement('div');
    userBubble.className = 'chat-bubble user';
    userBubble.textContent = text;
    messagesContainer.appendChild(userBubble);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    const botBubble = document.createElement('div');
    botBubble.className = 'chat-bubble bot';
    botBubble.innerHTML = '<em>Thinking...</em>';
    messagesContainer.appendChild(botBubble);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    setTimeout(() => {
      botBubble.innerHTML = generateResponse(text);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 450);
  };

  const generateResponse = (query) => {
    const q = query.toLowerCase();
    for (const item of KNOWLEDGE_BASE) {
      if (item.keywords.some(k => q.includes(k))) {
        return item.response;
      }
    }
    return "🤖 <strong>BusTrack AI Insight:</strong> You can search buses between hubs (Gandhipuram ↔ Ukkadam), compare Government and Private options on our Booking page, or check the Transport Command Center for city analytics!";
  };

  return { init, sendMessage };
})();

// ==========================================================================
// 4. Progressive Web App (PWA) Manager & iOS Install Flow
// ==========================================================================
const PWAManager = (() => {
  let deferredPrompt = null;

  const init = () => {
    // 1. Register Service Worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js')
          .then((reg) => {
            console.log('BusTrack AI PWA ServiceWorker registered with scope:', reg.scope);
          })
          .catch((err) => {
            console.warn('BusTrack AI ServiceWorker registration failed:', err);
          });
      });
    }

    // 2. Inject PWA Install Banner UI
    if (!document.getElementById('pwa-install-banner')) {
      const bannerHTML = `
        <div id="pwa-install-banner" class="pwa-install-banner">
          <div style="display:flex; align-items:center; gap:0.75rem;">
            <img src="assets/icons/icon-192.png" width="40" height="40" alt="BusTrack AI" style="border-radius: 8px;" />
            <div>
              <strong style="font-size:0.9rem; color:#fff; display:block;">Install BusTrack AI</strong>
              <span class="text-muted text-xs">Faster access & offline cached timetables</span>
            </div>
          </div>
          <div style="display:flex; gap:0.4rem;">
            <button type="button" id="pwa-install-btn" class="btn btn-secondary btn-sm" style="min-height:36px; padding:0.3rem 0.8rem; font-size:0.8rem;">Install</button>
            <button type="button" id="pwa-dismiss-btn" class="modal-close-btn" style="min-width:32px; min-height:32px; font-size:1.2rem;">✕</button>
          </div>
        </div>

        <!-- iOS Safari Add to Home Screen Instructions Modal -->
        <div id="ios-pwa-modal" class="modal-backdrop">
          <div class="modal-container" style="max-width: 440px; text-align:center;">
            <div class="modal-header">
              <h3 class="modal-title">📱 Install on iPhone / iPad</h3>
              <button class="modal-close-btn">&times;</button>
            </div>
            <div class="modal-body" style="text-align:left; font-size:0.9rem; line-height:1.6;">
              <p style="margin-bottom:1rem;">To install <strong>BusTrack AI</strong> on your iOS device:</p>
              <div style="display:flex; align-items:center; gap:0.75rem; margin-bottom:0.75rem; padding:0.6rem; background:rgba(255,255,255,0.05); border-radius:8px;">
                <span style="font-size:1.5rem;">1️⃣</span>
                <span>Tap the <strong>Share</strong> button (📤) in the Safari toolbar.</span>
              </div>
              <div style="display:flex; align-items:center; gap:0.75rem; margin-bottom:0.75rem; padding:0.6rem; background:rgba(255,255,255,0.05); border-radius:8px;">
                <span style="font-size:1.5rem;">2️⃣</span>
                <span>Scroll down and tap <strong>"Add to Home Screen"</strong> (➕).</span>
              </div>
              <div style="display:flex; align-items:center; gap:0.75rem; padding:0.6rem; background:rgba(255,255,255,0.05); border-radius:8px;">
                <span style="font-size:1.5rem;">3️⃣</span>
                <span>Tap <strong>Add</strong> in the top-right corner to launch fullscreen!</span>
              </div>
            </div>
            <div class="modal-footer" style="justify-content:center;">
              <button type="button" class="btn btn-primary btn-sm" data-modal-close>Got It!</button>
            </div>
          </div>
        </div>
      `;
      document.body.insertAdjacentHTML('beforeend', bannerHTML);
    }

    bindPWAEvents();
  };

  const bindPWAEvents = () => {
    const banner = document.getElementById('pwa-install-banner');
    const installBtn = document.getElementById('pwa-install-btn');
    const dismissBtn = document.getElementById('pwa-dismiss-btn');

    // Android & Chrome / Edge desktop beforeinstallprompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      if (!sessionStorage.getItem('pwa_dismissed') && banner) {
        banner.classList.add('active');
      }
    });

    if (installBtn) {
      installBtn.addEventListener('click', async () => {
        // Detect iOS
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        const isStandalone = window.navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches;

        if (isIOS && !isStandalone) {
          if (banner) banner.classList.remove('active');
          UI.openModal('ios-pwa-modal');
          return;
        }

        if (deferredPrompt) {
          deferredPrompt.prompt();
          const { outcome } = await deferredPrompt.userChoice;
          if (outcome === 'accepted') {
            UI.showToast('✅ BusTrack AI installed successfully!', 'success');
          }
          deferredPrompt = null;
          if (banner) banner.classList.remove('active');
        } else {
          UI.showToast('To install, use browser menu ➔ "Install App" or "Add to Home Screen"', 'info');
        }
      });
    }

    if (dismissBtn && banner) {
      dismissBtn.addEventListener('click', () => {
        banner.classList.remove('active');
        sessionStorage.setItem('pwa_dismissed', 'true');
      });
    }

    // Window installed listener
    window.addEventListener('appinstalled', () => {
      if (banner) banner.classList.remove('active');
      UI.showToast('🎉 Welcome to BusTrack AI App!', 'success');
    });
  };

  return { init };
})();

// ==========================================================================
// 5. Toast Notifications & Global UI Helper Functions
// ==========================================================================
const UI = {
  showToast: (message, type = 'info', duration = 3500) => {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const iconMap = { success: '✅', warning: '⚠️', danger: '❌', info: 'ℹ️' };
    toast.innerHTML = `
      <span>${iconMap[type] || 'ℹ️'}</span>
      <div style="flex: 1; font-size: 0.875rem;">${message}</div>
    `;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },

  openModal: (modalId) => {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  },

  closeModal: (modalId) => {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  },

  animateCounters: () => {
    const counters = document.querySelectorAll('.animate-counter');
    counters.forEach(counter => {
      const target = parseFloat(counter.getAttribute('data-target') || counter.textContent.replace(/[^0-9.]/g, ''));
      const isPercent = counter.textContent.includes('%');
      const isDecimal = counter.getAttribute('data-decimal') === 'true';
      const duration = 1200;
      const startTime = performance.now();

      const update = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        const current = (ease * target);

        if (isDecimal) {
          counter.textContent = current.toFixed(1) + (isPercent ? '%' : '');
        } else {
          counter.textContent = Math.floor(current).toLocaleString() + (isPercent ? '%' : '');
        }

        if (progress < 1) {
          requestAnimationFrame(update);
        }
      };
      requestAnimationFrame(update);
    });
  },

  initHeader: () => {
    const notifBtn = document.getElementById('notification-btn');
    const notifDropdown = document.getElementById('notifications-dropdown');
    if (notifBtn && notifDropdown) {
      notifBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        notifDropdown.classList.toggle('active');
      });
      document.addEventListener('click', () => {
        notifDropdown.classList.remove('active');
      });
    }

    // Mobile Sidebar Drawer & Backdrop
    const menuBtn = document.getElementById('menu-toggle-btn');
    const sidebar = document.querySelector('.sidebar');
    
    // Inject sidebar backdrop if missing
    let backdrop = document.querySelector('.sidebar-backdrop');
    if (!backdrop && sidebar) {
      backdrop = document.createElement('div');
      backdrop.className = 'sidebar-backdrop';
      document.body.appendChild(backdrop);
    }

    if (menuBtn && sidebar && backdrop) {
      menuBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        backdrop.classList.toggle('active');
      });

      backdrop.addEventListener('click', () => {
        sidebar.classList.remove('open');
        backdrop.classList.remove('active');
      });

      // Auto close sidebar on nav click in mobile
      sidebar.querySelectorAll('.sidebar-link').forEach(link => {
        link.addEventListener('click', () => {
          if (window.innerWidth <= 768) {
            sidebar.classList.remove('open');
            backdrop.classList.remove('active');
          }
        });
      });
    }

    const user = AuthManager.getCurrentUser();
    if (user) {
      const nameElements = document.querySelectorAll('.current-user-name');
      nameElements.forEach(el => el.textContent = user.name || user.username);
      const roleBadges = document.querySelectorAll('.current-user-role');
      roleBadges.forEach(el => el.textContent = user.role.toUpperCase());
    }
  }
};

// ==========================================================================
// 6. Global Document Ready Initializer
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  new TransitBackground();
  AIAssistant.init();
  PWAManager.init();
  UI.initHeader();
  UI.animateCounters();

  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        backdrop.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  document.querySelectorAll('.modal-close-btn, [data-modal-close]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-backdrop');
      if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  document.querySelectorAll('.logout-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (confirm('Are you sure you want to log out of BusTrack AI?')) {
        AuthManager.logout();
      }
    });
  });
});

window.BusTrackData = BusTrackData;
window.UI = UI;
window.AIAssistant = AIAssistant;
window.PWAManager = PWAManager;
