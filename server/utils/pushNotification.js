import webpush from 'web-push';

// Configure web-push with VAPID keys
// You'll need to generate these keys and add them to your environment variables
const vapidKeys = {
    publicKey: process.env.VAPID_PUBLIC_KEY || 'BEl62iUYgUivxIkv69yViEuiBIa40HI2BbSDgVdAVAOHxMrKNL9CPNNqiLNkUSYKGBYjBqNqtV5c4LlKGGHAe9s',
    privateKey: process.env.VAPID_PRIVATE_KEY || 'UxN2-OU812-T7dtVuY4n-POQeVgZE2z6QRpOtJVkW5o'
};

// Set VAPID details
webpush.setVapidDetails(
    'mailto:' + (process.env.ADMIN_EMAIL || 'admin@campusbites.com'),
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

// Store admin subscriptions (in production, store these in database)
let adminSubscriptions = [];

const addAdminSubscription = (subscription) => {
    console.log('=== ADDING ADMIN SUBSCRIPTION ===');
    console.log('Subscription details:', {
        endpoint: subscription.endpoint.substring(0, 50) + '...',
        keys: subscription.keys ? 'Present' : 'Missing'
    });
    
    // Remove existing subscription for same endpoint to avoid duplicates
    const beforeCount = adminSubscriptions.length;
    adminSubscriptions = adminSubscriptions.filter(
        sub => sub.endpoint !== subscription.endpoint
    );
    const afterFilter = adminSubscriptions.length;
    
    if (beforeCount > afterFilter) {
        console.log('Removed existing subscription for same endpoint');
    }
    
    adminSubscriptions.push(subscription);
    console.log('Total admin subscriptions:', adminSubscriptions.length);
    console.log('Admin subscription added:', subscription.endpoint.substring(0, 50) + '...');
};

const removeAdminSubscription = (endpoint) => {
    adminSubscriptions = adminSubscriptions.filter(
        sub => sub.endpoint !== endpoint
    );
    console.log('Admin subscription removed:', endpoint);
};

const sendNotificationToAllAdmins = async (payload) => {
    console.log('=== SENDING NOTIFICATION TO ADMINS ===');
    console.log('Number of admin subscriptions:', adminSubscriptions.length);
    console.log('Payload:', JSON.stringify(payload, null, 2));
    
    if (adminSubscriptions.length === 0) {
        console.log('No admin subscriptions found!');
        return;
    }
    
    const notificationPayload = JSON.stringify(payload);
    
    const promises = adminSubscriptions.map(async (subscription, index) => {
        try {
            console.log(`Sending to subscription ${index + 1}:`, subscription.endpoint.substring(0, 50) + '...');
            const result = await webpush.sendNotification(subscription, notificationPayload);
            console.log(`Push notification sent successfully to subscription ${index + 1}:`, result.statusCode);
        } catch (error) {
            console.error(`Error sending push notification to subscription ${index + 1}:`, subscription.endpoint, error);
            
            // Remove invalid subscriptions
            if (error.statusCode === 410 || error.statusCode === 404) {
                console.log(`Removing invalid subscription: ${subscription.endpoint}`);
                removeAdminSubscription(subscription.endpoint);
            }
        }
    });

    await Promise.allSettled(promises);
    console.log('=== NOTIFICATION SENDING COMPLETE ===');
};

const sendOrderNotificationToAdmins = async (orderData) => {
    const payload = {
        title: 'New Order Placed! 🍕',
        body: `New order from ${orderData.customerName || 'Customer'} - ₹${orderData.totalAmount}`,
        icon: '/logo.png',
        badge: '/badge.png',
        data: {
            type: 'new_order',
            orderId: orderData.orderId,
            totalAmount: orderData.totalAmount,
            customerName: orderData.customerName,
            itemCount: orderData.itemCount,
            timestamp: new Date().toISOString()
        },
        actions: [
            {
                action: 'view_order',
                title: 'View Order',
                icon: '/view-icon.png'
            },
            {
                action: 'mark_preparing',
                title: 'Start Preparing',
                icon: '/prepare-icon.png'
            }
        ],
        requireInteraction: true,
        vibrate: [200, 100, 200]
    };

    await sendNotificationToAllAdmins(payload);
};

const getDebugInfo = () => {
    return {
        subscriptionCount: adminSubscriptions.length,
        subscriptions: adminSubscriptions.map(sub => ({
            endpoint: sub.endpoint.substring(0, 50) + '...',
            hasKeys: !!sub.keys
        })),
        vapidConfigured: !!(vapidKeys.publicKey && vapidKeys.privateKey)
    };
};

export { 
    addAdminSubscription,
    removeAdminSubscription, 
    sendNotificationToAllAdmins,
    sendOrderNotificationToAdmins,
    getDebugInfo,
    vapidKeys
};