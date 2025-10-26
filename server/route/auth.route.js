import { Router } from 'express'
import { googleLogin, googleRegister } from '../controllers/auth.controller.js'

const authRouter = Router()

authRouter.post('/google-login', googleLogin)
authRouter.post('/google-register', googleRegister)

export default authRouter
