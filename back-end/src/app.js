import cors from 'cors'
import express from 'express'
import process from 'node:process'
import healthRoutes from './routes/health.routes.js'

const app = express()
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:8080')
  .split(',')
  .map((origin) => origin.trim())

app.use(cors({
  origin(origin, callback) {
    callback(null, !origin || allowedOrigins.includes(origin))
  },
}))
app.use(express.json({ limit: '1mb' }))
app.use('/api', healthRoutes)

app.use((request, response) => {
  response.status(404).json({ error: 'Rota não encontrada.' })
})

app.use((error, request, response, next) => {
  if (response.headersSent) return next(error)
  console.error(error)
  response.status(500).json({ error: 'Erro interno do servidor.' })
})

export default app
