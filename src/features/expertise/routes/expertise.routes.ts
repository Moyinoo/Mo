import express from 'express'
import { ExpertiseController } from '../controllers/expertise.controller'

const expertiseRouter = express.Router()

expertiseRouter.get(
  '/expertise/:id',
  ExpertiseController.prototype.getExpertise,
)
expertiseRouter.put(
  '/expertise/update',
  ExpertiseController.prototype.updateExpertise,
)
expertiseRouter.post(
  '/expertise/create',
  ExpertiseController.prototype.createExpertise,
)
expertiseRouter.delete(
  '/expertise/delete/:id',
  ExpertiseController.prototype.deleteExpertise,
)

export { expertiseRouter }
