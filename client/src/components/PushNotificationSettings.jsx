import React, { useState, useEffect } from 'react'
import PushNotificationService from '../utils/PushNotificationService'
import { FaBell, FaBellSlash } from 'react-icons/fa'
import toast from 'react-hot-toast'

const PushNotificationSettings = () => {
    const [isSubscribed, setIsSubscribed] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [permission, setPermission] = useState(Notification.permission)

    useEffect(() => {
        checkSubscriptionStatus()
    }, [])

    const checkSubscriptionStatus = async () => {
        try {
            setIsLoading(true)
            const status = await PushNotificationService.getSubscriptionStatus()
            setIsSubscribed(status)
            setPermission(Notification.permission)
        } catch (error) {
            console.error('Error checking subscription status:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubscribe = async () => {
        try {
            setIsLoading(true)
            await PushNotificationService.initializeForAdmin()
            setIsSubscribed(true)
            setPermission('granted')
            toast.success('Push notifications enabled successfully!')
        } catch (error) {
            console.error('Error subscribing:', error)
            toast.error('Failed to enable push notifications: ' + error.message)
        } finally {
            setIsLoading(false)
        }
    }

    const handleUnsubscribe = async () => {
        try {
            setIsLoading(true)
            await PushNotificationService.unsubscribe()
            setIsSubscribed(false)
            toast.success('Push notifications disabled successfully!')
        } catch (error) {
            console.error('Error unsubscribing:', error)
            toast.error('Failed to disable push notifications: ' + error.message)
        } finally {
            setIsLoading(false)
        }
    }

    const handleTestNotification = async () => {
        try {
            setIsLoading(true)
            await PushNotificationService.sendTestNotification()
            toast.success('Test notification sent!')
        } catch (error) {
            console.error('Error sending test notification:', error)
            toast.error('Failed to send test notification: ' + error.message)
        } finally {
            setIsLoading(false)
        }
    }

    const isSupported = PushNotificationService.isSupported()

    if (!isSupported) {
        return (
            <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4'>
                <div className='flex items-center gap-2'>
                    <FaBellSlash className='text-yellow-600' />
                    <p className='text-yellow-800'>
                        Push notifications are not supported in this browser.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className='bg-white border border-gray-200 rounded-lg p-6 shadow-sm'>
            <div className='flex items-center gap-3 mb-4'>
                <FaBell className='text-blue-600 text-xl' />
                <h3 className='text-lg font-semibold text-gray-800'>Push Notifications</h3>
            </div>

            <div className='space-y-4'>
                <div className='flex items-center justify-between p-4 bg-gray-50 rounded-lg'>
                    <div>
                        <p className='font-medium text-gray-800'>Order Notifications</p>
                        <p className='text-sm text-gray-600'>
                            Get instant notifications when new orders are placed
                        </p>
                    </div>
                    <div className='flex items-center gap-2'>
                        {permission === 'denied' && (
                            <span className='text-red-600 text-sm font-medium'>
                                Permission Denied
                            </span>
                        )}
                        {permission === 'default' && (
                            <span className='text-gray-500 text-sm font-medium'>
                                Not Set
                            </span>
                        )}
                        {permission === 'granted' && isSubscribed && (
                            <span className='text-green-600 text-sm font-medium'>
                                Active
                            </span>
                        )}
                        {permission === 'granted' && !isSubscribed && (
                            <span className='text-yellow-600 text-sm font-medium'>
                                Inactive
                            </span>
                        )}
                    </div>
                </div>

                <div className='flex gap-2 flex-wrap'>
                    {!isSubscribed ? (
                        <button
                            onClick={handleSubscribe}
                            disabled={isLoading || permission === 'denied'}
                            className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                        >
                            {isLoading ? 'Enabling...' : 'Enable Notifications'}
                        </button>
                    ) : (
                        <button
                            onClick={handleUnsubscribe}
                            disabled={isLoading}
                            className='bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                        >
                            {isLoading ? 'Disabling...' : 'Disable Notifications'}
                        </button>
                    )}

                    {isSubscribed && (
                        <button
                            onClick={handleTestNotification}
                            disabled={isLoading}
                            className='bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                        >
                            {isLoading ? 'Sending...' : 'Send Test'}
                        </button>
                    )}
                </div>

                {permission === 'denied' && (
                    <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
                        <p className='text-red-800 text-sm'>
                            <strong>Permission Denied:</strong> To enable notifications, please:
                        </p>
                        <ol className='list-decimal list-inside text-red-700 text-sm mt-2 space-y-1'>
                            <li>Click on the lock/notification icon in your browser's address bar</li>
                            <li>Allow notifications for this site</li>
                            <li>Refresh the page and try again</li>
                        </ol>
                    </div>
                )}

                <div className='text-xs text-gray-500 mt-4'>
                    <p>• Notifications will appear even when the browser tab is closed</p>
                    <p>• You can disable notifications at any time from browser settings</p>
                </div>
            </div>
        </div>
    )
}

export default PushNotificationSettings