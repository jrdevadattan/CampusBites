import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const Success = () => {
  const location = useLocation()
    
    console.log("location",)  
  return (
  <div className='m-2 w-full max-w-md bg-primary-100/20 p-4 py-5 rounded mx-auto flex flex-col justify-center items-center gap-5'>
    <p className='text-primary-200 font-bold text-lg text-center'>{Boolean(location?.state?.text) ? location?.state?.text : "Payment" } Successfully</p>
    <Link to="/" className="border border-primary-200 text-primary-200 hover:bg-primary-200 hover:text-white transition-all px-4 py-1">Go To Home</Link>
    </div>
  )
}

export default Success
