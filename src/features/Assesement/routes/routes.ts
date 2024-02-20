import express from 'express'
import { AssesementController } from '../controllers/assesement.controller'
const assesementRouter = express.Router()

assesementRouter.post('/assesement', AssesementController.prototype.sendMail)
assesementRouter.get('/assesement', AssesementController.prototype.renderMail)

export { assesementRouter }
