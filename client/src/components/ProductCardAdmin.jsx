import React, { useState } from 'react'
import EditProductAdmin from './EditProductAdmin'
import CofirmBox from './CofirmBox'
import { IoClose } from 'react-icons/io5'
import { FaPlus, FaMinus } from 'react-icons/fa'
import SummaryApi from '../common/SummaryApi'
import Axios from '../utils/Axios'
import AxiosToastError from '../utils/AxiosToastError'
import toast from 'react-hot-toast'

const ProductCardAdmin = ({ data, fetchProductData }) => {
  const [editOpen,setEditOpen]= useState(false)
  const [openDelete,setOpenDelete] = useState(false)
  const [stockAmount, setStockAmount] = useState(10)

  const handleDeleteCancel  = ()=>{
      setOpenDelete(false)
  }

  const handleDelete = async()=>{
    try {
      const response = await Axios({
        ...SummaryApi.deleteProduct,
        data : {
          _id : data._id
        }
      })

      const { data : responseData } = response

      if(responseData.success){
          toast.success(responseData.message)
          if(fetchProductData){
            fetchProductData()
          }
          setOpenDelete(false)
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  const handleStockUpdate = async(increment = true) => {
    try {
      const newStock = increment ? data.stock + stockAmount : Math.max(0, data.stock - stockAmount)
      
      const response = await Axios({
        ...SummaryApi.updateProductDetails,
        data: {
          _id: data._id,
          stock: newStock
        }
      })

      const { data: responseData } = response

      if(responseData.success){
        toast.success(`Stock ${increment ? 'increased' : 'decreased'} by ${stockAmount}`)
        if(fetchProductData){
          fetchProductData()
        }
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }
  return (
    <div className='w-36 p-4 bg-white dark:bg-neutral-900 rounded border-2 border-transparent hover:border-primary-200 dark:hover:border-primary-100 shadow-md hover:shadow-xl transition-all duration-300'>
        <div>
            <img
               src={data?.image[0]}  
               alt={data?.name}
               className='w-full h-full object-scale-down'
            />
        </div>
  <p className='text-ellipsis line-clamp-2 font-medium dark:text-white'>{data?.name}</p>
  <p className='text-xs mt-1 text-blue-600 dark:text-blue-300'>Stock left: <span className={data?.stock === 0 ? 'text-red-500 dark:text-red-400 font-semibold' : ''}>{data?.stock}</span></p>
        
        {/* Stock Management */}
        <div className='flex items-center gap-1 my-2 bg-slate-100 dark:bg-neutral-800 p-1 rounded'>
          <button 
            onClick={(e) => {e.stopPropagation(); handleStockUpdate(false)}} 
            className='p-1 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800/60 rounded transition-colors'
            title='Decrease stock'
          >
            <FaMinus size={10}/>
          </button>
          <input 
            type='number' 
            value={stockAmount} 
            onChange={(e) => setStockAmount(Math.max(1, parseInt(e.target.value) || 1))}
            onClick={(e) => e.stopPropagation()}
            className='w-full text-center text-xs bg-transparent dark:text-white outline-none'
            min='1'
          />
          <button 
            onClick={(e) => {e.stopPropagation(); handleStockUpdate(true)}} 
            className='p-1 bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-800/60 rounded transition-colors'
            title='Increase stock'
          >
            <FaPlus size={10}/>
          </button>
        </div>

        <div className='grid grid-cols-2 gap-3 py-2'>
          <button onClick={(e) => {e.stopPropagation(); setEditOpen(true)}} className='border px-1 py-1 text-sm border-green-600 bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-800/60 rounded transition-colors'>Edit</button>
          <button onClick={(e) => {e.stopPropagation(); setOpenDelete(true)}} className='border px-1 py-1 text-sm border-red-600 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800/60 rounded transition-colors'>Delete</button>
        </div>

        {
          editOpen && (
            <EditProductAdmin fetchProductData={fetchProductData} data={data} close={()=>setEditOpen(false)}/>
          )
        }

        {
          openDelete && (
            <section className='fixed top-0 left-0 right-0 bottom-0 bg-neutral-600 dark:bg-neutral-900 z-50 bg-opacity-70 dark:bg-opacity-80 p-4 flex justify-center items-center '>
                <div className='bg-white dark:bg-neutral-800 p-4 w-full max-w-md rounded-md'>
                    <div className='flex items-center justify-between gap-4'>
                        <h3 className='font-semibold dark:text-white'>Permanent Delete</h3>
                        <button onClick={()=>setOpenDelete(false)} className='dark:text-white'>
                          <IoClose size={25}/>
                        </button>
                    </div>
                    <p className='my-2 dark:text-neutral-200'>Are you sure want to delete permanent ?</p>
                    <div className='flex justify-end gap-5 py-4'>
                      <button onClick={handleDeleteCancel} className='border px-3 py-1 rounded bg-red-100 dark:bg-red-900/40 border-red-500 text-red-500 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800/60 transition-colors'>Cancel</button>
                      <button onClick={handleDelete} className='border px-3 py-1 rounded bg-green-100 dark:bg-green-900/40 border-green-500 text-green-500 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-800/60 transition-colors'>Delete</button>
                    </div>
                </div>
            </section>
          )
        }
    </div>
  )
}

export default ProductCardAdmin
