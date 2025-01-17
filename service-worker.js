self.addEventListener('install', (event) => {
    console.log('Service Worker installed');
    event.waitUntil(self.skipWaiting()); // Ensure the new service worker takes control immediately
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker activated');
    event.waitUntil(self.clients.claim()); // Take control of the page as soon as the worker is activated
});

self.addEventListener('push', function(event) {
    const options = event.data ? JSON.parse(event.data.text()) : {};
    event.waitUntil(
        self.registration.showNotification(options.title, options)
    );
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    // Handle the notification click if needed
    // You can navigate to a specific page or take an action
});
