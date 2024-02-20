import express from 'express'
import { MatchedController } from '../controllers/matched.controller'

const matchedRouter = express.Router()

matchedRouter.post('/matched/create', MatchedController.prototype.createMatched)

export { matchedRouter }
