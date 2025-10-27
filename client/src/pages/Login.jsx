import React, { useState } from 'react'
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6"
import toast from 'react-hot-toast'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import { Link, useNavigate } from 'react-router-dom'
import fetchUserDetails from '../utils/fetchUserDetails'
import { useDispatch } from 'react-redux'
import { setUserDetails } from '../store/userSlice'

const Login = () => {
    const [data, setData] = useState({
        email: "",
        password: ""
    })
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleChange = (e) => {
        const { name, value } = e.target
        setData((preve) => {
            return {
                ...preve,
                [name]: value
            }
        })
    }

    const valideValue = Object.values(data).every(el => el)

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            setLoading(true)
            
            const response = await Axios({
                ...SummaryApi.login,
                data: data
            })

            if (response.data.success) {
                toast.success(response.data.message)
                localStorage.setItem('accessToken', response.data.data.accessToken)
                localStorage.setItem('refreshToken', response.data.data.refreshToken)

                const userDetails = await fetchUserDetails()
                dispatch(setUserDetails(userDetails.data))

                setData({
                    email: "",
                    password: ""
                })
                navigate('/')
            }

        } catch (error) {
            if (error.response?.data?.email_verify === false) {
                toast.error(error.response.data.message)
                localStorage.setItem('verificationEmail', data.email)
                navigate('/verify-email', {
                    state: {
                        email: data.email
                    }
                })
            } else {
                AxiosToastError(error)
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className='w-full container mx-auto px-2'>
            <div className='bg-white my-4 w-full max-w-lg mx-auto rounded p-7'>
                <form className='grid gap-4 py-4' onSubmit={handleSubmit}>
                    <div className='grid gap-1'>
                        <label htmlFor='email'>Email :</label>
                        <input
                            type='email'
                            id='email'
                            autoFocus
                            className='bg-blue-50 p-2 border rounded outline-none focus:border-primary-200'
                            name='email'
                            value={data.email}
                            onChange={handleChange}
                            placeholder='Enter email'
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

                    <button 
                        disabled={!valideValue || loading}
                        className={`${valideValue && !loading ? "bg-green-800 hover:bg-green-700" : "bg-gray-500"} text-white py-2 rounded font-semibold my-3 tracking-wide`}
                    >
                        {loading ? 'Signing In...' : 'Login'}
                    </button>
                </form>

                <p>
                    Don't have account ? <Link to={"/register"} className='font-semibold text-green-700 hover:text-green-800'>Register</Link>
                </p>

                <p>
                    <Link to={"/forgot-password"} className='font-semibold text-green-700 hover:text-green-800'>Forgot password ?</Link>
                </p>
            </div>
        </section>
    )
}

export default Login