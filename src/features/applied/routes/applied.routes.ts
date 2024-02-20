import express from 'express'
import { AppliedController } from '../controllers/applied.controller'

const appliedRouter = express.Router()

appliedRouter.get(
  '/applied/user/:id',
  AppliedController.prototype.getAppliedUser,
)
appliedRouter.get(
  '/applied/school/:id',
  AppliedController.prototype.getAppliedSchool,
)
appliedRouter.get('/applied/job/:id', AppliedController.prototype.getAppliedJob)
appliedRouter.get(
  '/applied/user/:id',
  AppliedController.prototype.getAppliedUser,
)

appliedRouter.post('/applied/create', AppliedController.prototype.createApplied)
appliedRouter.delete(
  '/applied/delete/:id',
  AppliedController.prototype.deleteApplied,
)

export { appliedRouter }
