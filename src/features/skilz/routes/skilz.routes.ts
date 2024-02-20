import express from 'express'
import { SkilzController } from '../controllers/skilz.controller'

const skilzRouter = express.Router()

skilzRouter.get('/skilz/:id', SkilzController.prototype.getSkilz)
skilzRouter.put('/skilz/update', SkilzController.prototype.updateSkilz)
skilzRouter.post('/skilz/create', SkilzController.prototype.createSkilz)
// skilzRouter.delete(
//   '/skilz/delete/:id',
//   SkilzController.prototype.deleteSkilz,
// )

export { skilzRouter }
