import express from 'express'
import { JobController } from '../controllers/job.controller'

const jobRouter = express.Router()

jobRouter.get('/job/user', JobController.prototype.getActiveJob)
jobRouter.get('/job/search', JobController.prototype.searchJob)
jobRouter.get('/job/user/match/:id', JobController.prototype.getActiveMatchJob)
jobRouter.get('/job/:id', JobController.prototype.getJob)
jobRouter.put('/job/update', JobController.prototype.updateJob)
jobRouter.post('/job/create', JobController.prototype.createJob)
jobRouter.delete('/job/delete/:id', JobController.prototype.deleteJob)

export { jobRouter }
