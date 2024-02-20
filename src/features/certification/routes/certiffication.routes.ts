import express from 'express'
import { CertificationController } from '../controllers/certification.controller'

const certificationRouter = express.Router()

certificationRouter.get(
  '/certification/:id',
  CertificationController.prototype.getCertification,
)
certificationRouter.put(
  '/certification/update',
  CertificationController.prototype.updateCertification,
)
certificationRouter.post(
  '/certification/create',
  CertificationController.prototype.createCertification,
)
certificationRouter.delete(
  '/certification/delete/:id',
  CertificationController.prototype.deleteCertification,
)

export { certificationRouter }
