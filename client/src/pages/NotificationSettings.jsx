import React, { useState, useEffect } from 'react'
import PushNotificationService from '../utils/PushNotificationService'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import { FaBell, FaBellSlash, FaDesktop, FaMobile, FaCheckCircle, FaTimesCircle, FaBug } from 'react-icons/fa'
import { IoNotifications, IoNotificationsOff } from 'react-icons/io5'
import toast from 'react-hot-toast'

const NotificationSettings = () => {
    const [isSubscribed, setIsSubscribed] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [permission, setPermission] = useState(Notification.permission)
    const [testSending, setTestSending] = useState(false)
    const [debugInfo, setDebugInfo] = useState(null)
    const [showDebug, setShowDebug] = useState(false)

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
            setTestSending(true)
            await PushNotificationService.sendTestNotification()
            toast.success('Test notification sent! Check your notifications.')
        } catch (error) {
            console.error('Error sending test notification:', error)
            toast.error('Failed to send test notification: ' + error.message)
        } finally {
            setTestSending(false)
        }
    }

    const handleDebugInfo = async () => {
        try {
            const response = await Axios({
                ...SummaryApi.debugNotifications
            })
            setDebugInfo(response.data.data)
            setShowDebug(true)
            console.log('Debug info:', response.data.data)
        } catch (error) {
            console.error('Error getting debug info:', error)
            toast.error('Failed to get debug info: ' + error.message)
        }
    }

    const isSupported = PushNotificationService.isSupported()

    const getStatusColor = () => {
        if (permission === 'denied') return 'text-red-600'
        if (permission === 'granted' && isSubscribed) return 'text-green-600'
        if (permission === 'granted' && !isSubscribed) return 'text-yellow-600'
        return 'text-gray-500'
    }

    const getStatusIcon = () => {
        if (permission === 'denied') return <FaTimesCircle className="text-red-600" />
        if (permission === 'granted' && isSubscribed) return <FaCheckCircle className="text-green-600" />
        if (permission === 'granted' && !isSubscribed) return <FaBellSlash className="text-yellow-600" />
        return <FaBell className="text-gray-500" />
    }

    const getStatusText = () => {
        if (permission === 'denied') return 'Permission Denied'
        if (permission === 'granted' && isSubscribed) return 'Active & Receiving Notifications'
        if (permission === 'granted' && !isSubscribed) return 'Permission Granted - Not Subscribed'
        return 'Not Configured'
    }

    return (
        <div className='p-4 max-w-4xl mx-auto'>
            <div className='mb-6'>
                <h1 className='text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-3'>
                    <IoNotifications className='text-blue-600' />
                    Notification Settings
                </h1>
                <p className='text-gray-600 dark:text-gray-300 mt-2'>
                    Manage push notifications for order alerts and admin updates
                </p>
            </div>

            {!isSupported && (
                <div className='bg-red-50 border border-red-200 rounded-lg p-6 mb-6'>
                    <div className='flex items-center gap-3'>
                        <FaBellSlash className='text-red-600 text-xl' />
                        <div>
                            <h3 className='text-red-800 font-semibold'>Browser Not Supported</h3>
                            <p className='text-red-700 mt-1'>
                                Push notifications are not supported in this browser. Please use Chrome, Firefox, Edge, or Safari.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Status Overview */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
                <div className='bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg p-6 shadow-sm'>
                    <div className='flex items-center gap-3 mb-2'>
                        {getStatusIcon()}
                        <h3 className='font-semibold text-gray-800 dark:text-white'>Status</h3>
                    </div>
                    <p className={`text-sm font-medium ${getStatusColor()}`}>
                        {getStatusText()}
                    </p>
                </div>

                <div className='bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg p-6 shadow-sm'>
                    <div className='flex items-center gap-3 mb-2'>
                        <FaDesktop className='text-blue-600' />
                        <h3 className='font-semibold text-gray-800 dark:text-white'>Device Type</h3>
                    </div>
                    <p className='text-sm text-gray-600 dark:text-gray-300'>
                        {/Mobile|Android|iPhone|iPad/i.test(navigator.userAgent) ? 'Mobile Device' : 'Desktop Device'}
                    </p>
                </div>

                <div className='bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg p-6 shadow-sm'>
                    <div className='flex items-center gap-3 mb-2'>
                        <FaBell className='text-green-600' />
                        <h3 className='font-semibold text-gray-800 dark:text-white'>Browser</h3>
                    </div>
                    <p className='text-sm text-gray-600 dark:text-gray-300'>
                        {isSupported ? 'Supported' : 'Not Supported'}
                    </p>
                </div>
            </div>

            {/* Main Settings Panel */}
            <div className='bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-sm overflow-hidden'>
                <div className='p-6 border-b border-gray-200 dark:border-neutral-700'>
                    <h2 className='text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-3'>
                        <FaBell className='text-blue-600' />
                        Order Notifications
                    </h2>
                    <p className='text-gray-600 dark:text-gray-300 mt-1'>
                        Receive instant notifications when new orders are placed
                    </p>
                </div>

                <div className='p-6'>
                    {permission === 'denied' && (
                        <div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6'>
                            <h4 className='text-red-800 dark:text-red-300 font-semibold flex items-center gap-2'>
                                <FaTimesCircle />
                                Permission Required
                            </h4>
                            <p className='text-red-700 dark:text-red-400 text-sm mt-2'>
                                Notifications are blocked for this site. To enable notifications:
                            </p>
                            <ol className='list-decimal list-inside text-red-700 dark:text-red-400 text-sm mt-2 space-y-1 ml-4'>
                                <li>Click on the lock or notification icon in your browser's address bar</li>
                                <li>Change notifications from "Block" to "Allow"</li>
                                <li>Refresh this page and try again</li>
                            </ol>
                        </div>
                    )}

                    <div className='space-y-6'>
                        {/* Notification Features */}
                        <div className='bg-gray-50 dark:bg-neutral-700/50 rounded-lg p-4'>
                            <h4 className='font-medium text-gray-800 dark:text-white mb-3'>What you'll receive:</h4>
                            <ul className='space-y-2 text-sm text-gray-600 dark:text-gray-300'>
                                <li className='flex items-center gap-2'>
                                    <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                                    Instant alerts when new orders are placed
                                </li>
                                <li className='flex items-center gap-2'>
                                    <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
                                    Customer name and order total
                                </li>
                                <li className='flex items-center gap-2'>
                                    <div className='w-2 h-2 bg-purple-500 rounded-full'></div>
                                    Quick action buttons (View Order, Start Preparing)
                                </li>
                                <li className='flex items-center gap-2'>
                                    <div className='w-2 h-2 bg-orange-500 rounded-full'></div>
                                    Works even when browser is closed
                                </li>
                            </ul>
                        </div>

                        {/* Action Buttons */}
                        <div className='flex gap-3 flex-wrap'>
                            {!isSubscribed ? (
                                <button
                                    onClick={handleSubscribe}
                                    disabled={isLoading || permission === 'denied' || !isSupported}
                                    className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2'
                                >
                                    {isLoading ? (
                                        <>
                                            <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                                            Enabling...
                                        </>
                                    ) : (
                                        <>
                                            <FaBell />
                                            Enable Notifications
                                        </>
                                    )}
                                </button>
                            ) : (
                                <button
                                    onClick={handleUnsubscribe}
                                    disabled={isLoading}
                                    className='bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2'
                                >
                                    {isLoading ? (
                                        <>
                                            <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                                            Disabling...
                                        </>
                                    ) : (
                                        <>
                                            <IoNotificationsOff />
                                            Disable Notifications
                                        </>
                                    )}
                                </button>
                            )}

                            {isSubscribed && (
                                <button
                                    onClick={handleTestNotification}
                                    disabled={testSending}
                                    className='bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2'
                                >
                                    {testSending ? (
                                        <>
                                            <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <FaBell />
                                            Send Test Notification
                                        </>
                                    )}
                                </button>
                            )}

                            <button
                                onClick={handleDebugInfo}
                                className='bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2'
                            >
                                <FaBug />
                                Debug Info
                            </button>
                        </div>

                        {/* Debug Information */}
                        {showDebug && debugInfo && (
                            <div className='bg-gray-50 dark:bg-neutral-700/50 rounded-lg p-4 mt-6'>
                                <h4 className='font-medium text-gray-800 dark:text-white mb-3 flex items-center gap-2'>
                                    <FaBug />
                                    Debug Information
                                </h4>
                                <div className='text-sm space-y-2'>
                                    <div className='flex justify-between'>
                                        <span className='text-gray-600 dark:text-gray-300'>Subscriptions on server:</span>
                                        <span className='font-medium dark:text-white'>{debugInfo.subscriptionCount}</span>
                                    </div>
                                    <div className='flex justify-between'>
                                        <span className='text-gray-600 dark:text-gray-300'>VAPID configured:</span>
                                        <span className={`font-medium ${debugInfo.vapidConfigured ? 'text-green-600' : 'text-red-600'}`}>
                                            {debugInfo.vapidConfigured ? 'Yes' : 'No'}
                                        </span>
                                    </div>
                                    {debugInfo.subscriptions.length > 0 && (
                                        <div className='mt-3'>
                                            <span className='text-gray-600 dark:text-gray-300 block mb-2'>Active subscriptions:</span>
                                            {debugInfo.subscriptions.map((sub, index) => (
                                                <div key={index} className='text-xs text-gray-500 dark:text-gray-400 ml-2'>
                                                    • {sub.endpoint} (Keys: {sub.hasKeys ? 'Yes' : 'No'})
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() => setShowDebug(false)}
                                    className='mt-3 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                                >
                                    Hide Debug Info
                                </button>
                            </div>
                        )}

                        {/* Troubleshooting Steps */}
                        <div className='bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mt-6'>
                            <h4 className='font-medium text-blue-800 dark:text-blue-300 mb-3'>Troubleshooting Steps:</h4>
                            <ol className='list-decimal list-inside text-sm text-blue-700 dark:text-blue-400 space-y-1'>
                                <li>Check browser notification permission (should be "granted")</li>
                                <li>Open browser console (F12) and look for errors</li>
                                <li>Check if service worker is registered in Dev Tools → Application → Service Workers</li>
                                <li>Verify you're logged in as an admin user</li>
                                <li>Try refreshing the page and re-enabling notifications</li>
                                <li>Check Debug Info to see if subscription is registered on server</li>
                            </ol>
                        </div>

                        {/* Help Text */}
                        <div className='text-xs text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-neutral-600'>
                            <h5 className='font-medium mb-2'>Important Notes:</h5>
                            <ul className='space-y-1'>
                                <li>• Notifications work across all your devices where you're logged in as admin</li>
                                <li>• You can disable notifications at any time from browser settings</li>
                                <li>• Notifications are only sent to admin users</li>
                                <li>• Make sure your browser allows notifications from this site</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NotificationSettings