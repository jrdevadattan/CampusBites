import { Router } from 'express';
import auth from '../middleware/auth.js';
import { admin } from '../middleware/Admin.js';
import { 
    addAdminSubscription, 
    removeAdminSubscription, 
    sendNotificationToAllAdmins,
    getDebugInfo,
    vapidKeys 
} from '../utils/pushNotification.js';

const notificationRouter = Router();

// Get VAPID public key for client-side subscription
notificationRouter.get('/vapid-public-key', (req, res) => {
    res.json({
        success: true,
        publicKey: vapidKeys.publicKey
    });
});

// Subscribe admin to push notifications
notificationRouter.post('/admin/subscribe', auth, admin, (req, res) => {
    try {
        const { subscription } = req.body;
        
        if (!subscription || !subscription.endpoint) {
            return res.status(400).json({
                success: false,
                message: 'Invalid subscription data'
            });
        }

        addAdminSubscription(subscription);
        
        res.json({
            success: true,
            message: 'Admin subscribed to push notifications'
        });
    } catch (error) {
        console.error('Subscription error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to subscribe to notifications'
        });
    }
});

// Unsubscribe admin from push notifications
notificationRouter.post('/admin/unsubscribe', auth, admin, (req, res) => {
    try {
        const { endpoint } = req.body;
        
        if (!endpoint) {
            return res.status(400).json({
                success: false,
                message: 'Endpoint is required'
            });
        }

        removeAdminSubscription(endpoint);
        
        res.json({
            success: true,
            message: 'Admin unsubscribed from push notifications'
        });
    } catch (error) {
        console.error('Unsubscription error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to unsubscribe from notifications'
        });
    }
});

// Test notification endpoint (for testing purposes)
notificationRouter.post('/admin/test', auth, admin, async (req, res) => {
    try {
        const testPayload = {
            title: 'Test Notification 🔔',
            body: 'This is a test push notification from CampusBites',
            icon: '/logo.png',
            data: {
                type: 'test',
                timestamp: new Date().toISOString()
            }
        };

        await sendNotificationToAllAdmins(testPayload);
        
        res.json({
            success: true,
            message: 'Test notification sent to all admin subscribers'
        });
    } catch (error) {
        console.error('Test notification error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send test notification'
        });
    }
});

// Debug endpoint to check subscription status
notificationRouter.get('/admin/debug', auth, admin, (req, res) => {
    try {
        const debugInfo = getDebugInfo();
        
        res.json({
            success: true,
            data: debugInfo
        });
        
        // Log debug info to console
        console.log('=== PUSH NOTIFICATION DEBUG ===');
        console.log('Debug info:', debugInfo);
    } catch (error) {
        console.error('Debug endpoint error:', error);
        res.status(500).json({
            success: false,
            message: 'Debug endpoint failed'
        });
    }
});

export default notificationRouter;