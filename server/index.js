import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import classRoutes from './routes/classRoutes.js'
import registerRoutes from './routes/registerRoutes.js'
import authRoutes from "./routes/authRoutes.js";
dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173'

app.use(cors({ origin: CLIENT_ORIGIN }))
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: 'Tutor Finder API is running' })
})

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Auth routes (must be before app.listen)
app.use("/api/auth", authRoutes)

// Class management routes
app.use('/api/classes', classRoutes)

// Tutor register route
app.use('/api/register', registerRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
