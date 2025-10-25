import React from 'react'
import { useSelector } from 'react-redux'
import NoData from '../components/NoData'

const MyOrders = () => {
  const orders = useSelector(state => state.orders.order)

  console.log("order Items",orders)
  return (
    <div>
      <div className='bg-white shadow-md p-3 font-semibold'>
        <h1>Order</h1>
      </div>
        {
          !orders[0] && (
            <NoData/>
          )
        }
        {
          orders.map((order,index)=>{
            return(
              <div key={order._id+index+"order"} className='order rounded p-3 text-sm border mb-3 bg-white max-w-full overflow-hidden'>
                  <div className='flex justify-between items-center mb-2 gap-2 flex-wrap'>
                    <p className='font-semibold truncate max-w-[60vw]'>Order No: {order?.orderId}</p>
                    {order.delivered ? (
                      <span className='inline-block px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-semibold whitespace-nowrap'>Delivered</span>
                    ) : (
                      <span className='inline-block px-2 py-1 rounded bg-yellow-100 text-yellow-700 text-xs font-semibold whitespace-nowrap'>Not Delivered</span>
                    )}
                  </div>
                  <div className='flex gap-3 items-center w-full'>
                    <img
                      src={order.product_details.image[0]}
                      className='w-14 h-14 rounded object-cover border flex-shrink-0'
                      alt={order.product_details.name}
                    />
                    <div className='min-w-0'>
                      <p className='font-medium truncate max-w-[50vw]'>{order.product_details.name}</p>
                      <p className='text-xs text-neutral-500'>Qty: {order.quantity}</p>
                    </div>
                  </div>
              </div>
            )
          })
        }
    </div>
  )
}

export default MyOrders
