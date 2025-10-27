import Axios from './Axios'
import SummaryApi from '../common/SummaryApi'

class PushNotificationService {
    constructor() {
        this.registration = null;
        this.subscription = null;
        this.vapidPublicKey = null;
    }

    // Check if push notifications are supported
    isSupported() {
        return 'serviceWorker' in navigator && 'PushManager' in window;
    }

    // Initialize the service worker
    async initializeServiceWorker() {
        if (!this.isSupported()) {
            throw new Error('Push notifications are not supported in this browser');
        }

        try {
            this.registration = await navigator.serviceWorker.register('/sw.js');
            console.log('Service Worker registered successfully:', this.registration);
            return this.registration;
        } catch (error) {
            console.error('Service Worker registration failed:', error);
            throw error;
        }
    }

    // Get VAPID public key from server
    async getVapidPublicKey() {
        try {
            const response = await Axios({
                ...SummaryApi.getVapidKey
            });
            this.vapidPublicKey = response.data.publicKey;
            return this.vapidPublicKey;
        } catch (error) {
            console.error('Failed to get VAPID public key:', error);
            throw error;
        }
    }

    // Convert VAPID key to Uint8Array
    urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    // Subscribe to push notifications
    async subscribe() {
        try {
            console.log('=== STARTING SUBSCRIPTION PROCESS ===');
            
            if (!this.registration) {
                console.log('Initializing service worker...');
                await this.initializeServiceWorker();
            }

            if (!this.vapidPublicKey) {
                console.log('Getting VAPID public key...');
                await this.getVapidPublicKey();
            }

            // Check if already subscribed
            console.log('Checking existing subscription...');
            this.subscription = await this.registration.pushManager.getSubscription();
            
            if (!this.subscription) {
                console.log('Creating new subscription...');
                // Create new subscription
                this.subscription = await this.registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: this.urlBase64ToUint8Array(this.vapidPublicKey)
                });
                console.log('New subscription created:', this.subscription.endpoint.substring(0, 50) + '...');
            } else {
                console.log('Using existing subscription:', this.subscription.endpoint.substring(0, 50) + '...');
            }

            // Send subscription to server
            console.log('Sending subscription to server...');
            await this.sendSubscriptionToServer(this.subscription);
            
            console.log('Successfully subscribed to push notifications');
            return this.subscription;
        } catch (error) {
            console.error('Failed to subscribe to push notifications:', error);
            throw error;
        }
    }

    // Send subscription to server
    async sendSubscriptionToServer(subscription) {
        try {
            console.log('=== SENDING SUBSCRIPTION TO SERVER ===');
            console.log('Subscription endpoint:', subscription.endpoint.substring(0, 50) + '...');
            console.log('Subscription keys:', subscription.keys ? 'Present' : 'Missing');
            
            const response = await Axios({
                ...SummaryApi.subscribePushNotifications,
                data: { subscription }
            });
            
            console.log('Server response:', response.data);
            
            if (response.data.success) {
                console.log('Subscription sent to server successfully');
            }
            return response.data;
        } catch (error) {
            console.error('Failed to send subscription to server:', error);
            throw error;
        }
    }

    // Unsubscribe from push notifications
    async unsubscribe() {
        try {
            if (this.subscription) {
                await this.subscription.unsubscribe();
                
                // Notify server
                await Axios({
                    ...SummaryApi.unsubscribePushNotifications,
                    data: { endpoint: this.subscription.endpoint }
                });
                
                this.subscription = null;
                console.log('Successfully unsubscribed from push notifications');
            }
        } catch (error) {
            console.error('Failed to unsubscribe from push notifications:', error);
            throw error;
        }
    }

    // Check current subscription status
    async getSubscriptionStatus() {
        try {
            if (!this.registration) {
                await this.initializeServiceWorker();
            }
            
            this.subscription = await this.registration.pushManager.getSubscription();
            return !!this.subscription;
        } catch (error) {
            console.error('Failed to check subscription status:', error);
            return false;
        }
    }

    // Request notification permission
    async requestPermission() {
        if (!('Notification' in window)) {
            throw new Error('This browser does not support notifications');
        }

        let permission = Notification.permission;
        
        if (permission === 'default') {
            permission = await Notification.requestPermission();
        }
        
        if (permission !== 'granted') {
            throw new Error('Notification permission denied');
        }
        
        return permission;
    }

    // Send test notification
    async sendTestNotification() {
        try {
            console.log('=== SENDING TEST NOTIFICATION ===');
            console.log('Current subscription status:', await this.getSubscriptionStatus());
            
            const response = await Axios({
                ...SummaryApi.sendTestNotification
            });
            
            console.log('Test notification response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Failed to send test notification:', error);
            throw error;
        }
    }

    // Initialize everything for admin users
    async initializeForAdmin() {
        try {
            // Request permission first
            await this.requestPermission();
            
            // Initialize service worker and subscribe
            await this.subscribe();
            
            console.log('Push notifications initialized successfully for admin');
            return true;
        } catch (error) {
            console.error('Failed to initialize push notifications for admin:', error);
            throw error;
        }
    }
}

export default new PushNotificationService();