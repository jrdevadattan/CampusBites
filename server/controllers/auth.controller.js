import fetch from 'node-fetch'
import UserModel from '../models/user.model.js'
import bcryptjs from 'bcryptjs'
import generatedAccessToken from '../utils/generatedAccessToken.js'
import genertedRefreshToken from '../utils/generatedRefreshToken.js'

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
            verify_email: true
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
