import React, { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { useLocation, useNavigate } from 'react-router-dom';

const OtpVerification = () => {
    const [data, setData] = useState(["","","","","",""])
    const [loading, setLoading] = useState(false)
    const [resendLoading, setResendLoading] = useState(false)
    const [timer, setTimer] = useState(60)
    const [canResend, setCanResend] = useState(false)
    const navigate = useNavigate()
    const inputRef = useRef([])
    const location = useLocation()

    // FIXED: Get email and name from location state or localStorage
    const email = location.state?.email || localStorage.getItem('verificationEmail')
    const name = location.state?.name || 'User'

    console.log("location",location)

    useEffect(()=>{
        if(!email){
            navigate("/register")
        }
    },[email])

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer((prev) => prev - 1)
            }, 1000)
            return () => clearInterval(interval)
        } else {
            setCanResend(true)
        }
    }, [timer])

    const valideValue = data.every(el => el)

    const handleSubmit = async(e)=>{
        e.preventDefault()

        if (data.join("").length !== 6) {
            toast.error('Please enter valid 6-digit OTP')
            return
        }

        try {
            setLoading(true)
            // FIXED: Use correct API endpoint for email verification
            const response = await Axios({
                ...SummaryApi.verifyEmail,
                data : {
                    otp : data.join(""),
                    email : email
                }
            })
            
            if(response.data.error){
                toast.error(response.data.message)
            }

            if(response.data.success){
                toast.success(response.data.message)
                setData(["","","","","",""])
                // FIXED: Navigate to login after email verification
                localStorage.removeItem('verificationEmail')
                navigate("/login")
            }

        } catch (error) {
            console.log('error',error)
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    const handleResendOtp = async () => {
        try {
            setResendLoading(true)
            
            const response = await Axios({
                ...SummaryApi.resendVerifyEmail,
                data: {
                    email: email
                }
            })

            if (response.data.success) {
                toast.success(response.data.message)
                setTimer(60)
                setCanResend(false)
                setData(["","","","","",""])
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setResendLoading(false)
        }
    }

    const handleChange = (e,index) => {
        const value = e.target.value
        const newData = [...data]
        newData[index] = value
        setData(newData)

        if(value && index < 5){
            inputRef.current[index+1].focus()
        }
    }

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60)
        const remainingSeconds = seconds % 60
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
    }

    return (
        <section className='w-full container mx-auto px-2'>
            <div className='bg-white my-4 w-full max-w-lg mx-auto rounded p-7'>
                <div className='text-center mb-6'>
                    <h2 className='text-2xl font-semibold text-gray-800 mb-2'>
                        Verify Email
                    </h2>
                    <p className='text-gray-600'>
                        Hi {name}! We've sent 6-digit verification code to
                    </p>
                    <p className='font-semibold text-green-700'>{email}</p>
                </div>

                <form onSubmit={handleSubmit} className='grid gap-4'>
                    <div className='grid gap-1'>
                        <label htmlFor='otp' className='text-center'>
                            Enter Verification Code:
                        </label>
                        <div className='flex items-center gap-2 justify-between mt-3'>
                            {
                                data.map((element,index)=>{
                                    return(
                                        <input
                                            key={"otp"+index}
                                            type='text'
                                            id='otp'
                                            ref={(ref)=>{
                                                inputRef.current[index] = ref
                                                return ref 
                                            }}
                                            value={data[index]}
                                            onChange={(e)=>handleChange(e,index)}
                                            maxLength={1}
                                            className='bg-blue-50 w-full max-w-16 p-2 border rounded outline-none focus:border-primary-200 text-center font-semibold'
                                        />
                                    )
                                })
                            }
                        </div>
                        <p className='text-sm text-gray-500 text-center'>
                            {data.join("").length}/6 digits
                        </p>
                    </div>
             
                    <button 
                        type='submit'
                        disabled={!valideValue || loading} 
                        className={` ${valideValue && !loading ? "bg-green-800 hover:bg-green-700" : "bg-gray-500" }    text-white py-2 rounded font-semibold my-3 tracking-wide`}
                    >
                        {loading ? 'Verifying...' : 'Verify Email'}
                    </button>
                </form>

                <div className='text-center mt-6'>
                    <p className='text-gray-600 mb-3'>
                        Didn't receive code?
                    </p>
                    
                    {canResend ? (
                        <button
                            onClick={handleResendOtp}
                            disabled={resendLoading}
                            className='text-green-700 hover:text-green-800 font-semibold underline disabled:opacity-50'
                        >
                            {resendLoading ? 'Sending...' : 'Resend Code'}
                        </button>
                    ) : (
                        <p className='text-gray-500'>
                            Resend code in {formatTime(timer)}
                        </p>
                    )}
                </div>

                <div className='text-center mt-4'>
                    <button
                        onClick={() => {
                            localStorage.removeItem('verificationEmail')
                            navigate('/register')
                        }}
                        className='text-blue-600 hover:text-blue-800 text-sm underline'
                    >
                        Back to Registration
                    </button>
                </div>
            </div>
        </section>
    )
}

export default OtpVerification



