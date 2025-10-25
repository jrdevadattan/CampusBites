import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import AddAddress from '../components/AddAddress'
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import EditAddressDetails from '../components/EditAddressDetails';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';
import { useGlobalContext } from '../provider/GlobalProvider';

const Address = () => {
  const addressList = useSelector(state => state.addresses.addressList)
  const [openAddress,setOpenAddress] = useState(false)
  const [OpenEdit,setOpenEdit] = useState(false)
  const [editData,setEditData] = useState({})
  const { fetchAddress} = useGlobalContext()

  const handleDisableAddress = async(id)=>{
    try {
      const response = await Axios({
        ...SummaryApi.disableAddress,
        data : {
          _id : id
        }
      })
      if(response.data.success){
        toast.success("Address Remove")
        if(fetchAddress){
          fetchAddress()
        }
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }
  return (
    <div className=''>
        <div className='bg-white shadow-lg px-2 py-2 flex justify-between gap-4 items-center '>
            <h2 className='font-semibold text-ellipsis line-clamp-1'>Address</h2>
            <button onClick={()=>setOpenAddress(true)} className='border border-primary-200 text-primary-200 px-3 hover:bg-primary-200 hover:text-black py-1 rounded-full'>
                Add Address
            </button>
        </div>
        <div className='bg-blue-50 p-2 grid gap-4'>
              {
                addressList.map((address,index)=>{
                  return(
                      <div key={address?._id || `addr-${index}`} className={`border rounded p-3 flex gap-3 bg-white ${!address.status && 'hidden'}`}>
                          <div className='w-full'>
                            <p><strong>Hostel:</strong> {address.hostelName}</p>
                            <p><strong>Room:</strong> {address.roomNumber}</p>
                            <p><strong>Mobile:</strong> {address.mobile}</p>
                          </div>
                          <div className=' grid gap-2'>
                            <button onClick={()=>{
                              setOpenEdit(true)
                              setEditData(address)
                            }} className='p-2 rounded-md bg-green-100 hover:bg-green-200 text-green-600 dark:bg-green-900/40 dark:hover:bg-green-800/60 dark:text-green-400'>
                              <MdEdit/>
                            </button>
                            <button onClick={()=>
                              handleDisableAddress(address._id)
                            } className='p-2 rounded-md bg-red-100 hover:bg-red-200 text-red-600 dark:bg-red-900/40 dark:hover:bg-red-800/60 dark:text-red-400'>
                              <MdDelete size={20}/>  
                            </button>
                          </div>
                      </div>
                  )
                })
              }
              <div onClick={()=>setOpenAddress(true)} className='h-16 bg-blue-50 border-2 border-dashed flex justify-center items-center cursor-pointer'>
                Add address
              </div>
        </div>

        {
          openAddress && (
            <AddAddress close={()=>setOpenAddress(false)}/>
          )
        }

        {
          OpenEdit && (
            <EditAddressDetails data={editData} close={()=>setOpenEdit(false)}/>
          )
        }
    </div>
  )
}

export default Address
