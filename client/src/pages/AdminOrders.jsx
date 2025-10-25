import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import Loading from '../components/Loading'
import NoData from '../components/NoData'

const AdminOrders = () => {
  const user = useSelector(state => state.user)
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState([])

  useEffect(() => {
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

    if (user?._id && user?.role === 'ADMIN') {
      fetchAll()
    } else {
      setLoading(false)
    }
  }, [user?._id, user?.role])

  if (loading) return <Loading />

  if (!orders?.length) return (
    <div className='p-4'>
      <h2 className='text-lg font-semibold mb-3'>All Orders</h2>
      <NoData />
    </div>
  )

  return (
    <div className='p-4'>
      <h2 className='text-lg font-semibold mb-3'>All Orders</h2>
      <div className='overflow-x-auto rounded border'>
        <table className='w-full text-sm'>
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
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminOrders
