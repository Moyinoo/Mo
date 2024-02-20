import express from 'express'
import { SelectedController } from '../controllers/selected.controller'

const selectedRouter = express.Router()

selectedRouter.get(
  '/selected/user/:id',
  SelectedController.prototype.getUserSelected,
)
selectedRouter.post(
  '/selected/create',
  SelectedController.prototype.createSelected,
)
selectedRouter.post('/selected', SelectedController.prototype.getSchoolSelected)
selectedRouter.post(
  '/selected/schedule',
  SelectedController.prototype.updateSelected,
)
selectedRouter.put(
  '/selected/status/school',
  SelectedController.prototype.updateSelectedHiredStatus,
)
selectedRouter.put(
  '/selected/status/user',
  SelectedController.prototype.updateSelectedHiredStatusUser,
)

export { selectedRouter }
