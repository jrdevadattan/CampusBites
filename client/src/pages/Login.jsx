import React, { useState } from 'react'
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useNavigate } from 'react-router-dom';
import fetchUserDetails from '../utils/fetchUserDetails';
import { useDispatch } from 'react-redux';
import { setUserDetails } from '../store/userSlice';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
    const [data, setData] = useState({ email: "", password: "" })
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleChange = (e) => {
        const { name, value } = e.target
        setData(prev => ({ ...prev, [name]: value }))
    }

    const valideValue = Object.values(data).every(el => el)

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await Axios({ ...SummaryApi.login, data })
            if(response.data.error){
                toast.error(response.data.message)
                return
            }
            if(response.data.success){
                toast.success(response.data.message)
                localStorage.setItem('accesstoken', response.data.data.accesstoken)
                localStorage.setItem('refreshToken', response.data.data.refreshToken)

                const userDetails = await fetchUserDetails()
                if (userDetails && userDetails.success) {
                    dispatch(setUserDetails(userDetails.data))
                } else {
                    console.info('Login: fetchUserDetails returned no user data after login')
                }

                setData({ email: "", password: "" })
                navigate("/")
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const response = await Axios.post('/auth/google-login', {
                token: credentialResponse.credential
            })
            if(response.data.success){
                toast.success("Logged in with Google")
                localStorage.setItem('accesstoken', response.data.data.accesstoken)
                localStorage.setItem('refreshToken', response.data.data.refreshToken)
                
                const userDetails = await fetchUserDetails()
                if (userDetails && userDetails.success) {
                    dispatch(setUserDetails(userDetails.data))
                } else {
                    console.info('Google login: fetchUserDetails returned no user data after login')
                }

                navigate("/")
            } else {
                toast.error(response.data.message || "Google login failed")
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }

    const handleGoogleError = () => {
        toast.error("Google login failed")
    }

    return (
        <section className='w-full container mx-auto px-2'>
            <div className='bg-white dark:bg-neutral-900 my-4 w-full max-w-lg mx-auto rounded p-7'>
                <form className='grid gap-4 py-4' onSubmit={handleSubmit}>
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

                    <div className="grid gap-1">
                    <label htmlFor="password" className="dark:text-white">Password :</label>
                    <div className="bg-blue-50 dark:bg-neutral-800 dark:text-white p-2 border dark:border-neutral-700 rounded flex items-center focus-within:border-primary-200 dark:focus-within:border-primary-200">
                        <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={data.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
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
                        />

                        <button
                        type="button"
                        onClick={() => setShowPassword(prev => !prev)}
                        className="ml-2 cursor-pointer text-neutral-600 dark:text-neutral-300 hover:text-primary-200 transition-colors"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        style={{ background: "transparent", border: 0, padding: 0 }}
                        >
                        {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                        </button>
                    </div>

                    <Link to="/forgot-password" className="block ml-auto hover:text-primary-200 dark:text-neutral-300 dark:hover:text-primary-200">
                        Forgot password ?
                    </Link>
                    </div>

                    <button disabled={!valideValue} className={` ${valideValue ? "bg-primary-100 hover:bg-primary-200" : "bg-gray-500"} text-white py-2 rounded font-semibold my-3 tracking-wide`}>Login</button>
                </form>

                <div className='mt-4 flex justify-center'>
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                    />
                </div>

                <p className='dark:text-white mt-4'>
                    Don't have account? <Link to={"/register"} className='font-semibold text-primary-200 hover:text-primary-100'>Register</Link>
                </p>
            </div>
        </section>
    )
}

export default Login
