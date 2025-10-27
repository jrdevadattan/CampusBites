import React from 'react'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { Link } from 'react-router-dom'
import { valideURLConvert } from '../utils/valideURLConvert'
import { pricewithDiscount } from '../utils/PriceWithDiscount'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import toast from 'react-hot-toast'
import { useState } from 'react'
import { useGlobalContext } from '../provider/GlobalProvider'
import AddToCartButton from './AddToCartButton'

const CardProduct = ({data}) => {
    const url = `/product/${valideURLConvert(data.name)}-${data._id}`
    const [loading,setLoading] = useState(false)
  
  return (
    <Link to={url} className='border dark:border-neutral-700 py-2 lg:p-4 grid gap-1 lg:gap-3 min-w-36 lg:min-w-52 rounded cursor-pointer bg-white dark:bg-neutral-800 hover:shadow-lg transition-shadow relative' >
      {
        Boolean(data.discount) && (
          <div className='absolute top-2 left-2 bg-green-600 text-white px-2 py-1 rounded-md text-xs font-semibold z-10'>
            {data.discount}% OFF
          </div>
        )
      }
      <div className='min-h-20 w-full max-h-24 lg:max-h-32 rounded overflow-hidden'>
            <img 
                src={data.image[0]}
                className='w-full h-full object-scale-down lg:scale-125'
            />
      </div>
      <div className='px-2 lg:px-0 font-medium text-ellipsis text-sm lg:text-base line-clamp-2 dark:text-white'>
        {data.name}
      </div>
      <div className='w-fit gap-1 px-2 lg:px-0 text-sm lg:text-base dark:text-neutral-300'>
        {data.unit} 
        
      </div>

      <div className='px-2 lg:px-0 flex items-center justify-between gap-1 lg:gap-3 text-sm lg:text-base'>
        <div className='flex flex-col gap-1'>
          <div className='flex items-center gap-2'>
            <div className='font-semibold dark:text-white'>
                {DisplayPriceInRupees(pricewithDiscount(data.price,data.discount))} 
            </div>
            {
              Boolean(data.discount) && (
                <div className='text-neutral-400 dark:text-neutral-500 line-through text-xs'>
                  {DisplayPriceInRupees(data.price)}
                </div>
              )
            }
          </div>
        </div>
        <div className=''>
          {
            data.stock == 0 ? (
              <p className='text-red-500 dark:text-red-400 text-sm text-center'>Out of stock</p>
            ) : (
              <AddToCartButton data={data} />
            )
          }
            
        </div>
      </div>

    </Link>
  )
}

export default CardProduct
