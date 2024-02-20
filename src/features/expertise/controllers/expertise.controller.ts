import { Request, Response } from 'express'
import { ExpertiseModel } from '../models/expertise.model'

export class ExpertiseController {
  async getExpertise(req: Request, res: Response) {
    const { id } = req.params
    try {
      const user = await ExpertiseModel.get(+id)
      res.status(200).send({
        message: 'Fetch successfull',
        data: typeof user === 'undefined' ? { skills: [] } : user,
      })
    } catch (error: any) {
      console.log(error)
      res.status(400).send({ message: error.message, data: {} })
    }
  }

  async updateExpertise(req: Request, res: Response) {
    try {
      const user = await ExpertiseModel.update({ ...req.body })
      res.status(200).send({ message: 'Update Succesfull', data: user })
    } catch (error: any) {
      console.log(error)
      res.status(400).send({ message: error.message, data: {} })
    }
  }

  async createExpertise(req: Request, res: Response) {
    try {
      const user = await ExpertiseModel.create({ ...req.body })
      res
        .status(200)
        .send({ message: 'Expertise added successfully', data: user.id })
    } catch (error: any) {
      console.log(error)
      res.status(400).send({ message: error.message, data: {} })
    }
  }

  async deleteExpertise(req: Request, res: Response) {
    const { id } = req.params
    try {
      const user = await ExpertiseModel.delete(+id)
      res.status(200).send({ message: 'Delete succesfull', data: user })
    } catch (error: any) {
      console.log(error)
      res.status(400).send({ message: error.message, data: {} })
    }
  }
}
