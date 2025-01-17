self.addEventListener('install', (event) => {
    console.log('Service Worker installed.');
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker activated.');
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close(); // Close the notification
    console.log("Notification clicked");
});
