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
      <h2 className='text-lg font-semibold mb-3'>All Orders</h2>
      <div className='overflow-x-auto rounded border bg-white'>
        <table className='w-full text-xs sm:text-sm min-w-[700px]'>
          <thead className='bg-blue-50'>
            <tr>
              <th className='text-left p-2 border-b'>Date</th>
              <th className='text-left p-2 border-b'>Order ID</th>
              <th className='text-left p-2 border-b'>Customer</th>
              <th className='text-left p-2 border-b'>Contact</th>
              <th className='text-left p-2 border-b'>Address</th>
              <th className='text-left p-2 border-b'>Product</th>
              <th className='text-right p-2 border-b'>Qty</th>
              <th className='text-right p-2 border-b'>Total</th>
              <th className='text-left p-2 border-b'>Payment</th>
              <th className='text-center p-2 border-b'>Delivered</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => {
              const d = new Date(o.createdAt)
              const customer = o.userId || {}
              const addr = o.delivery_address || {}
              const prod = o.product_details || {}
              return (
                <tr key={o._id} className='hover:bg-blue-50/40'>
                  <td className='p-2 border-b whitespace-nowrap'>{d.toLocaleString()}</td>
                  <td className='p-2 border-b whitespace-nowrap'>{o.orderId}</td>
                  <td className='p-2 border-b'>
                    <div className='font-medium'>{customer.name || '—'}</div>
                    <div className='text-xs text-neutral-500'>{customer.email || '—'}</div>
                  </td>
                  <td className='p-2 border-b whitespace-nowrap'>{customer.mobile || addr.mobile || '—'}</td>
                  <td className='p-2 border-b'>
                    <div>Hostel: {addr.hostelName || '—'}</div>
                    <div>Room: {addr.roomNumber || '—'}</div>
                  </td>
                  <td className='p-2 border-b'>{prod.name || '—'}</td>
                  <td className='p-2 border-b text-right'>{Number(o.quantity || 1)}</td>
                  <td className='p-2 border-b text-right'>₹{Number(o.totalAmt || 0).toFixed(2)}</td>
                  <td className='p-2 border-b'>{o.payment_status || '—'}</td>
                  <td className='p-2 border-b text-center'>
                    {o.delivered ? (
                      <span className='inline-block px-2 py-1 rounded bg-green-100 text-green-700 text-xs'>Delivered</span>
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
      {/* Mobile card view */}
      <div className='sm:hidden flex flex-col gap-3 mt-4'>
        {orders.map((o) => {
          const d = new Date(o.createdAt)
          const customer = o.userId || {}
          const addr = o.delivery_address || {}
          const prod = o.product_details || {}
          return (
            <div key={o._id} className='border rounded p-2 bg-white shadow-sm'>
              <div className='flex justify-between items-center mb-1'>
                <span className='font-semibold'>{prod.name || '—'}</span>
                <span className='text-xs text-neutral-500'>{d.toLocaleString()}</span>
              </div>
              <div className='text-xs mb-1'>Order ID: {o.orderId}</div>
              <div className='text-xs mb-1'>Customer: {customer.name || '—'} ({customer.email || '—'})</div>
              <div className='text-xs mb-1'>Contact: {customer.mobile || addr.mobile || '—'}</div>
              <div className='text-xs mb-1'>Hostel: {addr.hostelName || '—'}, Room: {addr.roomNumber || '—'}</div>
              <div className='text-xs mb-1'>Qty: {Number(o.quantity || 1)}</div>
              <div className='text-xs mb-1'>Total: ₹{Number(o.totalAmt || 0).toFixed(2)}</div>
              <div className='text-xs mb-1'>Payment: {o.payment_status || '—'}</div>
              <div className='mt-2'>
                {o.delivered ? (
                  <span className='inline-block px-2 py-1 rounded bg-green-100 text-green-700 text-xs'>Delivered</span>
                ) : (
                  <button
                    className='px-2 py-1 rounded bg-blue-600 text-white text-xs hover:bg-blue-700 disabled:opacity-60'
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
