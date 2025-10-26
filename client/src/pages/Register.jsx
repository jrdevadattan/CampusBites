import React, { useState } from 'react'
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';

const Register = () => {
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        hostelName: "",
        roomNumber: "",
        mobile: ""
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name, value } = e.target
        setData(prev => ({ ...prev, [name]: value }))
    }

    const valideValue = Object.values(data).every(el => el)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if(data.password !== data.confirmPassword){
            toast.error("Password and confirm password must be same")
            return
        }

        try {
            const response = await Axios({ ...SummaryApi.register, data })
            if(response.data.error){
                toast.error(response.data.message)
                return
            }
            if(response.data.success){
                toast.success(response.data.message)
                setData({
                    name: "", email: "", password: "", confirmPassword: "",
                    hostelName: "", roomNumber: "", mobile: ""
                })
                navigate("/login")
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }

    // Google OAuth handlers
    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const response = await Axios.post('/auth/google-register', {
                token: credentialResponse.credential
            })
            if(response.data.success){
                toast.success("Registered with Google")
                navigate("/login")
            } else {
                toast.error(response.data.message || "Google registration failed")
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }

    const handleGoogleError = () => {
        toast.error("Google registration failed")
    }

    return (
        <section className='w-full container mx-auto px-2'>
            <div className='bg-white dark:bg-neutral-900 my-4 w-full max-w-lg mx-auto rounded p-7'>
                <p className='dark:text-white'>Welcome to CampusBites</p>

                <form className='grid gap-4 mt-6' onSubmit={handleSubmit}>
                    {/* Name */}
                    <div className='grid gap-1'>
                        <label htmlFor='name' className='dark:text-white'>Name :</label>
                        <input
                            type='text'
                            id='name'
                            autoFocus
                            className='bg-blue-50 dark:bg-neutral-800 dark:text-white dark:placeholder-neutral-400 p-2 border dark:border-neutral-700 rounded outline-none focus:border-primary-200 dark:focus:border-primary-200'
                            name='name'
                            value={data.name}
                            onChange={handleChange}
                            placeholder='Enter your name'
                        />
                    </div>

                    {/* Email */}
                    <div className='grid gap-1'>
                        <label htmlFor='email' className='dark:text-white'>Email :</label>
                        <input
                            type='email'
                            id='email'
                            className='bg-blue-50 dark:bg-neutral-800 dark:text-white dark:placeholder-neutral-400 p-2 border dark:border-neutral-700 rounded outline-none focus:border-primary-200 dark:focus:border-primary-200'
                            name='email'
                            value={data.email}
                            onChange={handleChange}
                            placeholder='Enter your email'
                        />
                    </div>

                    {/* Password */}
                    <div className='grid gap-1'>
                        <label htmlFor='password' className='dark:text-white'>Password :</label>
                        <div className='bg-blue-50 dark:bg-neutral-800 dark:text-white p-2 border dark:border-neutral-700 rounded flex items-center focus-within:border-primary-200 dark:focus-within:border-primary-200'>
                            <input
                                type={showPassword ? "text" : "password"}
                                id='password'
                                style={{
                                    background: "transparent",
                                    border: "0",
                                    outline: "0",
                                    padding: 0,
                                    margin: 0,
                                    boxShadow: "none",
                                    WebkitAppearance: "none",
                                    MozAppearance: "none",
                                    appearance: "none",
                                    width: "100%"
                                }}
                                className="w-full text-neutral-800 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400"
                                name='password'
                                value={data.password}
                                onChange={handleChange}
                                placeholder='Enter your password'
                            />
                            <div onClick={() => setShowPassword(prev => !prev)} className='cursor-pointer'>
                                {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                            </div>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div className='grid gap-1'>
                        <label htmlFor='confirmPassword' className='dark:text-white'>Confirm Password :</label>
                        <div className='bg-blue-50 dark:bg-neutral-800 dark:text-white p-2 border dark:border-neutral-700 rounded flex items-center focus-within:border-primary-200 dark:focus-within:border-primary-200'>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id='confirmPassword'
                                style={{
                                    background: "transparent",
                                    border: "0",
                                    outline: "0",
                                    padding: 0,
                                    margin: 0,
                                    boxShadow: "none",
                                    WebkitAppearance: "none",
                                    MozAppearance: "none",
                                    appearance: "none",
                                    width: "100%"
                                }}
                                className="w-full text-neutral-800 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400"
                                name='confirmPassword'
                                value={data.confirmPassword}
                                onChange={handleChange}
                                placeholder='Enter confirm password'
                            />
                            <div onClick={() => setShowConfirmPassword(prev => !prev)} className='cursor-pointer'>
                                {showConfirmPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                            </div>
                        </div>
                    </div>

                    {/* Hostel Name */}
                    <div className='grid gap-1'>
                        <label htmlFor='hostelName' className='dark:text-white'>Hostel Name :</label>
                        <input
                            type='text'
                            id='hostelName'
                            className='bg-blue-50 dark:bg-neutral-800 dark:text-white dark:placeholder-neutral-400 p-2 border dark:border-neutral-700 rounded outline-none focus:border-primary-200 dark:focus:border-primary-200'
                            name='hostelName'
                            value={data.hostelName}
                            onChange={handleChange}
                            placeholder='Enter your hostel name'
                        />
                    </div>

                    {/* Room Number */}
                    <div className='grid gap-1'>
                        <label htmlFor='roomNumber' className='dark:text-white'>Room Number :</label>
                        <input
                            type='text'
                            id='roomNumber'
                            className='bg-blue-50 dark:bg-neutral-800 dark:text-white dark:placeholder-neutral-400 p-2 border dark:border-neutral-700 rounded outline-none focus:border-primary-200 dark:focus:border-primary-200'
                            name='roomNumber'
                            value={data.roomNumber}
                            onChange={handleChange}
                            placeholder='Enter your room number'
                        />
                    </div>

                    {/* Mobile */}
                    <div className='grid gap-1'>
                        <label htmlFor='mobile' className='dark:text-white'>Mobile Number :</label>
                        <input
                            type='tel'
                            id='mobile'
                            className='bg-blue-50 dark:bg-neutral-800 dark:text-white dark:placeholder-neutral-400 p-2 border dark:border-neutral-700 rounded outline-none focus:border-primary-200 dark:focus:border-primary-200'
                            name='mobile'
                            value={data.mobile}
                            onChange={handleChange}
                            placeholder='Enter your mobile number'
                        />
                    </div>

                    <button disabled={!valideValue} className={`${valideValue ? "bg-primary-100 hover:bg-primary-200" : "bg-gray-500"} text-white py-2 rounded font-semibold my-3 tracking-wide`}>
                        Register
                    </button>
                </form>

                {/* Google OAuth Button */}
                <div className='mt-4 flex justify-center'>
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                    />
                </div>

                <p className='dark:text-white mt-4'>
                    Already have account? <Link to={"/login"} className='font-semibold text-primary-200 hover:text-primary-100'>Login</Link>
                </p>
            </div>
        </section>
    )
}

export default Register
