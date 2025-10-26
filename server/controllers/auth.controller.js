import fetch from 'node-fetch'
import UserModel from '../models/user.model.js'
import bcryptjs from 'bcryptjs'
import generatedAccessToken from '../utils/generatedAccessToken.js'
import genertedRefreshToken from '../utils/generatedRefreshToken.js'
// ADDED: Email verification utilities
import verifyEmailTemplate from "../utils/verifyEmailTemplate.js"
import generatedOtp from "../utils/generatedOtp.js"
import sendEmail from "../config/sendEmail.js"
import forgotPasswordTemplate from "../utils/forgotPasswordTemplate.js"
import jwt from 'jsonwebtoken'

// Verify Google ID token via Google's tokeninfo endpoint
async function verifyGoogleToken(idToken){
    const url = `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`
    const res = await fetch(url)
    if(!res.ok) throw new Error('Invalid Google token')
    const data = await res.json()
    // Ensure the token was issued for our client id
    if(data.aud !== process.env.GOOGLE_CLIENT_ID){
        throw new Error('Token audience does not match')
    }
    return data
}

export async function googleRegister(request,response){
    try {
        const { token } = request.body
        if(!token) return response.status(400).json({ message: 'Token required', error: true, success: false })

        const profile = await verifyGoogleToken(token)
        const { email, name } = profile

        const existing = await UserModel.findOne({ email })
        if(existing){
            return response.status(400).json({ message: 'Email already registered', error: true, success: false })
        }

        // Create a random password since user authenticates via Google
        const randomPassword = Math.random().toString(36).slice(-12)
        const salt = await bcryptjs.genSalt(10)
        const hashPassword = await bcryptjs.hash(randomPassword, salt)

        const newUser = new UserModel({
            name,
            email,
            password: hashPassword,
            email_verify: true // MODIFIED: Google users are pre-verified
        })

        await newUser.save()

        return response.json({ message: 'Registered via Google', success: true, error: false })
    } catch (err) {
        console.error('[googleRegister]', err?.message || err)
        return response.status(500).json({ message: err?.message || 'Google registration failed', error: true, success: false })
    }
}

export async function googleLogin(request,response){
    try {
        const { token } = request.body
        if(!token) return response.status(400).json({ message: 'Token required', error: true, success: false })

        const profile = await verifyGoogleToken(token)
        const { email } = profile

        const user = await UserModel.findOne({ email })
        if(!user){
            return response.status(400).json({ message: 'User not registered. Please register first.', error: true, success: false })
        }

        const accesstoken = await generatedAccessToken(user._id)
        const refreshToken = await genertedRefreshToken(user._id)

        const cookiesOption = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'None'
        }

        response.cookie('accessToken',accesstoken,cookiesOption)
        response.cookie('refreshToken',refreshToken,cookiesOption)

        return response.json({ message: 'Login via Google successful', success: true, error: false, data: { accesstoken, refreshToken } })
    } catch (err) {
        console.error('[googleLogin]', err?.message || err)
        return response.status(500).json({ message: err?.message || 'Google login failed', error: true, success: false })
    }
}

// ADDED: Regular registration with email verification
export async function registerUserController(request, response) {
    try {
        const { name, email, password } = request.body

        if (!name || !email || !password) {
            return response.status(400).json({
                message: "Provide email, name, password",
                error: true,
                success: false
            })
        }

        const user = await UserModel.findOne({ email })
        if (user) {
            return response.json({
                message: "Email already registered",
                error: true,
                success: false
            })
        }

        const salt = await bcryptjs.genSalt(10)
        const hashPassword = await bcryptjs.hash(password, salt)

        const verifyEmailOtp = generatedOtp()
        const verifyEmailExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000)

        const newUser = new UserModel({
            name,
            email,
            password: hashPassword,
            verify_email: verifyEmailOtp,
            verify_email_expiry: verifyEmailExpiry,
            email_verify: false
        })

        await newUser.save()

        const verifyEmailHtml = verifyEmailTemplate({ name, otp: verifyEmailOtp })
        
        await sendEmail({
            sendTo: email,
            subject: "Verify email from CampusBites",
            html: verifyEmailHtml
        })

        return response.json({
            message: "User registered successfully. Please check email to verify account.",
            error: false,
            success: true,
            data: { _id: newUser._id, email: newUser.email, name: newUser.name }
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

// ADDED: Regular login with verification check
export async function loginController(request, response) {
    try {
        const { email, password } = request.body

        if (!email || !password) {
            return response.status(400).json({
                message: "Provide email, password",
                error: true,
                success: false
            })
        }

        const user = await UserModel.findOne({ email })

        if (!user) {
            return response.status(400).json({
                message: "User not registered",
                error: true,
                success: false
            })
        }

        if (!user.email_verify) {
            return response.status(400).json({
                message: "Please verify your email first",
                error: true,
                success: false
            })
        }

        const checkPassword = await bcryptjs.compare(password, user.password)

        if (!checkPassword) {
            return response.status(400).json({
                message: "Check your password",
                error: true,
                success: false
            })
        }

        const SECRET = process.env.SECRET_KEY_ACCESS_TOKEN || 'CampusBites_AccessToken_SecretKey_2024_Development'
        const REFRESH_SECRET = process.env.SECRET_KEY_REFRESH_TOKEN || 'CampusBites_RefreshToken_SecretKey_2024_Development'
        
        const token = await jwt.sign(
            { 
                id: user._id,
                email: user.email 
            },
            SECRET,
            { expiresIn: '8h' }
        )

        const refreshToken = await jwt.sign(
            { 
                id: user._id,
                email: user.email 
            },
            REFRESH_SECRET,
            { expiresIn: '7d' }
        )

        const cookiesOption = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        }

        response.cookie('accessToken', token, cookiesOption)
        response.cookie('refreshToken', refreshToken, cookiesOption)

        return response.json({
            message: "Login successful",
            error: false,
            success: true,
            data: {
                accessToken: token,
                refreshToken: refreshToken
            }
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

// ADDED: Verify email with OTP
export async function verifyEmailController(request, response) {
    try {
        const { email, otp } = request.body

        if (!email || !otp) {
            return response.status(400).json({
                message: "Provide email and OTP",
                error: true,
                success: false
            })
        }

        const user = await UserModel.findOne({ email })
        if (!user) {
            return response.status(400).json({
                message: "User not found",
                error: true,
                success: false
            })
        }

        if (user.verify_email !== otp) {
            return response.status(400).json({
                message: "Invalid OTP",
                error: true,
                success: false
            })
        }

        if (user.verify_email_expiry < new Date()) {
            return response.status(400).json({
                message: "OTP has expired",
                error: true,
                success: false
            })
        }

        // ADDED: Update verification status
        await UserModel.updateOne(
            { _id: user._id },
            {
                email_verify: true,
                verify_email: "",
                verify_email_expiry: null
            }
        )

        return response.json({
            message: "Email verified successfully",
            error: false,
            success: true
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

// ADDED: Resend verification email
export async function resendVerifyEmailController(request, response) {
    try {
        const { email } = request.body

        if (!email) {
            return response.status(400).json({
                message: "Provide email",
                error: true,
                success: false
            })
        }

        const user = await UserModel.findOne({ email })
        if (!user) {
            return response.status(400).json({
                message: "User not found",
                error: true,
                success: false
            })
        }

        if (user.email_verify) {
            return response.status(400).json({
                message: "Email is already verified",
                error: true,
                success: false
            })
        }

        // ADDED: Generate new OTP
        const verifyEmailOtp = generatedOtp()
        const verifyEmailExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000)

        await UserModel.updateOne(
            { _id: user._id },
            {
                verify_email: verifyEmailOtp,
                verify_email_expiry: verifyEmailExpiry
            }
        )

        // ADDED: Send new verification email
        const verifyEmailHtml = verifyEmailTemplate({ name: user.name, otp: verifyEmailOtp })
        await sendEmail({
            sendTo: email,
            subject: "Resend Verify email from CampusBites",
            html: verifyEmailHtml
        })

        return response.json({
            message: "Verification email sent successfully",
            error: false,
            success: true
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

// ADDED: Logout controller
export async function logoutController(request, response) {
    try {
        const userId = request.userId // from auth middleware

        const cookiesOption = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'None'
        }

        response.clearCookie('accessToken', cookiesOption)
        response.clearCookie('refreshToken', cookiesOption)

        const removeRefreshToken = await UserModel.findByIdAndUpdate(userId, {
            refresh_token: ""
        })

        return response.json({
            message: "Logout successfully",
            error: false,
            success: true
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

// ADDED: Forgot password controller
export async function forgotPasswordController(request, response) {
    try {
        const { email } = request.body

        if (!email) {
            return response.status(400).json({
                message: "Provide email",
                error: true,
                success: false
            })
        }

        const user = await UserModel.findOne({ email })

        if (!user) {
            return response.status(400).json({
                message: "Email not available",
                error: true,
                success: false
            })
        }

        const otp = generatedOtp()
        const expireTime = new Date() + 60 * 60 * 1000 // 1hr

        const update = await UserModel.findByIdAndUpdate(user._id, {
            forgot_password_otp: otp,
            forgot_password_expiry: new Date(expireTime).toISOString()
        })

        await sendEmail({
            sendTo: email,
            subject: "Forgot password from CampusBites",
            html: forgotPasswordTemplate({
                name: user.name,
                otp: otp
            })
        })

        return response.json({
            message: "Check email",
            error: false,
            success: true
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

// ADDED: Verify forgot password OTP
export async function verifyForgotPasswordOtp(request, response) {
    try {
        const { email, otp } = request.body

        if (!email || !otp) {
            return response.status(400).json({
                message: "Provide required field email, otp.",
                error: true,
                success: false
            })
        }

        const user = await UserModel.findOne({ email })

        if (!user) {
            return response.status(400).json({
                message: "Email not available",
                error: true,
                success: false
            })
        }

        const currentTime = new Date().toISOString()

        if (user.forgot_password_expiry < currentTime) {
            return response.status(400).json({
                message: "Otp is expired",
                error: true,
                success: false
            })
        }

        if (otp !== user.forgot_password_otp) {
            return response.status(400).json({
                message: "Invalid otp",
                error: true,
                success: false
            })
        }

        const updateUser = await UserModel.findByIdAndUpdate(user._id, {
            forgot_password_otp: "",
            forgot_password_expiry: ""
        })

        return response.json({
            message: "Verify otp successfully",
            error: false,
            success: true
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

// ADDED: Reset password controller
export async function resetPassword(request, response) {
    try {
        const { email, newPassword, confirmPassword } = request.body

        if (!email || !newPassword || !confirmPassword) {
            return response.status(400).json({
                message: "Provide required fields email, newPassword, confirmPassword"
            })
        }

        if (newPassword !== confirmPassword) {
            return response.status(400).json({
                message: "newPassword and confirmPassword must be same.",
                error: true,
                success: false,
            })
        }

        const user = await UserModel.findOne({ email })

        if (!user) {
            return response.status(400).json({
                message: "Email is not available",
                error: true,
                success: false
            })
        }

        const salt = await bcryptjs.genSalt(10)
        const hashPassword = await bcryptjs.hash(newPassword, salt)

        const update = await UserModel.findOneAndUpdate(user._id, {
            password: hashPassword
        })

        return response.json({
            message: "Password updated successfully.",
            error: false,
            success: true
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

// ADDED: Refresh token controller
export async function refreshToken(request, response) {
    try {
        const refreshToken = request.cookies.refreshToken || request?.headers?.authorization?.split(" ")[1]

        if (!refreshToken) {
            return response.status(401).json({
                message: "Invalid token",
                error: true,
                success: false
            })
        }

        const verifyToken = await jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH_TOKEN)

        if (!verifyToken) {
            return response.status(401).json({
                message: "token is expired",
                error: true,
                success: false
            })
        }

        const userId = verifyToken?._id

        const newAccessToken = await generatedAccessToken(userId)

        const cookiesOption = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: "None"
        }

        response.cookie('accessToken', newAccessToken, cookiesOption)

        return response.json({
            message: "New Access token generated",
            error: false,
            success: true,
            data: {
                accessToken: newAccessToken
            }
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

// ADDED: Get user details controller
export async function userDetails(request, response) {
    try {
        const user = await UserModel.findById(request.userId).select('-password')
        
        if (!user) {
            return response.status(404).json({
                message: "User not found",
                error: true,
                success: false
            })
        }

        return response.json({
            message: "User details",
            data: user,
            error: false,
            success: true
        })
        
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}
