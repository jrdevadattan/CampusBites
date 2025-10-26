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

// CORS options - allow the configured frontend in production. During local
// development (when FRONTEND_URL is not set) allow the origin dynamically so
// tools like Vite can connect without extra env config.
const corsOptions = {
    credentials: true,
    origin: frontendOrigin || (process.env.NODE_ENV !== 'production' ? true : false)
}

app.use(cors(corsOptions))
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

// Ensure COOP/COEP headers are present for postMessage/iframe popup flows.
// Helmet above configures COOP already, but some deployment platforms may
// override or strip headers; set them explicitly as a fallback.
app.use((req, res, next) => {
    // Allow popups to communicate back to the opener via postMessage
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups')
    // Avoid embedding restrictions that block third-party frames (GSI, etc.)
    res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none')
    next()
})

// Additional CORS preflight handling & explicit headers.
// This ensures deployed environments (and proxies) always return the
// required CORS response headers for browser preflight and credentialed
// requests. We echo the request Origin when allowed rather than using '*'
// so cookies can be used (with credentials: 'include').
app.use((req, res, next) => {
    const origin = req.headers.origin

    // If FRONTEND_URL is configured, only allow that origin. Otherwise in
    // development allow any origin by echoing back the request origin.
    if (frontendOrigin) {
        if (origin === frontendOrigin) {
            res.setHeader('Access-Control-Allow-Origin', origin)
        }
    } else if (origin) {
        // development fallback: echo origin so credentialed requests work
        res.setHeader('Access-Control-Allow-Origin', origin)
    }

    // Allow credentialed requests (cookies)
    res.setHeader('Access-Control-Allow-Credentials', 'true')

    // Allowed methods and headers for preflight requests
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')

    // Short-circuit OPTIONS preflight
    if (req.method === 'OPTIONS') {
        return res.sendStatus(204)
    }

    next()
})

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
