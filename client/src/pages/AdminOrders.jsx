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
        <table className='w-full text-xs sm:text-sm min-w-[700px]'>
          <thead className='bg-blue-50 dark:bg-neutral-800'>
            <tr>
              <th className='text-left p-2 border-b dark:border-neutral-700 dark:text-white'>Date</th>
              <th className='text-left p-2 border-b dark:border-neutral-700 dark:text-white'>Order ID</th>
              <th className='text-left p-2 border-b dark:border-neutral-700 dark:text-white'>Customer</th>
              <th className='text-left p-2 border-b dark:border-neutral-700 dark:text-white'>Contact</th>
              <th className='text-left p-2 border-b dark:border-neutral-700 dark:text-white'>Address</th>
              <th className='text-left p-2 border-b dark:border-neutral-700 dark:text-white'>Product</th>
              <th className='text-right p-2 border-b dark:border-neutral-700 dark:text-white'>Qty</th>
              <th className='text-right p-2 border-b dark:border-neutral-700 dark:text-white'>Total</th>
              <th className='text-left p-2 border-b dark:border-neutral-700 dark:text-white'>Payment</th>
              <th className='text-center p-2 border-b dark:border-neutral-700 dark:text-white'>Delivered</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => {
              const d = new Date(o.createdAt)
              const customer = o.userId || {}
              const addr = o.delivery_address || {}
              const prod = o.product_details || {}
              return (
                <tr key={o._id} className='hover:bg-blue-50/40 dark:hover:bg-neutral-800'>
                  <td className='p-2 border-b dark:border-neutral-700 dark:text-neutral-200 whitespace-nowrap'>{d.toLocaleString()}</td>
                  <td className='p-2 border-b dark:border-neutral-700 dark:text-neutral-200 whitespace-nowrap'>{o.orderId}</td>
                  <td className='p-2 border-b dark:border-neutral-700'>
                    <div className='font-medium dark:text-white'>{customer.name || '—'}</div>
                    <div className='text-xs text-neutral-500 dark:text-neutral-400'>{customer.email || '—'}</div>
                  </td>
                  <td className='p-2 border-b dark:border-neutral-700 dark:text-neutral-200 whitespace-nowrap'>{customer.mobile || addr.mobile || '—'}</td>
                  <td className='p-2 border-b dark:border-neutral-700 dark:text-neutral-200'>
                    <div>Hostel: {addr.hostelName || '—'}</div>
                    <div>Room: {addr.roomNumber || '—'}</div>
                  </td>
                  <td className='p-2 border-b dark:border-neutral-700 dark:text-neutral-200'>{prod.name || '—'}</td>
                  <td className='p-2 border-b dark:border-neutral-700 dark:text-neutral-200 text-right'>{Number(o.quantity || 1)}</td>
                  <td className='p-2 border-b dark:border-neutral-700 dark:text-neutral-200 text-right'>₹{Number(o.totalAmt || 0).toFixed(2)}</td>
                  <td className='p-2 border-b dark:border-neutral-700 dark:text-neutral-200'>{o.payment_status || '—'}</td>
                  <td className='p-2 border-b dark:border-neutral-700 text-center'>
                    {o.delivered ? (
                      <span className='inline-block px-2 py-1 rounded bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 text-xs'>Delivered</span>
                    ) : (
                      <button
                        className='px-2 py-1 rounded bg-blue-600 text-white text-xs hover:bg-blue-700 disabled:opacity-60'
                        disabled={updating}
                        onClick={() => handleDelivered(o._id)}
                      >
                        Mark as Delivered
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {/* Mobile card view - hidden on desktop */}
      <div className='sm:hidden flex flex-col gap-3'>
        {orders.map((o) => {
          const d = new Date(o.createdAt)
          const customer = o.userId || {}
          const addr = o.delivery_address || {}
          const prod = o.product_details || {}
          return (
            <div key={o._id + 'mobile'} className='border dark:border-neutral-700 rounded-lg p-3 bg-white dark:bg-neutral-900 shadow-md flex flex-col gap-2'>
              <div className='flex justify-between items-center'>
                <span className='font-semibold text-base dark:text-white'>{prod.name || '—'}</span>
                <span className='text-xs text-neutral-500 dark:text-neutral-400'>{d.toLocaleString()}</span>
              </div>
              <div className='flex flex-wrap gap-2 text-xs dark:text-neutral-200'>
                <span className='block'>Order ID: <span className='font-medium'>{o.orderId}</span></span>
                <span className='block'>Qty: <span className='font-medium'>{Number(o.quantity || 1)}</span></span>
                <span className='block'>Total: <span className='font-medium'>₹{Number(o.totalAmt || 0).toFixed(2)}</span></span>
              </div>
              <div className='flex flex-col gap-1 text-xs dark:text-neutral-200'>
                <span>Customer: <span className='font-medium'>{customer.name || '—'}</span></span>
                <span>Email: <span className='font-medium'>{customer.email || '—'}</span></span>
                <span>Contact: <span className='font-medium'>{customer.mobile || addr.mobile || '—'}</span></span>
                <span>Hostel: <span className='font-medium'>{addr.hostelName || '—'}</span>, Room: <span className='font-medium'>{addr.roomNumber || '—'}</span></span>
                <span>Payment: <span className='font-medium'>{o.payment_status || '—'}</span></span>
              </div>
              <div className='mt-2'>
                {o.delivered ? (
                  <span className='inline-block px-2 py-1 rounded bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 text-xs font-semibold'>Delivered</span>
                ) : (
                  <button
                    className='px-2 py-1 rounded bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 disabled:opacity-60 w-full'
                    disabled={updating}
                    onClick={() => handleDelivered(o._id)}
                  >
                    Mark as Delivered
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default AdminOrders
