import express from 'express'
import { SchoolController } from '../controllers/school.controller'

const schoolRouter = express.Router()

schoolRouter.get('/school', SchoolController.prototype.getAllSchool)
schoolRouter.get('/school/:id', SchoolController.prototype.getSchool)
schoolRouter.put('/school/update', SchoolController.prototype.updateSchool)
schoolRouter.get('/schoolz/search', SchoolController.prototype.search)
schoolRouter.put('/school/verify', SchoolController.prototype.verifySchool)
schoolRouter.post('/school/create', SchoolController.prototype.createSchool)
schoolRouter.delete(
  '/school/delete/:id',
  SchoolController.prototype.deleteSchool,
)
schoolRouter.post('/school/filter', SchoolController.prototype.filterSchool)

export { schoolRouter }
