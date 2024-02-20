import { Request, Response } from 'express'
import { CertificationModel } from '../models/certification.model'

export class CertificationController {
  async getCertification(req: Request, res: Response) {
    const { id } = req.params
    try {
      const user = await CertificationModel.get(+id)
      res.status(200).send({
        message: 'Fetch successfull',
        data: typeof user === 'undefined' ? [] : user,
      })
    } catch (error: any) {
      console.log(error)
      res.status(400).send({ message: error.message, data: {} })
    }
  }

  async updateCertification(req: Request, res: Response) {
    try {
      const user = await CertificationModel.update({ ...req.body })
      res.status(200).send({ message: 'Update Succesfull', data: user })
    } catch (error: any) {
      console.log(error)
      res.status(400).send({ message: error.message, data: {} })
    }
  }

  async createCertification(req: Request, res: Response) {
    try {
      const user = await CertificationModel.create({ ...req.body })
      res
        .status(200)
        .send({ message: 'Certification added successfully', data: user.id })
    } catch (error: any) {
      console.log(error)
      res.status(400).send({ message: error.message, data: {} })
    }
  }

  async deleteCertification(req: Request, res: Response) {
    const { id } = req.params
    try {
      const user = await CertificationModel.delete(+id)
      res.status(200).send({ message: 'Delete succesfull', data: user })
    } catch (error: any) {
      console.log(error)
      res.status(400).send({ message: error.message, data: {} })
    }
  }
}
