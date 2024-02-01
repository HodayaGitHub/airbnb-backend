import express from 'express'
import { log } from '../../middlewares/logger.middleware.js'
import {getStays, getById, removeStay, updateStay, addStay}  from './stay.controller.js'
import { requireAuth, requireAdmin } from '../../middlewares/requireAuth.middleware.js'

export const stayRoutes = express.Router()

stayRoutes.get('/', log, getStays)
stayRoutes.post('/', addStay)
stayRoutes.get('/:id', getById)

// admin required:
stayRoutes.put('/', requireAdmin, updateStay)
stayRoutes.delete('/:stayId', requireAdmin, removeStay)


// stayRoutes.post('/:id/msg', requireAuth, addStayMsg)
// stayRoutes.delete('/:id/msg/:msgId', requireAuth, removeStayMsg)


// stayRoutes.put('/', updateStay)
// stayRoutes.post('/', requireAuth, addStay)
// stayRoutes.delete('/:id', removeStay)
