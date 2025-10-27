// Service Worker for handling push notifications
self.addEventListener('push', function(event) {
    console.log('=== PUSH NOTIFICATION RECEIVED ===');
    console.log('Event:', event);
    console.log('Event data exists:', !!event.data);
    
    let notificationData = {
        title: 'CampusBites Notification',
        body: 'You have a new notification',
        icon: '/logo.png',
        badge: '/badge.png'
    };

    if (event.data) {
        try {
            const parsedData = event.data.json();
            console.log('Parsed notification data:', parsedData);
            notificationData = { ...notificationData, ...parsedData };
        } catch (e) {
            console.error('Error parsing notification data:', e);
            console.log('Raw data text:', event.data.text());
        }
    }

    console.log('Final notification data:', notificationData);

    const options = {
        body: notificationData.body,
        icon: notificationData.icon || '/logo.png',
        badge: notificationData.badge || '/badge.png',
        data: notificationData.data || {},
        actions: notificationData.actions || [],
        requireInteraction: notificationData.requireInteraction || false,
        vibrate: notificationData.vibrate || [200, 100, 200],
        tag: notificationData.data?.type || 'general'
    };

    console.log('Showing notification with options:', options);

    event.waitUntil(
        self.registration.showNotification(notificationData.title, options)
            .then(() => console.log('Notification shown successfully'))
            .catch(err => console.error('Error showing notification:', err))
    );
});

// Handle notification click events
self.addEventListener('notificationclick', function(event) {
    console.log('Notification clicked:', event);
    
    event.notification.close();
    
    const action = event.action;
    const data = event.notification.data;
    
    if (action === 'view_order' || !action) {
        // Open the admin orders page
        event.waitUntil(
            clients.openWindow('/admin/orders')
        );
    } else if (action === 'mark_preparing') {
        // Could trigger an API call to mark order as preparing
        console.log('Mark as preparing action clicked for order:', data.orderId);
    }
});

// Handle notification close events
self.addEventListener('notificationclose', function(event) {
    console.log('Notification closed:', event);
    // Could track analytics here
});