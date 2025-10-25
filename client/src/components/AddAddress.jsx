import React from 'react'
import { useForm } from "react-hook-form"
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import { IoClose } from "react-icons/io5";
import { useGlobalContext } from '../provider/GlobalProvider'

const AddAddress = ({close}) => {
    const { register, handleSubmit,reset } = useForm()
    const { fetchAddress } = useGlobalContext()

    const onSubmit = async(data)=>{
        console.log("data",data)
    
        try {
            const response = await Axios({
                ...SummaryApi.createAddress,
                data : {
                    hostelName : data.hostelName,
                    roomNumber : data.roomNumber,
                    mobile : data.mobile
                }
            })

            const { data : responseData } = response
            
            if(responseData.success){
                toast.success(responseData.message)
                if(close){
                    close()
                    reset()
                    fetchAddress()
                }
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }
  return (
    <section className='bg-black fixed top-0 left-0 right-0 bottom-0 z-50 bg-opacity-70 h-screen overflow-auto'>
        <div className='bg-white p-4 w-full max-w-lg mt-8 mx-auto rounded'>
            <div className='flex justify-between items-center gap-4'>
                <h2 className='font-semibold'>Add Address</h2>
                <button onClick={close} className='hover:text-red-500'>
                    <IoClose  size={25}/>
                </button>
            </div>
            <form className='mt-4 grid gap-4' onSubmit={handleSubmit(onSubmit)}>
                <div className='grid gap-1'>
                    <label htmlFor='hostelName'>Hostel Name :</label>
                    <input
                        type='text'
                        id='hostelName' 
                        className='border bg-blue-50 p-2 rounded'
                        {...register("hostelName",{required : true})}
                    />
                </div>
                <div className='grid gap-1'>
                    <label htmlFor='roomNumber'>Room Number :</label>
                    <input
                        type='text'
                        id='roomNumber' 
                        className='border bg-blue-50 p-2 rounded'
                        {...register("roomNumber",{required : true})}
                    />
                </div>
                <div className='grid gap-1'>
                    <label htmlFor='mobile'>Mobile No. :</label>
                    <input
                        type='text'
                        id='mobile' 
                        className='border bg-blue-50 p-2 rounded'
                        {...register("mobile",{required : true})}
                    />
                </div>

                <button type='submit' className='bg-primary-200 w-full  py-2 font-semibold mt-4 hover:bg-primary-100'>Submit</button>
            </form>
        </div>
    </section>
  )
}

export default AddAddress
