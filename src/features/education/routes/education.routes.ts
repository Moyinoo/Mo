import express from 'express'
import { EducationController } from '../controllers/education.controller'

const educationRouter = express.Router()

educationRouter.get(
  '/education/:id',
  EducationController.prototype.getEducation,
)
educationRouter.put(
  '/education/update',
  EducationController.prototype.updateEducation,
)
educationRouter.post(
  '/education/create',
  EducationController.prototype.createEducation,
)
educationRouter.delete(
  '/education/delete/:id',
  EducationController.prototype.deleteEducation,
)

export { educationRouter }
