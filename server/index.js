import connectDB from './config/connectDB.js'
import app from './app.js'
import ProductModel from './models/product.model.js'

const PORT = process.env.PORT || 8080

// Connect to DB and start server for local/dev usage
connectDB()
    .then(async () => {
        // Ensure indexes (including text indexes) are present
        try{
            await ProductModel.syncIndexes()
            console.log('Product indexes synced')
        }catch(err){
            console.warn('Product index sync failed:', err?.message)
        }

        app.listen(PORT, () => {
            console.log('Server is running', PORT)
        })
    })
    .catch((err) => {
        console.error('Failed to connect to DB', err)
    })

