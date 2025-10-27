import React, { useEffect, useState } from 'react'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import Loading from '../components/Loading'
import ProductCardAdmin from '../components/ProductCardAdmin'
import { IoSearchOutline } from "react-icons/io5";
import EditProductAdmin from '../components/EditProductAdmin'
import { sortProductsByStock } from '../utils/sortProductsByStock'

const ProductAdmin = () => {
  const [productData,setProductData] = useState([])
  const [page,setPage] = useState(1)
  const [loading,setLoading] = useState(false)
  const [totalPageCount,setTotalPageCount] = useState(1)
  const [search,setSearch] = useState("")
  
  const fetchProductData = async()=>{
    try {
        setLoading(true)
        const response = await Axios({
           ...SummaryApi.getProduct,
           data : {
              page : page,
              limit : 12,
              search : search 
           }
        })

        const { data : responseData } = response 

        if(responseData.success){
          setTotalPageCount(responseData.totalNoPage)
          const sortedData = sortProductsByStock(responseData.data)
          setProductData(sortedData)
        }

    } catch (error) {
      AxiosToastError(error)
    }finally{
      setLoading(false)
    }
  }
  
  useEffect(()=>{
    fetchProductData()
  },[page])

  const handleNext = ()=>{
    if(page !== totalPageCount){
      setPage(preve => preve + 1)
    }
  }
  const handlePrevious = ()=>{
    if(page > 1){
      setPage(preve => preve - 1)
    }
  }

  const handleOnChange = (e)=>{
    const { value } = e.target
    setSearch(value)
    setPage(1)
  }

  useEffect(()=>{
    let flag = true 

    const interval = setTimeout(() => {
      if(flag){
        fetchProductData()
        flag = false
      }
    }, 300);

    return ()=>{
      clearTimeout(interval)
    }
  },[search])
  
  return (
    <section className=''>
        <div className='p-2  bg-white dark:bg-neutral-900 dark:text-white shadow-md flex items-center justify-between gap-4'>
                <h2 className='font-semibold'>Product</h2>
                <div className='h-full min-w-24 max-w-56 w-full ml-auto bg-blue-50 dark:bg-neutral-800 px-4 flex items-center gap-3 py-2 rounded border dark:border-neutral-700 focus-within:border-primary-200 dark:focus-within:border-primary-200'>
                  <IoSearchOutline size={25} className='dark:text-neutral-300'/>
                  <input
                    type='text'
                    placeholder='Search product here ...' 
                    className='h-full w-full outline-none bg-transparent dark:text-white dark:placeholder-neutral-400'
                    value={search}
                    onChange={handleOnChange}
                  />
                </div>
        </div>
        {
          loading && (
            <Loading/>
          )
        }


        <div className='p-4 bg-blue-50 dark:bg-neutral-950'>


            <div className='min-h-[55vh]'>
              <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4'>
                {
                  productData.map((p,index)=>{
                    return(
                      <ProductCardAdmin key={p._id || index} data={p} fetchProductData={fetchProductData}  />
                    )
                  })
                }
              </div>
            </div>
            
            <div className='flex justify-between my-4'>
              <button onClick={handlePrevious} className="border border-primary-200 dark:border-primary-100 px-4 py-1 hover:bg-primary-200 dark:hover:bg-primary-100 dark:text-white dark:hover:text-black transition-colors">Previous</button>
              <button className='w-full bg-slate-100 dark:bg-slate-800 dark:text-white'>{page}/{totalPageCount}</button>
              <button onClick={handleNext} className="border border-primary-200 dark:border-primary-100 px-4 py-1 hover:bg-primary-200 dark:hover:bg-primary-100 dark:text-white dark:hover:text-black transition-colors">Next</button>
            </div>

        </div>
          

      
    </section>
  )
}

export default ProductAdmin
