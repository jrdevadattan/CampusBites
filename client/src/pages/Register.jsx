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
                    {/* ... all your input fields remain unchanged ... */}

                    <button disabled={!valideValue} className={`${valideValue ? "bg-primary-100 hover:bg-primary-200" : "bg-gray-500"} text-white py-2 rounded font-semibold my-3 tracking-wide`}>
                        Register
                    </button>
                </form>

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
