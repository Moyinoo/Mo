import express from 'express'
import { ExperienceController } from '../controllers/experience.controller'

const experienceRouter = express.Router()

experienceRouter.get(
  '/experience/:id',
  ExperienceController.prototype.getExperience,
)
experienceRouter.put(
  '/experience/update',
  ExperienceController.prototype.updateExperience,
)
experienceRouter.post(
  '/experience/create',
  ExperienceController.prototype.createExperience,
)
experienceRouter.delete(
  '/experience/delete/:id',
  ExperienceController.prototype.deleteExperience,
)

export { experienceRouter }
