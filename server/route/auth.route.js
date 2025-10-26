import { Router } from 'express'
import { 
    googleRegister, 
    googleLogin,
    // ADDED: Regular authentication controllers
    registerUserController,
    loginController,
    logoutController,
    forgotPasswordController,
    verifyForgotPasswordOtp,
    resetPassword,
    refreshToken,
    userDetails,
    // ADDED: Email verification controllers
    verifyEmailController,
    resendVerifyEmailController
} from '../controllers/auth.controller.js'
// ADDED: Middleware import
import auth from '../middleware/auth.js'

const authRouter = Router()

// ADDED: Regular authentication routes
authRouter.post('/register', registerUserController)
authRouter.post('/login', loginController)
authRouter.get('/logout', auth, logoutController)

// ADDED: Password reset routes
authRouter.put('/forgot-password', forgotPasswordController)
authRouter.put('/verify-forgot-password-otp', verifyForgotPasswordOtp)
authRouter.put('/reset-password', resetPassword)

// ADDED: Token and user routes
authRouter.post('/refresh-token', refreshToken)
authRouter.get('/user-details', auth, userDetails)

// ADDED: Email verification routes
authRouter.post('/verify-email', verifyEmailController)
authRouter.post('/resend-verify-email', resendVerifyEmailController)

// Existing Google authentication routes
authRouter.post('/google-register', googleRegister)
authRouter.post('/google-login', googleLogin)

export default authRouter
