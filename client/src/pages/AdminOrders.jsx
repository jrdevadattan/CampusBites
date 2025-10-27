import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import Loading from '../components/Loading'
import NoData from '../components/NoData'
import { toast } from 'react-toastify'

const AdminOrders = () => {
  const user = useSelector(state => state.user)
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState([])
  const [updating, setUpdating] = useState(false)

  const fetchAll = async () => {
    try {
      setLoading(true)
      const res = await Axios({
        ...SummaryApi.getAllOrdersAdmin
      })
      const { data: responseData } = res
      if (responseData?.success) {
        setOrders(responseData.data || [])
      }
    } catch (err) {
      AxiosToastError(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user?._id && user?.role === 'ADMIN') {
      fetchAll()
    } else {
      setLoading(false)
    }
    // eslint-disable-next-line
  }, [user?._id, user?.role])

  const handleDelivered = async (orderId) => {
    setUpdating(true)
    try {
      const res = await Axios({
        ...SummaryApi.updateOrderDeliveredStatusAdmin,
        data: { orderId, delivered: true }
      })
      const { data } = res
      if (data?.success) {
        toast.success('Order marked as delivered')
        fetchAll()
      } else {
        toast.error(data?.message || 'Failed to update')
      }
    } catch (err) {
      AxiosToastError(err)
    } finally {
      setUpdating(false)
    }
  }

  const handleCancel = async (orderId) => {
    const reason = window.prompt('Enter cancellation reason (optional):')
    if (reason === null) return // User clicked cancel on the prompt
    
    setUpdating(true)
    try {
      console.log('Cancelling order:', { orderId, reason: reason || 'No reason provided' })
      const res = await Axios({
        ...SummaryApi.cancelOrder,
        data: { orderId, reason: reason || '' }
      })
      const { data } = res
      console.log('Cancel order response:', data)
      if (data?.success) {
        toast.success('Order cancelled successfully')
        fetchAll()
      } else {
        toast.error(data?.message || 'Failed to cancel order')
      }
    } catch (err) {
      console.error('Cancel order error:', err)
      console.error('Error response:', err.response)
      AxiosToastError(err)
    } finally {
      setUpdating(false)
    }
  }

  // Sort orders: pending (not delivered, not cancelled) first, then delivered, then cancelled
  const sortedOrders = [...orders].sort((a, b) => {
    // Pending first
    if (!a.delivered && !a.cancelled && (b.delivered || b.cancelled)) return -1;
    if (!b.delivered && !b.cancelled && (a.delivered || a.cancelled)) return 1;
    // Delivered next
    if (a.delivered && !a.cancelled && (!b.delivered || b.cancelled)) return -1;
    if (b.delivered && !b.cancelled && (!a.delivered || a.cancelled)) return 1;
    // Cancelled last
    if (a.cancelled && !b.cancelled) return 1;
    if (b.cancelled && !a.cancelled) return -1;
    // Otherwise, keep original order (by createdAt desc)
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  if (loading) return <Loading />

  if (!orders?.length) return (
    <div className='p-4'>
      <h2 className='text-lg font-semibold mb-3'>All Orders</h2>
      <NoData />
    </div>
  )

  return (
    <div className='p-2 sm:p-4'>
      <h2 className='text-lg font-semibold mb-3 dark:text-white'>All Orders</h2>

      {/* Desktop table view - hidden on mobile */}
      <div className='hidden sm:block overflow-x-auto rounded border bg-white dark:bg-neutral-900 dark:border-neutral-700'>
        <div className='overflow-x-auto'>
          <table className='w-full text-xs'>
            <thead className='bg-blue-50 dark:bg-neutral-800'>
              <tr>
                <th className='text-left p-2 border-b dark:border-neutral-700 dark:text-white whitespace-nowrap'>Date</th>
                <th className='text-left p-2 border-b dark:border-neutral-700 dark:text-white whitespace-nowrap'>Order ID</th>
                <th className='text-left p-2 border-b dark:border-neutral-700 dark:text-white whitespace-nowrap'>Customer</th>
                <th className='text-left p-2 border-b dark:border-neutral-700 dark:text-white whitespace-nowrap'>Product</th>
                <th className='text-right p-2 border-b dark:border-neutral-700 dark:text-white whitespace-nowrap'>Qty</th>
                <th className='text-right p-2 border-b dark:border-neutral-700 dark:text-white whitespace-nowrap'>Total</th>
                <th className='text-center p-2 border-b dark:border-neutral-700 dark:text-white whitespace-nowrap'>Status</th>
                <th className='text-center p-2 border-b dark:border-neutral-700 dark:text-white whitespace-nowrap'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedOrders.map((o) => {
                const d = new Date(o.createdAt)
                const customer = o.userId || {}
                const addr = o.delivery_address || {}
                const prod = o.product_details || {}
                return (
                  <tr key={o._id} className={`hover:bg-blue-50/40 dark:hover:bg-neutral-800 ${o.cancelled ? 'opacity-60' : ''}`}>
                    <td className='p-2 border-b dark:border-neutral-700 dark:text-neutral-200 whitespace-nowrap text-xs'>{d.toLocaleDateString()} {d.toLocaleTimeString()}</td>
                    <td className='p-2 border-b dark:border-neutral-700 dark:text-neutral-200 whitespace-nowrap'>{o.orderId}</td>
                    <td className='p-2 border-b dark:border-neutral-700'>
                      <div className='font-medium dark:text-white whitespace-nowrap'>{customer.name || '—'}</div>
                      <div className='text-xs text-neutral-500 dark:text-neutral-400 whitespace-nowrap'>{addr.hostelName || '—'}, {addr.roomNumber || '—'}</div>
                    </td>
                    <td className='p-2 border-b dark:border-neutral-700 dark:text-neutral-200 max-w-[150px] truncate'>{prod.name || '—'}</td>
                    <td className='p-2 border-b dark:border-neutral-700 dark:text-neutral-200 text-right'>{Number(o.quantity || 1)}</td>
                    <td className='p-2 border-b dark:border-neutral-700 dark:text-neutral-200 text-right whitespace-nowrap'>₹{Number(o.totalAmt || 0).toFixed(2)}</td>
                    <td className='p-2 border-b dark:border-neutral-700 text-center'>
                      {o.cancelled ? (
                        <div>
                          <span className='inline-block px-2 py-1 rounded bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 text-xs'>Cancelled</span>
                          {o.cancelReason && <div className='text-xs text-gray-500 mt-1'>{o.cancelReason}</div>}
                        </div>
                      ) : o.delivered ? (
                        <span className='inline-block px-2 py-1 rounded bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 text-xs'>Delivered</span>
                      ) : (
                        <span className='inline-block px-2 py-1 rounded bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400 text-xs'>Pending</span>
                      )}
                    </td>
                    <td className='p-2 border-b dark:border-neutral-700 text-center'>
                      {!o.cancelled && !o.delivered && (
                        <div className='flex gap-1 justify-center flex-wrap'>
                          <button
                            className='px-2 py-1 rounded bg-blue-600 text-white text-xs hover:bg-blue-700 disabled:opacity-60 whitespace-nowrap'
                            disabled={updating}
                            onClick={() => handleDelivered(o._id)}
                          >
                            Deliver
                          </button>
                          <button
                            className='px-2 py-1 rounded bg-red-600 text-white text-xs hover:bg-red-700 disabled:opacity-60 whitespace-nowrap'
                            disabled={updating}
                            onClick={() => handleCancel(o._id)}
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                      {(o.cancelled || o.delivered) && <span className='text-xs text-gray-500'>—</span>}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
      {/* Mobile card view - hidden on desktop */}
      <div className='sm:hidden flex flex-col gap-3'>
        {sortedOrders.map((o) => {
          const d = new Date(o.createdAt)
          const customer = o.userId || {}
          const addr = o.delivery_address || {}
          const prod = o.product_details || {}
          return (
            <div key={o._id + 'mobile'} className={`border dark:border-neutral-700 rounded-lg p-3 bg-white dark:bg-neutral-900 shadow-md flex flex-col gap-2 ${o.cancelled ? 'opacity-60' : ''}`}>
              <div className='flex justify-between items-start gap-2'>
                <span className='font-semibold text-base dark:text-white'>{prod.name || '—'}</span>
                <div className='flex flex-col items-end gap-1'>
                  {o.cancelled ? (
                    <span className='inline-block px-2 py-1 rounded bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 text-xs font-medium'>Cancelled</span>
                  ) : o.delivered ? (
                    <span className='inline-block px-2 py-1 rounded bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 text-xs font-medium'>Delivered</span>
                  ) : (
                    <span className='inline-block px-2 py-1 rounded bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400 text-xs font-medium'>Pending</span>
                  )}
                  <span className='text-xs text-neutral-500 dark:text-neutral-400'>{d.toLocaleDateString()}</span>
                </div>
              </div>
              <div className='flex flex-wrap gap-2 text-xs dark:text-neutral-200'>
                <span className='block'>Order ID: <span className='font-medium'>{o.orderId}</span></span>
                <span className='block'>Qty: <span className='font-medium'>{Number(o.quantity || 1)}</span></span>
                <span className='block'>Total: <span className='font-medium'>₹{Number(o.totalAmt || 0).toFixed(2)}</span></span>
              </div>
              <div className='flex flex-col gap-1 text-xs dark:text-neutral-200'>
                <span>Customer: <span className='font-medium'>{customer.name || '—'}</span></span>
                <span>Contact: <span className='font-medium'>{customer.mobile || addr.mobile || '—'}</span></span>
                <span>Location: <span className='font-medium'>{addr.hostelName || '—'}, Room {addr.roomNumber || '—'}</span></span>
              </div>
              {o.cancelled && o.cancelReason && (
                <div className='text-xs bg-red-50 dark:bg-red-900/20 p-2 rounded border-l-2 border-red-500'>
                  <span className='font-medium text-red-700 dark:text-red-400'>Reason:</span>
                  <div className='text-red-600 dark:text-red-400 mt-0.5'>{o.cancelReason}</div>
                </div>
              )}
              {!o.cancelled && !o.delivered && (
                <div className='mt-1 flex gap-2'>
                  <button
                    className='flex-1 px-3 py-2 rounded bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 disabled:opacity-60'
                    disabled={updating}
                    onClick={() => handleDelivered(o._id)}
                  >
                    Mark as Delivered
                  </button>
                  <button
                    className='flex-1 px-3 py-2 rounded bg-red-600 text-white text-xs font-semibold hover:bg-red-700 disabled:opacity-60'
                    disabled={updating}
                    onClick={() => handleCancel(o._id)}
                  >
                    Cancel Order
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default AdminOrders
