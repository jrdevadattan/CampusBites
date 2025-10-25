import app from '../app.js'
import connectDB from '../config/connectDB.js'

// Ensure DB is connected on cold start. connectDB is idempotent.
connectDB().catch(err => {
  console.error('MongoDB connection error (serverless):', err)
})

// Export the Express app as the default export. Vercel will call this function
// directly and Express app is a function (req, res) so this works.
export default app
