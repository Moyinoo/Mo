import express from 'express'
import { LocationController } from '../controllers/location.controller'

const locationRouter = express.Router()

locationRouter.get('/location/states', LocationController.prototype.getStates)
locationRouter.post(
  '/location/states/cities',
  LocationController.prototype.getCities,
)
locationRouter.post(
  '/location/states/lgas',
  LocationController.prototype.getLgas,
)

export { locationRouter }
