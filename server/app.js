import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import helmet from 'helmet'
import userRouter from './route/user.route.js'
import categoryRouter from './route/category.route.js'
import uploadRouter from './route/upload.router.js'
import subCategoryRouter from './route/subCategory.route.js'
import productRouter from './route/product.route.js'
import cartRouter from './route/cart.route.js'
import addressRouter from './route/address.route.js'
import orderRouter from './route/order.route.js'
import authRouter from './route/auth.route.js'

const app = express()

// Normalize frontend URL to avoid mismatches like trailing slashes
const frontendOrigin = (process.env.FRONTEND_URL || '').replace(/\/$/, '')

app.use(cors({
    credentials: true,
    origin: frontendOrigin
}))
app.use(express.json())
app.use(cookieParser())
app.use(morgan('combined'))
// Configure helmet but relax COOP/COEP for Google Identity (GSI) iframe/postMessage
app.use(helmet({
    // prevent blocking Google iframe postMessage; allow popups to communicate
    crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
    // keep resource policy disabled as before
    crossOriginResourcePolicy: false,
    // do not enable Cross-Origin-Embedder-Policy which can block embedding external iframes
    crossOriginEmbedderPolicy: false
}))

app.get('/', (req, res) => {
    res.json({ message: 'Server is running' })
})

app.use('/api/user',userRouter)
app.use('/api/category',categoryRouter)
app.use('/api/file',uploadRouter)
app.use('/api/subcategory',subCategoryRouter)
app.use('/api/product',productRouter)
app.use('/api/cart',cartRouter)
app.use('/api/address',addressRouter)
app.use('/api/order',orderRouter)
app.use('/auth', authRouter)

export default app
