/**
 * BusTrack AI - Service Worker
 * Progressive Web App Caching & Offline Support
 */

const CACHE_NAME = 'bustrack-ai-v1.0.2';
const CORE_ASSETS = [
  './',
  './index.html',
  './login.html',
  './register.html',
  './passenger.html',
  './booking.html',
  './bookings.html',
  './tracking.html',
  './feedback.html',
  './driver.html',
  './admin.html',
  './minister.html',
  './help.html',
  './profile.html',
  './settings.html',
  './manifest.json',
  './css/global.css',
  './css/landing.css',
  './css/login.css',
  './css/passenger.css',
  './css/booking.css',
  './css/tracking.css',
  './css/feedback.css',
  './css/driver.css',
  './css/admin.css',
  './css/minister.css',
  './css/help.css',
  './js/app.js',
  './js/auth.js',
  './js/language.js',
  './js/charts.js',
  './js/passenger.js',
  './js/booking.js',
  './js/bookings.js',
  './js/tracking.js',
  './js/feedback.js',
  './js/driver.js',
  './js/admin.js',
  './js/minister.js',
  './js/help.js',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/apple-touch-icon.png',
  './assets/icons/favicon.png',
  './assets/icons/icon.svg'
];

// Install Event - Pre-cache essential resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CORE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event - Clean up stale cache versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Stale-While-Revalidate Strategy
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // If offline and request is for navigation, return cached page or index
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html') || cachedResponse;
        }
      });

      return cachedResponse || fetchPromise;
    })
  );
});
