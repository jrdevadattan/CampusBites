import connectDB from './config/connectDB.js'
import app from './app.js'

const PORT = process.env.PORT || 8080

// Connect to DB and start server for local/dev usage
connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log('Server is running', PORT)
        })
    })
    .catch((err) => {
        console.error('Failed to connect to DB', err)
    })

