import webpush from 'web-push';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure web-push with VAPID keys
// You'll need to generate these keys and add them to your environment variables
const vapidKeys = {
    publicKey: process.env.VAPID_PUBLIC_KEY || 'BIbq5Pa1fOMZNf_bWHR32UPIp5uVuopXgO2sAAFP_m_Kg_2BAeTGGb4G1rg1yUiYOFnvoLr8neknLgCyF1iWFUU',
    privateKey: process.env.VAPID_PRIVATE_KEY || 'qSlQJsty7UXhuGeU30nIFnFQMI6W8pxRBJGQq3cL5fE'
};

// Set VAPID details
webpush.setVapidDetails(
    'mailto:' + (process.env.ADMIN_EMAIL || 'admin@campusbites.com'),
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

// Path to store subscriptions (simple file-based persistence)
const SUBSCRIPTIONS_FILE = path.join(__dirname, 'subscriptions.json');

// Load subscriptions from file
let adminSubscriptions = [];
try {
    if (fs.existsSync(SUBSCRIPTIONS_FILE)) {
        const data = fs.readFileSync(SUBSCRIPTIONS_FILE, 'utf8');
        adminSubscriptions = JSON.parse(data);
        console.log(`Loaded ${adminSubscriptions.length} admin subscriptions from file`);
    }
} catch (error) {
    console.error('Error loading subscriptions:', error);
    adminSubscriptions = [];
}

// Save subscriptions to file
const saveSubscriptions = () => {
    try {
        fs.writeFileSync(SUBSCRIPTIONS_FILE, JSON.stringify(adminSubscriptions, null, 2));
        console.log(`Saved ${adminSubscriptions.length} subscriptions to file`);
    } catch (error) {
        console.error('Error saving subscriptions:', error);
    }
};

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
    saveSubscriptions(); // Persist to file
    console.log('Total admin subscriptions:', adminSubscriptions.length);
    console.log('Admin subscription added:', subscription.endpoint.substring(0, 50) + '...');
};

const removeAdminSubscription = (endpoint) => {
    adminSubscriptions = adminSubscriptions.filter(
        sub => sub.endpoint !== endpoint
    );
    saveSubscriptions(); // Persist to file
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
            timestamp: new Date().toISOString(),
            // Target URL for admins to view orders in dashboard
            targetUrl: '/dashboard/orders'
        },
        actions: [
            {
                action: 'view_order',
                title: 'View Order',
                icon: '/view-icon.png'
            },
            {
                action: 'mark_preparing',
                title: 'Ok',
                icon: '/prepare-icon.png'
            }
        ],
        requireInteraction: true,
        vibrate: [200, 100, 200]
    };

    await sendNotificationToAllAdmins(payload);
};

const getDebugInfo = () => {
    console.log('=== getDebugInfo called ===');
    console.log('Total subscriptions:', adminSubscriptions.length);
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