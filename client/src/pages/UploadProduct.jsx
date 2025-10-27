import React, { useState } from 'react'
import { FaCloudUploadAlt } from "react-icons/fa";
import uploadImage from '../utils/UploadImage';
import Loading from '../components/Loading';
import ViewImage from '../components/ViewImage';
import { MdDelete } from "react-icons/md";
import { useSelector } from 'react-redux'
import { IoClose } from "react-icons/io5";
import AddFieldComponent from '../components/AddFieldComponent';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import successAlert from '../utils/SuccessAlert';
import { useEffect } from 'react';

const UploadProduct = () => {
  const [data,setData] = useState({
      name : "",
      image : [],
      category : [],
      subCategory : [],
      stock : "",
      price : "",
      discount : "",
      discountedPrice : "",
      description : "",
      more_details : {},
  })
  const [imageLoading,setImageLoading] = useState(false)
  const [ViewImageURL,setViewImageURL] = useState("")
  const allCategory = useSelector(state => state.product.allCategory)
  const [selectCategory,setSelectCategory] = useState("")
  const [selectSubCategory,setSelectSubCategory] = useState("")
  const allSubCategory = useSelector(state => state.product.allSubCategory)

  const [openAddField,setOpenAddField] = useState(false)
  const [fieldName,setFieldName] = useState("")


  const handleChange = (e)=>{
    const { name, value} = e.target 

    setData((preve)=>{
      const updatedData = {
          ...preve,
          [name]  : value
      }
      
      // Calculate discount percentage when price or discounted price changes
      if (name === 'price' || name === 'discountedPrice') {
        const price = name === 'price' ? Number(value) : Number(preve.price)
        const discountedPrice = name === 'discountedPrice' ? Number(value) : Number(preve.discountedPrice)
        
        if (price && discountedPrice && discountedPrice < price) {
          const discountPercentage = Math.round(((price - discountedPrice) / price) * 100)
          updatedData.discount = discountPercentage
        } else if (price && discountedPrice && discountedPrice >= price) {
          updatedData.discount = 0
        }
      }
      
      return updatedData
    })
  }

  const handleUploadImage = async(e)=>{
    const file = e.target.files[0]

    if(!file){
      return 
    }
    setImageLoading(true)
    const response = await uploadImage(file)
    const { data : ImageResponse } = response
    const imageUrl = ImageResponse.data.url 

    setData((preve)=>{
      return{
        ...preve,
        image : [...preve.image,imageUrl]
      }
    })
    setImageLoading(false)

  }

  const handleDeleteImage = async(index)=>{
      data.image.splice(index,1)
      setData((preve)=>{
        return{
            ...preve
        }
      })
  }

  const handleRemoveCategory = async(index)=>{
    data.category.splice(index,1)
    setData((preve)=>{
      return{
        ...preve
      }
    })
  }
  const handleRemoveSubCategory = async(index)=>{
      data.subCategory.splice(index,1)
      setData((preve)=>{
        return{
          ...preve
        }
      })
  }

  const handleAddField = ()=>{
    setData((preve)=>{
      return{
          ...preve,
          more_details : {
            ...preve.more_details,
            [fieldName] : ""
          }
      }
    })
    setFieldName("")
    setOpenAddField(false)
  }

  const handleSubmit = async(e)=>{
    e.preventDefault()
    console.log("data",data)

    // Prepare payload in the shape the API expects
    const payload = {
      ...data,
      // API expects arrays of ObjectIds, not full objects
      category: Array.isArray(data.category) ? data.category.map(c => c?._id || c) : [],
      subCategory: Array.isArray(data.subCategory) ? data.subCategory.map(sc => sc?._id || sc) : [],
      // Ensure numeric fields are numbers
      stock: data.stock === "" ? null : Number(data.stock),
      price: data.price === "" ? null : Number(data.price),
      discount: data.discount === "" ? null : Number(data.discount)
    }

    try {
      const response = await Axios({
          ...SummaryApi.createProduct,
          data : payload
      })
      const { data : responseData} = response

      if(responseData.success){
          successAlert(responseData.message)
          setData({
            name : "",
            image : [],
            category : [],
            subCategory : [],
            stock : "",
            price : "",
            discount : "",
            discountedPrice : "",
            description : "",
            more_details : {},
          })

      }
    } catch (error) {
        AxiosToastError(error)
    }


  }

  // useEffect(()=>{
  //   successAlert("Upload successfully")
  // },[])
  return (
    <section className=''>
        <div className='p-2   bg-white dark:bg-neutral-900 dark:text-white shadow-md flex items-center justify-between'>
            <h2 className='font-semibold'>Upload Product</h2>
        </div>
        <div className='grid p-3'>
            <form className='grid gap-4' onSubmit={handleSubmit}>
                <div className='grid gap-1'>
                  <label htmlFor='name' className='font-medium dark:text-white'>Name</label>
                  <input 
                    id='name'
                    type='text'
                    placeholder='Enter product name'
                    name='name'
                    value={data.name}
                    onChange={handleChange}
                    required
                    className='bg-blue-50 dark:bg-neutral-800 dark:text-white dark:placeholder-neutral-400 p-2 outline-none border dark:border-neutral-700 focus-within:border-primary-200 dark:focus-within:border-primary-200 rounded'
                  />
                </div>
                <div className='grid gap-1'>
                  <label htmlFor='description' className='font-medium dark:text-white'>Description</label>
                  <textarea 
                    id='description'
                    type='text'
                    placeholder='Enter product description'
                    name='description'
                    value={data.description}
                    onChange={handleChange}
                    required
                    multiple 
                    rows={3}
                    className='bg-blue-50 dark:bg-neutral-800 dark:text-white dark:placeholder-neutral-400 p-2 outline-none border dark:border-neutral-700 focus-within:border-primary-200 dark:focus-within:border-primary-200 rounded resize-none'
                  />
                </div>
                <div>
                    <p className='font-medium dark:text-white'>Image</p>
                    <div>
                      <label htmlFor='productImage' className='bg-blue-50 dark:bg-neutral-800 dark:text-white h-24 border dark:border-neutral-700 rounded flex justify-center items-center cursor-pointer'>
                          <div className='text-center flex justify-center items-center flex-col'>
                            {
                              imageLoading ?  <Loading/> : (
                                <>
                                   <FaCloudUploadAlt size={35}/>
                                   <p>Upload Image</p>
                                </>
                              )
                            }
                          </div>
                          <input 
                            type='file'
                            id='productImage'
                            className='hidden'
                            accept='image/*'
                            onChange={handleUploadImage}
                          />
                      </label>
                      {/**display uploded image*/}
                      <div className='flex flex-wrap gap-4'>
                        {
                          data.image.map((img,index) =>{
                              return(
                                <div key={img+index} className='h-20 mt-1 w-20 min-w-20 bg-blue-50 dark:bg-neutral-800 border dark:border-neutral-700 relative group'>
                                  <img
                                    src={img}
                                    alt={img}
                                    className='w-full h-full object-scale-down cursor-pointer' 
                                    onClick={()=>setViewImageURL(img)}
                                  />
                                  <div onClick={()=>handleDeleteImage(index)} className='absolute bottom-0 right-0 p-1 bg-red-600 hover:bg-red-600 rounded text-white hidden group-hover:block cursor-pointer'>
                                    <MdDelete/>
                                  </div>
                                </div>
                              )
                          })
                        }
                      </div>
                    </div>

                </div>
                <div className='grid gap-1'>
                  <label className='font-medium dark:text-white'>Category</label>
                  <div>
                    <select
                      className='bg-blue-50 dark:bg-neutral-800 dark:text-white border dark:border-neutral-700 w-full p-2 rounded'
                      value={selectCategory}
                      onChange={(e)=>{
                        const value = e.target.value 
                        const category = allCategory.find(el => el._id === value )
                        if(!category) return setSelectCategory("")
                        setData((preve)=>{
                          const exists = preve.category.some(c => (c?._id || c) === category._id)
                          return exists ? preve : {
                            ...preve,
                            category : [...preve.category,category],
                          }
                        })
                        setSelectCategory("")
                      }}
                    >
                      <option value={""}>Select Category</option>
                      {
                        allCategory.map((c,index)=>{
                          return(
                            <option key={c?._id || index} value={c?._id}>{c.name}</option>
                          )
                        })
                      }
                    </select>
                    <div className='flex flex-wrap gap-3'>
                      {
                        data.category.map((c,index)=>{
                          return(
                            <div key={c._id+index+"productsection"} className='text-sm flex items-center gap-1 bg-blue-50 dark:bg-neutral-800 dark:text-white mt-2'>
                              <p>{c.name}</p>
                              <div className='hover:text-red-500 cursor-pointer' onClick={()=>handleRemoveCategory(index)}>
                                <IoClose size={20}/>
                              </div>
                            </div>
                          )
                        })
                      }
                    </div>
                  </div>
                </div>
                <div className='grid gap-1'>
                  <label className='font-medium dark:text-white'>Sub Category</label>
                  <div>
                    <select
                      className='bg-blue-50 dark:bg-neutral-800 dark:text-white border dark:border-neutral-700 w-full p-2 rounded'
                      value={selectSubCategory}
                      onChange={(e)=>{
                        const value = e.target.value 
                        const subCategory = allSubCategory.find(el => el._id === value )
                        if(!subCategory) return setSelectSubCategory("")
                        setData((preve)=>{
                          const exists = preve.subCategory.some(sc => (sc?._id || sc) === subCategory._id)
                          return exists ? preve : {
                            ...preve,
                            subCategory : [...preve.subCategory,subCategory]
                          }
                        })
                        setSelectSubCategory("")
                      }}
                    >
                      <option value={""} className='text-neutral-600'>Select Sub Category</option>
                      {
                        allSubCategory.map((c,index)=>{
                          return(
                            <option key={c?._id || index} value={c?._id}>{c.name}</option>
                          )
                        })
                      }
                    </select>
                    <div className='flex flex-wrap gap-3'>
                      {
                        data.subCategory.map((c,index)=>{
                          return(
                            <div key={c._id+index+"productsection"} className='text-sm flex items-center gap-1 bg-blue-50 dark:bg-neutral-800 dark:text-white mt-2'>
                              <p>{c.name}</p>
                              <div className='hover:text-red-500 cursor-pointer' onClick={()=>handleRemoveSubCategory(index)}>
                                <IoClose size={20}/>
                              </div>
                            </div>
                          )
                        })
                      }
                    </div>
                  </div>
                </div>

                <div className='grid gap-1'>
                  <label htmlFor='stock' className='font-medium dark:text-white'>Number of Stock</label>
                  <input 
                    id='stock'
                    type='number'
                    placeholder='Enter product stock'
                    name='stock'
                    value={data.stock}
                    onChange={handleChange}
                    required
                    className='bg-blue-50 dark:bg-neutral-800 dark:text-white dark:placeholder-neutral-400 p-2 outline-none border dark:border-neutral-700 focus-within:border-primary-200 dark:focus-within:border-primary-200 rounded'
                  />
                </div>

                <div className='grid gap-1'>
                  <label htmlFor='price' className='font-medium dark:text-white'>Price</label>
                  <input 
                    id='price'
                    type='number'
                    placeholder='Enter product price'
                    name='price'
                    value={data.price}
                    onChange={handleChange}
                    required
                    className='bg-blue-50 dark:bg-neutral-800 dark:text-white dark:placeholder-neutral-400 p-2 outline-none border dark:border-neutral-700 focus-within:border-primary-200 dark:focus-within:border-primary-200 rounded'
                  />
                </div>

                <div className='grid gap-1'>
                  <div className='flex items-center justify-between'>
                    <label htmlFor='discountedPrice' className='font-medium dark:text-white'>Discounted Price</label>
                    {data.discount > 0 && (
                      <span className='text-sm text-green-600 dark:text-green-400 font-medium'>
                        {data.discount}% OFF
                      </span>
                    )}
                  </div>
                  <input 
                    id='discountedPrice'
                    type='number'
                    placeholder='Enter discounted price'
                    name='discountedPrice'
                    value={data.discountedPrice}
                    onChange={handleChange}
                    className='bg-blue-50 dark:bg-neutral-800 dark:text-white dark:placeholder-neutral-400 p-2 outline-none border dark:border-neutral-700 focus-within:border-primary-200 dark:focus-within:border-primary-200 rounded'
                  />
                  {data.price && data.discountedPrice && Number(data.discountedPrice) >= Number(data.price) && (
                    <p className='text-red-500 text-sm'>Discounted price should be less than original price</p>
                  )}
                </div>


                {/**add more field**/}
                  {
                    Object?.keys(data?.more_details)?.map((k,index)=>{
                        return(
                          <div className='grid gap-1'>
                            <label htmlFor={k} className='font-medium dark:text-white'>{k}</label>
                            <input 
                              id={k}
                              type='text'
                              value={data?.more_details[k]}
                              onChange={(e)=>{
                                  const value = e.target.value 
                                  setData((preve)=>{
                                    return{
                                        ...preve,
                                        more_details : {
                                          ...preve.more_details,
                                          [k] : value
                                        }
                                    }
                                  })
                              }}
                              required
                              className='bg-blue-50 dark:bg-neutral-800 dark:text-white dark:placeholder-neutral-400 p-2 outline-none border dark:border-neutral-700 focus-within:border-primary-200 dark:focus-within:border-primary-200 rounded'
                            />
                          </div>
                        )
                    })
                  }

                <div onClick={()=>setOpenAddField(true)} className='hover:bg-primary-200 dark:hover:bg-primary-100 bg-white dark:bg-neutral-800 dark:text-white py-1 px-3 w-32 text-center font-semibold border border-primary-200 dark:border-primary-100 hover:text-neutral-900 dark:hover:text-black cursor-pointer rounded'>
                  Add Fields
                </div>

                <button
                  className='bg-primary-100 hover:bg-primary-200 py-2 rounded font-semibold'
                >
                  Submit
                </button>
            </form>
        </div>

        {
          ViewImageURL && (
            <ViewImage url={ViewImageURL} close={()=>setViewImageURL("")}/>
          )
        }

        {
          openAddField && (
            <AddFieldComponent 
              value={fieldName}
              onChange={(e)=>setFieldName(e.target.value)}
              submit={handleAddField}
              close={()=>setOpenAddField(false)} 
            />
          )
        }
    </section>
  )
}

export default UploadProduct
