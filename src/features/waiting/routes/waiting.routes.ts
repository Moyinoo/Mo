import express from 'express'
import { WaitingController } from '../controllers/waiting.controller'

const waitingRouter = express.Router()

waitingRouter.post('/waiting', WaitingController.prototype.saveWaiting)

export { waitingRouter }
