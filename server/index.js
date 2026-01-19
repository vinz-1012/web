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

const allowedOrigins = CLIENT_ORIGIN.split(',')
  .map((s) => s.trim())
  .filter(Boolean)

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true)
    if (allowedOrigins.includes(origin)) return callback(null, true)
    return callback(new Error(`CORS blocked for origin: ${origin}`))
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}

app.use(cors(corsOptions))
app.options('*', cors(corsOptions))
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
