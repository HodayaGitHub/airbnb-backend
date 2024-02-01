import http from 'http'
import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import path, { dirname } from 'path'
import { fileURLToPath } from 'url'

import { logger } from './services/logger.service.js'

const app = express()
const server = http.createServer(app)


const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'public')))
    console.log('__dirname: ', __dirname)
} else {
    const corsOptions = {
        origin: ['http://127.0.0.1:5173', 'http://localhost:5173', 'http://localhost:27017'],
        credentials: true
    }
    app.use(cors(corsOptions))
}


// Express App Config
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())



import { stayRoutes } from './api/stay/stay.routes.js'
app.use('/api/stay', stayRoutes)

import { authRoutes } from './api/auth/auth.routes.js'
app.use('/api/auth', authRoutes)

import { userRoutes } from './api/user/user.routes.js'
app.use('/api/user', userRoutes)



app.get('/**', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})


const port = process.env.PORT || 3030
server.listen(port, () =>
    logger.info(`Server listening on port http://127.0.0.1:${port}/`)
)



